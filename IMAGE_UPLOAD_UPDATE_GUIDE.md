# Guide de mise à jour - Upload d'images et gestion des utilisateurs

## 📸 Système d'upload d'images

### Nouveaux composants créés

#### 1. ImagePicker Component (`src/components/ImagePicker.js`)

Composant réutilisable pour sélectionner et uploader des images:

**Fonctionnalités:**
- Sélection de fichier via input HTML (web)
- Prévisualisation de l'image avant upload
- Indicateur de progression d'upload
- Upload automatique vers Firebase Storage
- Gestion des erreurs
- Bouton de changement sur l'image de prévisualisation

**Utilisation:**
```javascript
<ImagePicker
  onImageSelected={(url, path) => setFormData({ ...formData, imageUrl: url, imagePath: path })}
  currentImage={formData.imageUrl}
  label="Image de l'article"
/>
```

**Props:**
- `onImageSelected`: Callback appelé avec (url, path) après upload réussi
- `currentImage`: URL de l'image actuelle (pour l'édition)
- `label`: Texte du label au-dessus du picker

#### 2. StorageService (`src/services/storageService.js`)

Service pour gérer Firebase Storage:

**Méthodes:**

```javascript
// Upload une image et retourne l'URL + path
uploadImage(file, folder)
// Retourne: { success, url, path, error }

// Supprime une image du storage
deleteImage(imagePath)
// Retourne: { success, error }

// Upload multiple images
uploadMultipleImages(files, folder)
// Retourne: { success, uploads, error }
```

**Dossiers utilisés:**
- `news/` - Images des articles
- `groups/` - Photos des groupes
- `concerts/` - Images des concerts
- `media/` - Miniatures des vidéos
- `events/` - Images des événements
- `quiz/` - Images des quiz

### Écrans mis à jour

Tous les écrans de gestion admin ont été mis à jour pour utiliser ImagePicker au lieu d'un champ texte URL:

1. ✅ **ManageNewsScreen** - Image de l'article
2. ✅ **ManageGroupsScreen** - Image du groupe
3. ✅ **ManageConcertsScreen** - Image du concert
4. ✅ **ManageMediaScreen** - Miniature de la vidéo
5. ✅ **ManageEventsScreen** - Image de l'événement

**Changements dans chaque écran:**

```javascript
// AVANT (champ texte URL)
<Text style={[styles.label, { color: colors.text }]}>URL de l'image</Text>
<TextInput
  style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
  value={formData.imageUrl}
  onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
  placeholder="https://example.com/image.jpg"
  placeholderTextColor={colors.textSecondary}
/>

// APRÈS (sélecteur de fichier)
<ImagePicker
  onImageSelected={(url, path) => setFormData({ ...formData, imageUrl: url, imagePath: path })}
  currentImage={formData.imageUrl}
  label="Image de l'article"
/>
```

**Nouveaux champs dans formData:**

Chaque écran a maintenant un champ `imagePath` en plus de `imageUrl`:

```javascript
// News
const [formData, setFormData] = useState({
  title: '',
  content: '',
  category: 'K-pop',
  imageUrl: '',
  imagePath: '',  // NOUVEAU
  author: 'Admin'
});

// Groups
const [formData, setFormData] = useState({
  name: '',
  debutYear: '',
  members: '',
  agency: '',
  imageUrl: '',
  imagePath: '',  // NOUVEAU
  description: ''
});

// Concerts
const [formData, setFormData] = useState({
  title: '',
  artist: '',
  date: '',
  venue: '',
  city: '',
  country: '',
  ticketUrl: '',
  imageUrl: '',
  imagePath: '',  // NOUVEAU
  description: ''
});

// Media
const [formData, setFormData] = useState({
  title: '',
  artist: '',
  youtubeUrl: '',
  type: 'MV',
  category: 'Music Video',
  thumbnailUrl: '',
  thumbnailPath: ''  // NOUVEAU
});

// Events
const [formData, setFormData] = useState({
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  type: 'Concert',
  imageUrl: '',
  imagePath: ''  // NOUVEAU
});
```

**Pourquoi stocker imagePath?**

Le `imagePath` est nécessaire pour pouvoir supprimer l'ancienne image lors de la modification:

```javascript
// Exemple: lors de la modification d'un article
if (oldImagePath) {
  await StorageService.deleteImage(oldImagePath);
}
```

## 👥 Gestion complète des utilisateurs

### Mise à jour de ManageUsersScreen

L'écran de gestion des utilisateurs permet maintenant de:
- ✅ Voir la liste des utilisateurs
- ✅ Créer de nouveaux utilisateurs
- ✅ Modifier les informations des utilisateurs
- ✅ Changer les rôles (user ↔ admin)
- ✅ Supprimer des utilisateurs

