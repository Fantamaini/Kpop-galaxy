import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import * as ExpoImagePicker from 'expo-image-picker';

/**
 * Storage Service - Firebase Storage
 * Upload images (web File + mobile Blob) + delete.
 */

class StorageService {
  // Ouvre le picker natif (mobile) et retourne l'URI local (preview seulement)
  async pickLocalImage() {
    try {
      const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return { success: false, error: 'Permission refusée pour accéder à la galerie' };
      }

      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        return {
          success: true,
          uri: result.assets[0].uri,
          local: true
        };
      }
      return { success: false, canceled: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload une image vers Firebase Storage.
   * @param {File|Blob|string} fileOrUri - File (web), Blob (mobile), ou URL distante (retournée telle quelle)
   * @param {string} folder - ex: 'news', 'groups', 'kpop-images'
   */
  async uploadImage(fileOrUri, folder = 'images') {
    try {
      // Si c'est déjà une URL http, on la garde (pas d'upload)
      if (typeof fileOrUri === 'string' && fileOrUri.startsWith('http')) {
        return { success: true, url: fileOrUri, path: null };
      }

      let fileBlob;
      let fileName = `${Date.now()}_${Math.floor(Math.random() * 100000)}.jpg`;

      if (fileOrUri instanceof File) {
        // Web <input type="file">
        fileBlob = fileOrUri;
        fileName = fileOrUri.name || fileName;
      } else if (fileOrUri instanceof Blob) {
        // Mobile (blob obtenu via fetch(uri))
        fileBlob = fileOrUri;
      } else {
        return { success: false, error: 'Type de fichier non supporté pour l\'upload' };
      }

      const path = `${folder}/${fileName}`;
      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, fileBlob);
      const downloadUrl = await getDownloadURL(storageRef);

      return {
        success: true,
        url: downloadUrl,
        path // important pour pouvoir supprimer plus tard
      };
    } catch (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message || 'Erreur lors de l\'upload vers Firebase Storage' };
    }
  }

  async deleteImage(imagePath) {
    if (!imagePath) return { success: true };
    try {
      const storageRef = ref(storage, imagePath);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      // L'image a peut-être déjà été supprimée
      return { success: true };
    }
  }

  async uploadMultipleImages(files, folder = 'images') {
    const results = [];
    for (const f of files) {
      const res = await this.uploadImage(f, folder);
      results.push(res);
    }
    const successes = results.filter(r => r.success);
    return {
      success: successes.length > 0,
      uploads: successes,
      error: results.find(r => !r.success)?.error
    };
  }
}

export default new StorageService();
