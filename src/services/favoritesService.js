import AdminService from './adminService';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Favorites Service - Firebase (stockés dans users/{uid}.favorites)
 */
class FavoritesService {
  async getUserFavorites(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        return { success: true, data: { groups: [], idols: [], videos: [], concerts: [] } };
      }
      const data = userDoc.data();
      return { success: true, data: data.favorites || { groups: [], idols: [], videos: [], concerts: [] } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async toggleFavorite(uid, type, item) {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return { success: false, error: 'User not found' };

      const user = snap.data() || {};
      const favorites = user.favorites || { groups: [], idols: [], videos: [], concerts: [] };

      const list = favorites[type] || [];
      const exists = list.some(i => (i.id || i) === (item.id || item));

      let updatedList;
      if (exists) {
        updatedList = list.filter(i => (i.id || i) !== (item.id || item));
      } else {
        updatedList = [...list, { ...item, addedAt: new Date().toISOString() }];
      }

      const newFavorites = { ...favorites, [type]: updatedList };
      const newStats = { ...(user.stats || {}), favoriteGroups: newFavorites.groups?.length || 0 };

      await updateDoc(userRef, { favorites: newFavorites, stats: newStats });

      return { success: true, data: newFavorites, added: !exists };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async saveFavorites(uid, favorites) {
    return AdminService.updateUser(uid, { favorites });
  }
}

export default new FavoritesService();
