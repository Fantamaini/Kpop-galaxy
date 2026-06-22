# Architecture du Projet K-POP GALAXY

## Vue d'ensemble

K-POP GALAXY est une application mobile cross-platform développée avec React Native et Expo, utilisant une architecture moderne basée sur Redux pour la gestion d'état.

## Stack Technologique

### Frontend
- **React Native** : Framework mobile cross-platform
- **Expo** : Outils de développement et build
- **React Navigation** : Navigation entre écrans
- **Redux Toolkit** : Gestion d'état globale
- **Expo Linear Gradient** : Effets visuels

### Backend & Services
- **Firebase Authentication** : Gestion des utilisateurs
- **Firestore** : Base de données NoSQL
- **Firebase Cloud Messaging** : Notifications push
- **AsyncStorage** : Stockage local

### APIs Externes
- **Ticketmaster API** : Recherche de concerts
- **YouTube Data API v3** : Vidéos K-pop

## Structure du Projet

```
kpop-galaxy/
│
├── src/
│   ├── components/           # Composants réutilisables
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── GroupCard.js
│   │   ├── NewsCard.js
│   │   └── LoadingSpinner.js
│   │
│   ├── screens/             # Écrans de l'application
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── Home/
│   │   │   └── HomeScreen.js
│   │   ├── News/
│   │   │   └── NewsFeedScreen.js
│   │   ├── Groups/
│   │   │   ├── GroupsListScreen.js
│   │   │   └── GroupDetailsScreen.js
│   │   ├── Concerts/
│   │   │   └── ConcertsScreen.js
│   │   ├── Media/
│   │   │   └── MediaLibraryScreen.js
│   │   ├── Quiz/
│   │   │   ├── QuizScreen.js
│   │   │   └── QuizPlayScreen.js
│   │   ├── Agenda/
│   │   │   └── AgendaScreen.js
│   │   └── Profile/
│   │       └── ProfileScreen.js
│   │
│   ├── navigation/          # Configuration de navigation
│   │   └── AppNavigator.js
│   │
│   ├── store/              # Redux store
│   │   ├── index.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── newsSlice.js
│   │       ├── groupsSlice.js
│   │       ├── concertsSlice.js
│   │       ├── mediaSlice.js
│   │       ├── quizSlice.js
│   │       └── favoritesSlice.js
│   │
│   ├── services/           # Services API
│   │   ├── authService.js
│   │   ├── ticketmasterService.js
│   │   └── youtubeService.js
│   │
│   ├── config/             # Configuration
│   │   ├── firebase.js
│   │   └── api.js
│   │
│   ├── context/            # React Context
│   │   └── ThemeContext.js
│   │
│   ├── constants/          # Constantes
│   │   ├── theme.js
│   │   └── data.js
│   │
│   └── utils/              # Utilitaires
│       ├── dateUtils.js
│       ├── storage.js
│       └── helpers.js
│
├── assets/                 # Ressources statiques
├── App.js                 # Point d'entrée
├── app.json              # Configuration Expo
├── package.json          # Dépendances
├── babel.config.js       # Configuration Babel
├── README.md             # Documentation
└── SETUP_GUIDE.md        # Guide de configuration

```

## Flux de Données

### Architecture Redux

```
┌─────────────┐
│   Screen    │
└──────┬──────┘
       │
       │ dispatch(action)
       ▼
┌─────────────┐
│   Action    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Reducer   │
└──────┬──────┘
       │
       │ update state
       ▼
┌─────────────┐
│    Store    │
└──────┬──────┘
       │
       │ useSelector
       ▼
┌─────────────┐
│   Screen    │ (re-render)
└─────────────┘
```

### Flux d'authentification

```
1. User → LoginScreen
2. LoginScreen → dispatch(setLoading(true))
3. LoginScreen → AuthService.signInWithEmail()
4. AuthService → Firebase Auth
5. Firebase → AuthService (response)
6. AuthService → LoginScreen
7. LoginScreen → dispatch(setUser(user))
8. Redux Store mis à jour
9. Navigation → MainTabs
```

## Composants Principaux

### 1. Authentication
- Gestion sécurisée des utilisateurs via Firebase
- Support Email/Password, Google, Apple
- Récupération de mot de passe
- Persistence de session

### 2. State Management (Redux)
Chaque slice gère un domaine spécifique :

- **authSlice** : État utilisateur et session
- **newsSlice** : Actualités K-pop
- **groupsSlice** : Groupes et détails
- **concertsSlice** : Concerts et localisation
- **mediaSlice** : Vidéos YouTube
- **quizSlice** : Quiz, scores, badges
- **favoritesSlice** : Favoris utilisateur

### 3. Services API

#### AuthService
```javascript
signInWithEmail(email, password)
signUpWithEmail(email, password, displayName)
signInWithGoogle()
signOut()
resetPassword(email)
```

#### TicketmasterService
```javascript
searchConcerts(params)
getConcertDetails(eventId)
searchByLocation(lat, lon, radius)
```

#### YouTubeService
```javascript
searchVideos(query, maxResults, category)
getVideoDetails(videoId)
searchMusicVideos(artist)
searchLivePerformances(artist)
```

## Gestion du Thème

L'application supporte le mode sombre/clair via Context API :

```javascript
const { colors, isDarkMode, toggleTheme } = useTheme();
```

Couleurs dynamiques :
- `colors.background` : Fond de l'écran
- `colors.card` : Fond des cartes
- `colors.text` : Texte principal
- `colors.textSecondary` : Texte secondaire
- `colors.primary` : Couleur principale
- `colors.border` : Bordures

## Navigation

Structure de navigation en deux niveaux :

1. **Stack Navigator** (Principal)
   - Écrans d'authentification
   - Bottom Tabs
   - Écrans de détails

2. **Bottom Tab Navigator**
   - Home
   - News
   - Groups
   - Concerts
   - Profile

## Sécurité

### Firestore Rules
```javascript
// Lecture publique des news
match /news/{newsId} {
  allow read: if true;
  allow write: if false;
}

// Données utilisateur privées
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId;
}
```

### Bonnes pratiques
- Validation côté client ET serveur
- Tokens d'authentification sécurisés
- Pas de clés API dans le code (utiliser .env)
- Règles de sécurité Firestore strictes

## Performance

### Optimisations
- Mise en cache avec AsyncStorage
- Lazy loading des images
- Pagination des listes
- Debouncing des recherches
- Memoization avec React.memo

### Gestion de la mémoire
- FlatList pour les longues listes
- Cleanup des listeners Firebase
- Optimisation des images

## Tests (À implémenter)

Structure recommandée :
```
__tests__/
├── components/
├── screens/
├── services/
└── utils/
```

## Déploiement

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## Évolutions Futures

- [ ] Mode hors-ligne avec cache
- [ ] Partage social
- [ ] Notifications personnalisées
- [ ] Chat communautaire
- [ ] Playlists personnalisées
- [ ] Reconnaissance d'images (idols)
- [ ] Recommandations IA

## Contributeurs

Projet réalisé dans le cadre d'un PFE (Projet de Fin d'Études).
