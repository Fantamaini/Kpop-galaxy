import AdminService from './adminService';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Comments Service - Firebase (comments collection)
 * Délègue la plupart des opérations à AdminService (qui parle Firestore).
 */
class CommentsService {
  async addComment(targetId, targetType, userId, userName, text) {
    return AdminService.addComment(targetId, targetType, userId, userName, text);
  }

  async getComments(targetId, targetType = 'news') {
    return AdminService.getComments(targetId, targetType);
  }

  async deleteComment(commentId) {
    return AdminService.deleteComment(commentId);
  }

  async likeComment(commentId) {
    try {
      const ref = doc(db, 'comments', commentId);
      await updateDoc(ref, { likesCount: increment(1) });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new CommentsService();
