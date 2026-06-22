import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,           // Web only for Google (simple)
  signInWithCredential      // For future mobile Google
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth, db } from '../config/firebase';
import AdminService from './adminService';

/**
 * AUTH SERVICE (Firebase)
 * Authentification Email/Password + Google (web) via Firebase Auth.
 * Profils + rôle + données gamification stockés dans Firestore /users/{uid}.
 */

const CURRENT_USER_KEY = '@kpop_galaxy_current_user';

class AuthService {
  // ==================== EMAIL / PASSWORD ====================
  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Récupérer le profil complet depuis Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      let profile;

      if (userDoc.exists()) {
        profile = { uid: firebaseUser.uid, ...userDoc.data() };
      } else {
        // Premier login après création manuelle dans Firebase Console
        profile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || email.split('@')[0],
          role: 'user',
          xp: 0,
          levelTitle: 'Rookie Fan',
          badges: [],
          stats: { quizzesTaken: 0, correctAnswers: 0, favoriteGroups: 0 },
          favorites: { groups: [], idols: [], videos: [], concerts: [] },
          quizHistory: [],
          biases: [],
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), profile);
      }

      // Sauvegarde session locale (pour restaurer rapidement + offline-ish)
      const safeUser = { ...profile };
      delete safeUser.password; // au cas où
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

      return { success: true, user: safeUser };
    } catch (error) {
      let message = error.message;
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Email ou mot de passe incorrect';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Trop de tentatives. Réessayez plus tard.';
      }
      return { success: false, error: message };
    }
  }

  async signUpWithEmail(email, password, displayName, role = 'user') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName || email.split('@')[0],
        role: role,
        xp: 0,
        levelTitle: 'Rookie Fan',
        badges: [],
        stats: { quizzesTaken: 0, correctAnswers: 0, favoriteGroups: 0 },
        favorites: { groups: [], idols: [], videos: [], concerts: [] },
        quizHistory: [],
        biases: [],
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

      const safeUser = { ...userProfile, createdAt: new Date().toISOString() };
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

      return { success: true, user: safeUser };
    } catch (error) {
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') {
        message = 'Un compte avec cet email existe déjà.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Le mot de passe doit contenir au moins 6 caractères.';
      }
      return { success: false, error: message };
    }
  }

  // ==================== GOOGLE (Web simple) ====================
  async signInWithGoogle() {
    try {
      if (typeof window === 'undefined') {
        return { 
          success: false, 
          error: 'Google Sign-In sur mobile nécessite une configuration supplémentaire (expo-google-signin). Utilisez Email/Password pour le moment.' 
        };
      }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Créer ou récupérer le profil Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      let profile;
      if (userDoc.exists()) {
        profile = { uid: firebaseUser.uid, ...userDoc.data() };
      } else {
        profile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Utilisateur Google',
          role: 'user',
          xp: 0,
          levelTitle: 'Rookie Fan',
          badges: [],
          stats: { quizzesTaken: 0, correctAnswers: 0, favoriteGroups: 0 },
          favorites: { groups: [], idols: [], videos: [], concerts: [] },
          quizHistory: [],
          biases: [],
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, profile);
      }

      const safeUser = { ...profile };
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    } catch (error) {
      return { success: false, error: error.message || 'Erreur Google Sign-In' };
    }
  }

  async signInWithApple() {
    return {
      success: false,
      error: 'Apple Sign-In nécessite expo-apple-authentication + configuration Firebase supplémentaire. Utilisez Email/Password.'
    };
  }

  // ==================== SESSION / LOGOUT ====================
  async signOut() {
    try {
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      return { success: true };
    } catch (error) {
      // On force le nettoyage local même si Firebase échoue
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      return { success: true };
    }
  }

  async getCurrentUser() {
    try {
      const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (raw) return JSON.parse(raw);
      return null;
    } catch {
      return null;
    }
  }

  async isAdmin() {
    const user = await this.getCurrentUser();
    if (!user) return false;
    return user.role === 'admin';
  }

  // Récupère les données complètes (gamif etc.) depuis Firestore
  async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) return { success: false, error: 'User not found' };
      return { success: true, data: { uid, ...userDoc.data() } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateUserData(uid, data) {
    try {
      await AdminService.updateUser(uid, data); // délégué à AdminService (Firestore)
      // Met à jour aussi le cache local si c'est l'utilisateur courant
      const current = await this.getCurrentUser();
      if (current && current.uid === uid) {
        const updated = { ...current, ...data };
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Mode démo (toujours disponible, utile pour tests rapides sans compte)
  async signInDemo() {
    const demoUser = {
      uid: 'demo-user-123',
      email: 'demo@kpopgalaxy.com',
      displayName: 'Fan K-POP (Démo)',
      role: 'user',
      xp: 320,
      levelTitle: 'Rookie Fan',
      badges: [],
      stats: { quizzesTaken: 3, correctAnswers: 18, favoriteGroups: 2 },
      favorites: { groups: [], idols: [], videos: [], concerts: [] },
      quizHistory: [],
      biases: []
    };
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
    return { success: true, user: demoUser };
  }

  async clearSession() {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }

  // Écouteur d'état Firebase Auth (recommandé pour App.js)
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        let user = null;
        if (userDoc.exists()) {
          user = { uid: firebaseUser.uid, ...userDoc.data() };
          await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        }
        callback(user);
      } else {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
        callback(null);
      }
    });
  }
}

export default new AuthService();