**Modal de création/édition:**

```javascript
const [formData, setFormData] = useState({
  email: '',
  displayName: '',
  password: '',
  role: 'user'
});
```

**Champs du formulaire:**

1. **Email** - TextInput
   - Requis
   - Désactivé lors de l'édition (email ne peut pas être modifié)
   - Validation d'email

2. **Nom complet** - TextInput
   - Requis
   - Modifiable

3. **Mot de passe** - TextInput
   - Requis UNIQUEMENT lors de la création
   - Caché lors de l'édition
   - secureTextEntry activé

4. **Rôle** - Boutons de sélection
   - Choix entre "Utilisateur" et "Admin"
   - Boutons colorés pour indiquer la sélection

**Logique de soumission:**

```javascript
const handleSubmit = async () => {
  if (!formData.email || !formData.displayName) {
    Alert.alert('Erreur', 'Email et nom requis');
    return;
  }

  if (!editingUser && !formData.password) {
    Alert.alert('Erreur', 'Mot de passe requis pour créer un utilisateur');
    return;
  }

  let result;
  
  if (editingUser) {
    // Modification d'un utilisateur existant
    result = await AdminService.updateUser(editingUser.id, {
      displayName: formData.displayName,
      role: formData.role
    });
  } else {
    // Création d'un nouvel utilisateur
    result = await AuthService.signUpWithEmail(
      formData.email,
      formData.password,
      formData.displayName,
      formData.role
    );
  }

  if (result.success) {
    Alert.alert('Succès', editingUser ? 'Utilisateur modifié' : 'Utilisateur créé');
    setModalVisible(false);
    resetForm();
    loadUsers();
  } else {
    Alert.alert('Erreur', result.error);
  }
};
```

### Nouveau service AdminService.updateUser()

Ajout de la méthode dans `src/services/adminService.js`:

```javascript
async updateUser(userId, userData) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
}
```

**Utilisation:**

```javascript
// Modifier le nom et le rôle d'un utilisateur
await AdminService.updateUser('userId123', {
  displayName: 'Nouveau Nom',
  role: 'admin'
});
```

### Actions disponibles par utilisateur

Dans la liste des utilisateurs, chaque carte affiche 3 boutons:

1. **✏️ Modifier** - Ouvre le modal de modification
2. **🔄 Changer le rôle** - Toggle user ↔ admin avec confirmation
3. **🗑️ Supprimer** - Supprime l'utilisateur avec confirmation

## 🔧 Configuration Firebase Storage

### Étape 1: Activer Firebase Storage

Si ce n'est pas déjà fait:

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **kpop-galaxy-a004e**
3. Dans le menu, cliquez sur **Storage**
4. Cliquez sur **Commencer**
5. Choisissez la localisation **europe-west** (même région que Firestore)
6. Cliquez sur **Terminé**

### Étape 2: Configurer les règles de sécurité

Voir le fichier **STORAGE_RULES_GUIDE.md** pour les règles détaillées.

