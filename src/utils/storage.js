import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  FAVORITES: '@kpop_galaxy_favorites',
  QUIZ_HISTORY: '@kpop_galaxy_quiz_history',
  USER_PREFERENCES: '@kpop_galaxy_preferences',
  THEME: '@kpop_galaxy_theme'
};

class StorageService {
  // Sauvegarder des données
  async save(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      return { success: true };
    } catch (error) {
      console.error('Storage save error:', error);
      return { success: false, error: error.message };
    }
  }

  // Récupérer des données
  async get(key) {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      return jsonData != null ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  // Supprimer des données
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      console.error('Storage remove error:', error);
      return { success: false, error: error.message };
    }
  }

  // Tout effacer
  async clear() {
    try {
      await AsyncStorage.clear();
      return { success: true };
    } catch (error) {
      console.error('Storage clear error:', error);
      return { success: false, error: error.message };
    }
  }

  // Méthodes spécifiques

  async saveFavorites(favorites) {
    return this.save(STORAGE_KEYS.FAVORITES, favorites);
  }

  async getFavorites() {
    return this.get(STORAGE_KEYS.FAVORITES);
  }

  async saveQuizHistory(history) {
    return this.save(STORAGE_KEYS.QUIZ_HISTORY, history);
  }

  async getQuizHistory() {
    return this.get(STORAGE_KEYS.QUIZ_HISTORY);
  }

  async saveUserPreferences(preferences) {
    return this.save(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  async getUserPreferences() {
    return this.get(STORAGE_KEYS.USER_PREFERENCES);
  }

  async saveTheme(theme) {
    return this.save(STORAGE_KEYS.THEME, theme);
  }

  async getTheme() {
    return this.get(STORAGE_KEYS.THEME);
  }
}

export default new StorageService();
