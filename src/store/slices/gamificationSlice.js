import { createSlice } from '@reduxjs/toolkit';
import { LEVELS, calculateLevel } from '../../services/gamificationService';

const initialState = {
  xp: 0,
  level: LEVELS[0],
  progress: 0,
  badges: [],
  quizHistory: [],
  stats: {
    quizzesTaken: 0,
    correctAnswers: 0,
    favoriteGroups: 0
  },
  biases: [],
  favoriteGroupIds: [],
  loading: false,
  error: null
};

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    setGamificationData: (state, action) => {
      const payload = action.payload || {};
      state.xp = payload.xp || 0;
      state.level = calculateLevel(state.xp);
      state.progress = payload.progress || 0;
      state.badges = payload.badges || [];
      state.stats = payload.stats || state.stats;
      state.biases = payload.biases || [];
      state.favoriteGroupIds = payload.favoriteGroupIds || [];
      state.quizHistory = payload.quizHistory || [];
      state.loading = false;
    },
    addXP: (state, action) => {
      state.xp = (state.xp || 0) + (action.payload || 0);
      const newLevel = calculateLevel(state.xp);
      const leveled = newLevel.id !== state.level.id;
      state.level = newLevel;
      // Recalculate progress (approximate; real value set on sync)
      state.progress = Math.min(1, (state.xp - newLevel.minXP) / ((newLevel.maxXP || (newLevel.minXP + 500)) - newLevel.minXP || 500));
      if (leveled && !state.justLeveledUp) {
        state.justLeveledUp = true;
      }
    },
    clearLevelUpFlag: (state) => {
      state.justLeveledUp = false;
    },
    addBadge: (state, action) => {
      const exists = state.badges.find(b => b.id === action.payload.id);
      if (!exists) {
        state.badges.push(action.payload);
      }
    },
    setBadges: (state, action) => {
      state.badges = action.payload || [];
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setBiases: (state, action) => {
      state.biases = action.payload || [];
    },
    addQuizToHistory: (state, action) => {
      state.quizHistory.unshift(action.payload);
      if (state.quizHistory.length > 50) state.quizHistory.pop();
    },
    resetGamification: () => initialState,
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; }
  }
});

export const {
  setGamificationData,
  addXP,
  clearLevelUpFlag,
  addBadge,
  setBadges,
  updateStats,
  setBiases,
  addQuizToHistory,
  resetGamification,
  setLoading,
  setError
} = gamificationSlice.actions;

export default gamificationSlice.reducer;
