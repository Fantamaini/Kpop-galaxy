import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Gamification Service - Firebase (données dans users/{uid})
 * XP, Levels, Badges, Quiz history, stats...
 */

export const LEVELS = [
  { id: 1, title: 'Rookie Fan', minXP: 0, maxXP: 499, color: '#10B981' },
  { id: 2, title: 'Dedicated Stan', minXP: 500, maxXP: 1499, color: '#F59E0B' },
  { id: 3, title: 'Ultimate Idol Expert', minXP: 1500, maxXP: Infinity, color: '#FF2D95' }
];

export const XP_REWARDS = {
  READ_NEWS: 15,
  ADD_FAVORITE: 8,
  COMPLETE_QUIZ_BASE: 40,
  QUIZ_PERFECT_BONUS: 30,
  QUIZ_HIGH_SCORE_BONUS: 15,
  DAILY_LOGIN: 10,
  COMMENT: 5
};

export const BADGES = [
  { id: 'debutant', name: 'Débutant', icon: '🌱', requirement: 'Compléter 1 quiz', type: 'milestone' },
  { id: 'fan', name: 'Fan', icon: '⭐', requirement: 'Compléter 5 quiz', type: 'milestone' },
  { id: 'expert', name: 'Expert', icon: '🏆', requirement: 'Compléter 10 quiz', type: 'milestone' },
  { id: 'legende', name: 'Légende', icon: '👑', requirement: 'Compléter 25 quiz', type: 'milestone' },
  { id: 'kpop-master', name: 'K-Pop Master', icon: '💎', requirement: 'Compléter 50 quiz', type: 'milestone' },
  { id: 'felix-lover', name: 'Felix Lover', icon: '🐱', requirement: 'Ajouter Stray Kids en favori', type: 'rare' },
  { id: 'mv-expert', name: 'MV Expert', icon: '🎬', requirement: 'Regarder beaucoup de vidéos', type: 'rare' },
  { id: 'quiz-whiz', name: 'Quiz Whiz', icon: '🧠', requirement: 'Score parfait sur plusieurs quizzes', type: 'rare' }
];

export function calculateLevel(xp = 0) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(xp = 0) {
  const level = calculateLevel(xp);
  if (level.maxXP === Infinity) return 1;
  const range = level.maxXP - level.minXP;
  return Math.min(1, Math.max(0, (xp - level.minXP) / range));
}

class GamificationService {
  async getUserGamification(uid) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (!snap.exists()) return { success: false, error: 'User not found' };

      const user = snap.data();
      const xp = user.xp || 0;
      const level = calculateLevel(xp);
      return {
        success: true,
        data: {
          xp,
          level,
          progress: getLevelProgress(xp),
          badges: user.badges || [],
          stats: user.stats || {},
          title: level.title,
          biases: user.biases || []
        }
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async awardXP(uid, amount) {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return { success: false, error: 'User not found' };

      const user = snap.data();
      const oldXP = user.xp || 0;
      const newXP = Math.max(0, oldXP + amount);
      const oldLevel = calculateLevel(oldXP);
      const newLevel = calculateLevel(newXP);

      const updatePayload = {
        xp: newXP,
        levelTitle: newLevel.title
      };

      await updateDoc(userRef, updatePayload);

      const leveledUp = newLevel.id > oldLevel.id;

      return {
        success: true,
        data: { oldXP, newXP, amountAwarded: amount, leveledUp, oldLevel, newLevel }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async awardActionXP(uid, action) {
    const amount = XP_REWARDS[action] || 5;
    return this.awardXP(uid, amount);
  }

  async updateStats(uid, statUpdates) {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return { success: false };

      const currentStats = snap.data().stats || {};
      await updateDoc(userRef, { stats: { ...currentStats, ...statUpdates } });
      return { success: true, data: { ...currentStats, ...statUpdates } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async recordQuizCompletion(uid, quizResult) {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return { success: false, error: 'User not found' };

      const user = snap.data() || {};
      const quizHistory = [...(user.quizHistory || [])];
      const stats = { ...(user.stats || { quizzesTaken: 0, correctAnswers: 0 }) };

      const newEntry = { ...quizResult, completedAt: new Date().toISOString() };
      quizHistory.unshift(newEntry);
      if (quizHistory.length > 50) quizHistory.pop();

      stats.quizzesTaken = (stats.quizzesTaken || 0) + 1;
      stats.correctAnswers = (stats.correctAnswers || 0) + (quizResult.correctAnswers || 0);

      // XP
      let xpGain = XP_REWARDS.COMPLETE_QUIZ_BASE;
      const accuracy = quizResult.totalQuestions > 0
        ? (quizResult.correctAnswers / quizResult.totalQuestions)
        : 0;

      if (accuracy === 1) xpGain += XP_REWARDS.QUIZ_PERFECT_BONUS;
      else if (accuracy >= 0.8) xpGain += XP_REWARDS.QUIZ_HIGH_SCORE_BONUS;

      const oldXP = user.xp || 0;
      const newXP = oldXP + xpGain;
      const oldLevel = calculateLevel(oldXP);
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel.id > oldLevel.id;

      // Badges
      const newBadges = [];
      const existing = new Set((user.badges || []).map(b => b.id));
      const qCount = stats.quizzesTaken;

      const milestones = [
        { c: 1, b: BADGES.find(x => x.id === 'debutant') },
        { c: 5, b: BADGES.find(x => x.id === 'fan') },
        { c: 10, b: BADGES.find(x => x.id === 'expert') },
        { c: 25, b: BADGES.find(x => x.id === 'legende') },
        { c: 50, b: BADGES.find(x => x.id === 'kpop-master') }
      ];

      const updatedBadges = [...(user.badges || [])];
      for (const m of milestones) {
        if (qCount >= m.c && m.b && !existing.has(m.b.id)) {
          const badge = { ...m.b, earnedAt: new Date().toISOString() };
          newBadges.push(badge);
          updatedBadges.push(badge);
        }
      }

      await updateDoc(userRef, {
        xp: newXP,
        levelTitle: newLevel.title,
        quizHistory,
        stats,
        badges: updatedBadges
      });

      return {
        success: true,
        xpGained: xpGain,
        leveledUp,
        newLevel,
        newBadges
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async setBiasesAndFavorites(uid, biases = [], favoriteGroupIds = []) {
    return AdminService.updateUser(uid, { biases, favoriteGroupIds });
  }
}

export default new GamificationService();