**Règles recommandées (résumé):**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null && 
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isBelowMaxSize() {
      return request.resource.size < 10 * 1024 * 1024;
    }

    match /{folder}/{imageId} {
      allow read: if true;
      allow write: if isAdmin() && isImage() && isBelowMaxSize();
    }
  }
}
```

**Sécurité:**
- ✅ Lecture publique (pour afficher les images dans l'app)
- ✅ Écriture admin uniquement
- ✅ Validation des types de fichiers (images seulement)
- ✅ Limitation de taille (max 10MB)

## 📝 Comment utiliser le nouveau système

### Créer un article avec une image

1. Connectez-vous en tant qu'admin
2. Allez dans Dashboard Admin → Gérer les Actualités
3. Cliquez sur le bouton **+ Nouveau**
4. Remplissez le formulaire:
   - Titre
   - Contenu
   - Catégorie
5. **Pour l'image:**
   - Cliquez sur "Choisir une image"
   - Sélectionnez un fichier JPG/PNG depuis votre ordinateur
   - L'image s'uploade automatiquement
   - Une prévisualisation s'affiche
6. Cliquez sur **Créer**

### Modifier l'image d'un article existant

1. Cliquez sur le bouton **✏️** sur une carte d'article
2. Le modal s'ouvre avec les informations actuelles
3. **Pour changer l'image:**
   - Cliquez sur le bouton **Changer** sur la prévisualisation
   - Sélectionnez une nouvelle image
   - La nouvelle image remplace l'ancienne
4. Cliquez sur **Modifier**

### Créer un utilisateur

1. Allez dans Dashboard Admin → Gérer les Utilisateurs
2. Cliquez sur **+ Nouveau**
3. Remplissez le formulaire:
   - Email (obligatoire)
   - Nom complet (obligatoire)
   - Mot de passe (obligatoire pour création)
   - Rôle (Utilisateur ou Admin)
4. Cliquez sur **Créer**
5. L'utilisateur reçoit un email de vérification
6. Il peut maintenant se connecter à l'app

### Modifier un utilisateur

1. Cliquez sur **✏️** sur une carte utilisateur
2. Le modal s'ouvre avec les informations actuelles
3. Vous pouvez modifier:
   - Nom complet
   - Rôle
   - ⚠️ L'email ne peut pas être modifié
   - ⚠️ Le mot de passe ne peut pas être changé ici
4. Cliquez sur **Modifier**

## ⚠️ Limitations actuelles

### Plateforme mobile

Le composant ImagePicker est actuellement optimisé pour le web. Pour React Native mobile, il faudra:

1. Installer `expo-image-picker`:
```bash
npx expo install expo-image-picker
```

2. Modifier `src/components/ImagePicker.js` pour utiliser:
```javascript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.8,
  });
  // ...
};
```

### Changement de mot de passe

Pour changer le mot de passe d'un utilisateur existant, il faut utiliser Firebase Admin SDK côté serveur ou demander à l'utilisateur de faire une réinitialisation de mot de passe.

### Suppression d'images

Actuellement, quand on modifie un article avec une nouvelle image, l'ancienne image reste dans Firebase Storage. Pour nettoyer:

1. Option manuelle: Supprimer les images inutilisées depuis Firebase Console
2. Option automatique: Ajouter une fonction Cloud Functions qui supprime l'ancienne image lors de la mise à jour

## 🎯 Prochaines étapes recommandées

1. **Tester l'upload d'images**
   - Créer des articles avec images
   - Modifier des images existantes
   - Vérifier l'affichage dans l'app

2. **Tester la gestion des utilisateurs**
   - Créer un utilisateur normal
   - Créer un utilisateur admin
   - Modifier les informations
   - Changer les rôles

3. **Configurer les règles Storage** (voir STORAGE_RULES_GUIDE.md)

4. **Optimiser les images**
   - Ajouter une compression automatique avant upload
   - Générer des thumbnails pour les listes
   - Lazy loading des images

5. **Ajouter la suppression automatique**
   - Créer une Cloud Function pour nettoyer les images supprimées
   - Gérer la suppression lors de la modification

6. **Support mobile**
   - Intégrer expo-image-picker
   - Tester sur iOS et Android
   - Ajouter la prise de photo avec la caméra

## 🐛 Dépannage

### L'upload ne fonctionne pas

**Problème:** Erreur "permission-denied"

**Solution:**
1. Vérifiez que vous êtes connecté en tant qu'admin
2. Vérifiez les règles Firebase Storage
3. Vérifiez que le rôle 'admin' est bien défini dans Firestore

**Problème:** L'image ne s'affiche pas après l'upload

**Solution:**
1. Vérifiez l'URL retournée dans la console
2. Vérifiez les règles de lecture Storage (`allow read: if true`)
3. Vérifiez la console du navigateur pour les erreurs CORS

### La création d'utilisateur échoue

**Problème:** "Email already in use"

**Solution:** Cet email est déjà utilisé, essayez un autre email

**Problème:** "Weak password"

**Solution:** Le mot de passe doit faire au moins 6 caractères

**Problème:** L'utilisateur ne reçoit pas l'email de vérification

**Solution:**
1. Vérifiez les spams
2. Vérifiez que l'envoi d'emails est activé dans Firebase Console
3. L'email peut prendre quelques minutes à arriver

## 📚 Fichiers modifiés

### Nouveaux fichiers
- `src/components/ImagePicker.js` - Composant de sélection d'images
- `src/services/storageService.js` - Service Firebase Storage
- `STORAGE_RULES_GUIDE.md` - Guide des règles de sécurité
- `IMAGE_UPLOAD_UPDATE_GUIDE.md` - Ce fichier

### Fichiers modifiés
- `src/config/firebase.js` - Ajout de Storage
- `src/services/adminService.js` - Ajout de updateUser()
- `src/screens/Admin/ManageNewsScreen.js` - ImagePicker intégré
- `src/screens/Admin/ManageGroupsScreen.js` - ImagePicker intégré
- `src/screens/Admin/ManageConcertsScreen.js` - ImagePicker intégré
- `src/screens/Admin/ManageMediaScreen.js` - ImagePicker intégré
- `src/screens/Admin/ManageEventsScreen.js` - ImagePicker intégré
- `src/screens/Admin/ManageUsersScreen.js` - CRUD complet

### Total
- 2 nouveaux composants/services
- 7 écrans mis à jour
- 2 guides de documentation
