import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import CommentsService from '../services/commentsService';
import { FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

/**
 * Reusable CommentSection
 * Usage:
 * <CommentSection targetId={news.id} targetType="news" />
 * Also works for "group" and "media"
 */
export default function CommentSection({ targetId, targetType = 'news', title = 'Commentaires' }) {
  const { colors } = useTheme();
  const user = useSelector(state => state.auth.user);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');

  const loadComments = async () => {
    setLoading(true);
    const res = await CommentsService.getComments(targetId, targetType);
    if (res.success) setComments(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (targetId) loadComments();
  }, [targetId, targetType]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    const res = await CommentsService.addComment(
      targetId,
      targetType,
      user.uid,
      user.displayName || user.email?.split('@')[0] || 'Fan',
      newComment.trim()
    );

    if (res.success) {
      setNewComment('');
      // Optimistic refresh
      await loadComments();
    }
    setSubmitting(false);
  };

  const handleDelete = async (comment) => {
    if (!user || comment.userId !== user.uid) return;
    const res = await CommentsService.deleteComment(comment.id, user.uid);
    if (res.success) {
      setComments(prev => prev.filter(c => c.id !== comment.id));
    }
  };

  const renderComment = ({ item }) => {
    const isMine = user && item.userId === user.uid;
    const dateStr = item.createdAt instanceof Date 
      ? item.createdAt.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
      : '';

    return (
      <View style={[styles.comment, { backgroundColor: colors.surface?.dark || colors.card }]}>
        <View style={styles.commentHeader}>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.userName, { color: colors.text }]}>{item.userName}</Text>
          </View>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{dateStr}</Text>
          {isMine && (
            <TouchableOpacity onPress={() => handleDelete(item)} style={{ marginLeft: 8 }}>
              <Ionicons name="trash-outline" size={16} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.commentText, { color: colors.text }]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title} ({comments.length})</Text>

      {/* Composer */}
      {user ? (
        <View style={[styles.composer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Écrire un commentaire..."
            placeholderTextColor={colors.textSecondary}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={280}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || !newComment.trim()}
            style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: (submitting || !newComment.trim()) ? 0.5 : 1 }]}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.loginPrompt, { color: colors.textSecondary }]}>Connecte-toi pour commenter</Text>
      )}

      {/* List */}
      {loading ? (
        <ActivityIndicator style={{ marginVertical: SPACING.lg }} color={colors.primary} />
      ) : comments.length > 0 ? (
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      ) : (
        <View style={styles.empty}>
          <Ionicons name="chatbubble-outline" size={28} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Soyez le premier à commenter !</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg
  },
  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginBottom: SPACING.sm
  },
  composer: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    alignItems: 'flex-end'
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    minHeight: 36,
    maxHeight: 90,
    paddingHorizontal: SPACING.sm
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm
  },
  loginPrompt: {
    fontSize: FONTS.sizes.sm,
    fontStyle: 'italic',
    marginBottom: SPACING.md
  },
  comment: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6
  },
  userName: {
    fontWeight: '600',
    fontSize: FONTS.sizes.sm
  },
  date: {
    fontSize: FONTS.sizes.xs
  },
  commentText: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20
  },
  empty: {
    alignItems: 'center',
    paddingVertical: SPACING.lg
  },
  emptyText: {
    marginTop: SPACING.xs,
    fontSize: FONTS.sizes.sm
  }
});
