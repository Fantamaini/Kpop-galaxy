/**
 * Firebase Configuration - K-POP GALAXY
 * 
 * 🔥 FIREBASE RÉACTIVÉ - Voir instructions complètes en bas de ce message
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// =============================================
// 🔥 CONFIG FIREBASE (clé fournie par l'utilisateur - DERNIÈRE VERSION)
// =============================================
// IMPORTANT : Remplace les autres valeurs ci-dessous par les vraies de ta console.
// La meilleure façon : 
//   Console Firebase → Paramètres du projet (⚙️) → Général → "Vos applications" 
//   → Clique sur l'app Web (</>) → Copie TOUT l'objet firebaseConfig et colle-le ici.
const firebaseConfig = {
  apiKey: "AIzaSyDdrwceH8Qq-cI9yyt0h50otNSgpy9RGWY",   // ← Ta clé API fournie (mise à jour)
  authDomain: "TON-PROJET-ID.firebaseapp.com",          // ← À remplacer (ex: kpop-galaxy-xxx.firebaseapp.com)
  projectId: "TON-PROJET-ID",                            // ← À remplacer (ex: kpop-galaxy-xxx)
  storageBucket: "TON-PROJET-ID.appspot.com",           // ← À remplacer (ex: kpop-galaxy-xxx.appspot.com)
  messagingSenderId: "TON-MESSAGING-SENDER-ID",         // ← À remplacer
  appId: "TON-APP-ID",                                   // ← À remplacer (ex: 1:123456789:web:abcdef123456)
  // measurementId: "G-XXXXXXX"                        // optionnel (Analytics)
};

// Initialize Firebase (évite double init en hot reload)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Services principaux
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export par défaut pour compat
export default app;

/*
============================================================
INSTRUCTIONS POUR COMPLÉTER LA CONFIG (tu as déjà donné l'apiKey)
============================================================

ÉTAPE 1 : Copie le config COMPLET (recommandé)
------------------------------------------------
1. Va sur https://console.firebase.google.com/
2. Ouvre ton projet
3. Clique sur l'icône ⚙️ (Paramètres du projet) en haut à gauche
4. Dans l'onglet "Général", descends jusqu'à "Vos applications"
5. Clique sur l'application Web (icône </>)
6. Tu verras un bloc comme ça :
     const firebaseConfig = {
       apiKey: "...",
       authDomain: "...",
       projectId: "...",
       ...
     };
7. Copie TOUT cet objet et colle-le à la place du firebaseConfig dans ce fichier.

ÉTAPE 2 : Active les services (si ce n'est pas déjà fait)
------------------------------------------------
- Authentication → Commencer → Active "Email/Password"
- Firestore Database → Créer une base de données
- Storage → Commencer

ÉTAPE 3 : Crée ton compte admin (CRUCIAL)
------------------------------------------------
- Authentication → Utilisateurs → "Ajouter un utilisateur"
  Exemple : admin@kpopgalaxy.com / admin123
- Puis dans Firestore → Collection "users" :
  Crée un document dont l'ID = l'UID du compte que tu viens de créer.
  Ajoute au minimum :
    {
      "role": "admin",
      "email": "admin@kpopgalaxy.com",
      "displayName": "Admin Galaxy",
      "xp": 0,
      "levelTitle": "Ultimate Idol Expert",
      ... (le reste des champs gamification si tu veux)
    }

ÉTAPE 4 : Règles de sécurité
------------------------------------------------
Va dans :
- Firestore → Règles → copie le contenu de firestore.rules (à la racine du projet) et publie
- Storage → Règles → copie le contenu de storage.rules et publie

ÉTAPE 5 : Test
------------------------------------------------
  npm start
  (ou expo start)

Erreurs courantes :
- "Firebase: Error (auth/invalid-api-key)" → tu as mal copié la clé ou un autre champ
- "permission-denied" → règles pas publiées OU le doc users n'a pas role: "admin"
- L'écran admin n'apparaît pas → le rôle n'est pas bien mis dans Firestore

Une fois que tu as le config complet, envoie-moi les autres valeurs (projectId etc.) si tu veux que je les mette directement, ou dis-moi les erreurs que tu vois.
*/
