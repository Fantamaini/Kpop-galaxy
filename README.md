# K-POP GALAXY 🌟

Application mobile cross-platform pour les fans de K-pop, développée avec React Native et Expo.

## 📱 Fonctionnalités

- **Authentification** : Connexion sécurisée via Firebase (Email, Google, Apple)
- **News Feed** : Actualités K-pop en temps réel
- **Groupes K-pop** : Liste complète avec détails, membres et albums
- **Concerts** : Recherche via Ticketmaster API avec géolocalisation
- **Médiathèque** : MV, stages et émissions via YouTube API
- **Quiz Interactifs** : Testez vos connaissances avec badges et scores
- **Agenda** : Comebacks, anniversaires et événements
- **Favoris** : Sauvegardez vos groupes, idols et contenus préférés
- **Notifications** : Alertes pour les événements importants
- **Mode Sombre** : Interface adaptable

## 🚀 Installation

### Prérequis

- Node.js (v16+)
- npm ou yarn
- Expo CLI : `npm install -g expo-cli`
- Compte Firebase

### Étapes

1. **Cloner le projet**
```bash
cd PFE
npm install
```

2. **Configurer Firebase** (IMPORTANT - voir section plus bas)
- Créez ou réactivez un projet sur [Firebase Console](https://console.firebase.google.com)
- Activez Authentication → Email/Password (Google/Apple optionnels)
- Créez Firestore Database
- Activez Storage
- Récupérez le `firebaseConfig` (web app) et collez-le dans `src/config/firebase.js`
- (Optionnel) Déployez les règles `firestore.rules` et `storage.rules`

3. **Configurer les APIs**
- **Ticketmaster API** : Obtenez une clé sur [developer.ticketmaster.com](https://developer.ticketmaster.com)
- **YouTube Data API** : Activez l'API sur [Google Cloud Console](https://console.cloud.google.com)

4. **Créer le fichier .env**
```
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
TICKETMASTER_API_KEY=your_ticketmaster_key
YOUTUBE_API_KEY=your_youtube_key
```

5. **Lancer l'application**
```bash
npm start
# ou
expo start
```

## 📁 Structure du Projet

```
kpop-galaxy/
├── src/
│   ├── screens/          # Écrans de l'application
│   ├── components/       # Composants réutilisables
│   ├── navigation/       # Configuration de navigation
│   ├── store/           # Redux store et slices
│   ├── services/        # API services
│   ├── config/          # Configuration (Firebase, APIs)
│   ├── context/         # React Context (Theme)
│   ├── utils/           # Fonctions utilitaires
│   └── constants/       # Constantes et thèmes
├── assets/              # Images, icônes, fonts
├── App.js              # Point d'entrée
└── package.json        # Dépendances
```

## 🛠️ Technologies

- **Frontend** : React Native + Expo
- **Navigation** : React Navigation
- **State Management** : Redux Toolkit
- **Backend** : Firebase (Auth + Firestore)
- **APIs** : Ticketmaster, YouTube Data API v3
- **Stockage Local** : AsyncStorage

## 👥 Rôles

### Utilisateur
- Consultation des actualités et groupes
- Recherche de concerts
- Visionnage de vidéos
- Participation aux quiz
- Gestion de favoris

### Administrateur
- Gestion des contenus
- Supervision des utilisateurs
- Analyse des statistiques

## 📝 License

Ce projet est développé dans le cadre d'un projet de fin d'études.

## 📧 Contact

Pour toute question, contactez l'équipe de développement.
# Kpop-galaxy
