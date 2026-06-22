import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  setDoc,
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * AdminService - Firestore (Firebase réactivé)
 * CRUD pour toutes les collections gérées depuis le Dashboard Admin.
 */

function generateId(prefix = 'item') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

// Helper pour convertir les timestamps Firestore en string ISO si besoin
function normalizeDoc(docSnap) {
  const data = docSnap.data() || {};
  const id = docSnap.id;
  // Convertir createdAt / timestamps
  const normalized = { id, ...data };
  if (normalized.createdAt && typeof normalized.createdAt.toDate === 'function') {
    normalized.createdAt = normalized.createdAt.toDate().toISOString();
  }
  if (normalized.updatedAt && typeof normalized.updatedAt.toDate === 'function') {
    normalized.updatedAt = normalized.updatedAt.toDate().toISOString();
  }
  return normalized;
}

// ==================== PUBLIC API (signatures identiques à l'ancienne version locale) ====================

class AdminService {
  // --- NEWS ---
  async createNews(newsData) {
    try {
      const payload = {
        ...newsData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        likes: 0
      };
      const docRef = await addDoc(collection(db, 'news'), payload);
      return { success: true, id: docRef.id, data: { id: docRef.id, ...newsData } };
    } catch (error) {
      console.error('createNews error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateNews(newsId, newsData) {
    try {
      const ref = doc(db, 'news', newsId);
      await updateDoc(ref, {
        ...newsData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteNews(newsId) {
    try {
      await deleteDoc(doc(db, 'news', newsId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllNews() {
    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(normalizeDoc);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  }

  // --- GROUPS ---
  async createGroup(groupData) {
    try {
      const payload = {
        ...groupData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        followers: groupData.followers || 0
      };
      const docRef = await addDoc(collection(db, 'groups'), payload);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateGroup(groupId, groupData) {
    try {
      await updateDoc(doc(db, 'groups', groupId), {
        ...groupData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteGroup(groupId) {
    try {
      await deleteDoc(doc(db, 'groups', groupId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllGroups() {
    try {
      const snapshot = await getDocs(collection(db, 'groups'));
      const data = snapshot.docs.map(normalizeDoc);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  }

  // --- CONCERTS ---
  async createConcert(concertData) {
    try {
      const payload = {
        ...concertData,
        createdAt: serverTimestamp(),
        interested: 0
      };
      const docRef = await addDoc(collection(db, 'concerts'), payload);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateConcert(concertId, concertData) {
    try {
      await updateDoc(doc(db, 'concerts', concertId), {
        ...concertData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteConcert(concertId) {
    try {
      await deleteDoc(doc(db, 'concerts', concertId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllConcerts() {
    try {
      const q = query(collection(db, 'concerts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(normalizeDoc);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  }

  // --- MEDIA ---
  async createMedia(mediaData) {
    try {
      const payload = {
        ...mediaData,
        createdAt: serverTimestamp(),
        views: 0,
        likes: 0
      };
      const docRef = await addDoc(collection(db, 'media'), payload);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateMedia(mediaId, mediaData) {
    try {
      await updateDoc(doc(db, 'media', mediaId), {
        ...mediaData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteMedia(mediaId) {
    try {
      await deleteDoc(doc(db, 'media', mediaId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllMedia() {
    try {
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(normalizeDoc);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  }

  // --- QUIZ ---
  async createQuiz(quizData) {
    try {
      const payload = {
        ...quizData,
        createdAt: serverTimestamp(),
        plays: 0
      };
      const docRef = await addDoc(collection(db, 'quiz'), payload);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateQuiz(quizId, quizData) {
    try {
      await updateDoc(doc(db, 'quiz', quizId), {
        ...quizData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteQuiz(quizId) {
    try {
      await deleteDoc(doc(db, 'quiz', quizId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllQuiz() {
    try {
      const snapshot = await getDocs(collection(db, 'quiz'));
      const data = snapshot.docs.map(normalizeDoc);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  }

  // --- EVENTS / AGENDA ---
  async createEvent(eventData) {
    try {
      const payload = { ...eventData, createdAt: serverTimestamp(), attendees: 0 };
      const docRef = await addDoc(collection(db, 'events'), payload);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateEvent(eventId, eventData) {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        ...eventData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteEvent(eventId) {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllEvents() {
    try {
      const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(normalizeDoc);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  }

  // --- USERS ---
  async getAllUsers() {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      // Jamais retourner de mots de passe (ils ne sont de toute façon pas dans Firestore)
      const data = snapshot.docs.map(d => {
        const { password, ...safe } = d.data() || {};
        return { id: d.id, uid: d.id, ...safe };
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  }

  // Crée un document utilisateur dans Firestore (profil + rôle + stats)
  // ⚠️ Ceci NE crée PAS le compte Firebase Auth.
  //   - L'utilisateur doit s'inscrire via l'écran Register (recommandé)
  //   - Ou l'admin crée le compte manuellement dans Firebase Console > Authentication > Users
  async createUserRecord(userData) {
    try {
      const uid = generateId('user');
      const newUser = {
        uid,
        email: userData.email,
        displayName: userData.displayName || 'Nouveau Fan',
        role: userData.role || 'user',
        xp: 0,
        levelTitle: 'Rookie Fan',
        badges: [],
        stats: { quizzesTaken: 0, correctAnswers: 0, favoriteGroups: 0 },
        favorites: { groups: [], idols: [], videos: [], concerts: [] },
        quizHistory: [],
        biases: [],
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, 'users', uid), newUser);
      return { success: true, id: uid };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateUser(userId, userData) {
    try {
      const ref = doc(db, 'users', userId);
      await updateDoc(ref, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateUserRole(userId, role) {
    return this.updateUser(userId, { role });
  }

  async deleteUser(userId) {
    try {
      await deleteDoc(doc(db, 'users', userId));
      // Note: le compte Auth n'est pas supprimé automatiquement (faire manuellement dans Console ou via Cloud Function)
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // --- COMMENTS ---
  async getComments(targetId, targetType = 'news') {
    try {
      const q = query(
        collection(db, 'comments'),
        where('targetId', '==', String(targetId)),
        where('targetType', '==', targetType),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(normalizeDoc);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  }

  async addComment(targetId, targetType, userId, userName, text) {
    try {
      const comment = {
        targetId: String(targetId),
        targetType,
        userId,
        userName,
        text: text.trim(),
        createdAt: serverTimestamp(),
        likesCount: 0
      };
      const docRef = await addDoc(collection(db, 'comments'), comment);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteComment(commentId) {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // --- STATISTICS ---
  async getStatistics() {
    try {
      const [usersSnap, newsSnap, groupsSnap, concertsSnap, mediaSnap, quizSnap, eventsSnap, commentsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'news')),
        getDocs(collection(db, 'groups')),
        getDocs(collection(db, 'concerts')),
        getDocs(collection(db, 'media')),
        getDocs(collection(db, 'quiz')),
        getDocs(collection(db, 'events')),
        getDocs(collection(db, 'comments'))
      ]);

      return {
        success: true,
        data: {
          users: usersSnap.size,
          news: newsSnap.size,
          groups: groupsSnap.size,
          concerts: concertsSnap.size,
          media: mediaSnap.size,
          quiz: quizSnap.size,
          events: eventsSnap.size,
          comments: commentsSnap.size
        }
      };
    } catch (error) {
      // Retourne des zéros en cas d'erreur (ex: règles pas encore publiées)
      return {
        success: false,
        error: error.message,
        data: { users: 0, news: 0, groups: 0, concerts: 0, media: 0, quiz: 0, events: 0, comments: 0 }
      };
    }
  }

  // --- Reset (dev only) ---
  // Attention: en production Firestore, ceci ne fait rien de sûr. Utilise avec prudence.
  async resetDatabase() {
    console.warn('resetDatabase() est désactivé en mode Firebase (utilise la console Firestore pour vider les collections)');
    return { success: false, error: 'Reset non supporté en mode Firestore depuis le client. Vide manuellement via la console.' };
  }

  // === RAW DB (pour compat temporaire avec les anciens services locaux) ===
  // Ces méthodes sont lourdes en Firebase. Idéalement les services (favorites, gamification, comments)
  // devraient être migrés pour utiliser directement Firestore ou AdminService.
  async getRawDB() {
    console.warn('getRawDB() est déprécié en mode Firebase. Utilise les méthodes spécifiques (getAllXXX, getUserData...).');
    // On retourne un snapshot "plat" pour ne pas tout casser tout de suite
    try {
      const [users, news, groups, concerts, media, quiz, events, comments] = await Promise.all([
        this.getAllUsers(),
        this.getAllNews(),
        this.getAllGroups(),
        this.getAllConcerts(),
        this.getAllMedia(),
        this.getAllQuiz(),
        this.getAllEvents(),
        this.getComments('', '') // rough
      ]);
      return {
        users: users.data || [],
        news: news.data || [],
        groups: groups.data || [],
        concerts: concerts.data || [],
        media: media.data || [],
        quiz: quiz.data || [],
        events: events.data || [],
        comments: comments.data || []
      };
    } catch {
      return { users: [], news: [], groups: [], concerts: [], media: [], quiz: [], events: [], comments: [] };
    }
  }

  async saveRawDB() {
    console.warn('saveRawDB() ignoré en mode Firebase (les écritures sont directes).');
  }
}

export default new AdminService();
