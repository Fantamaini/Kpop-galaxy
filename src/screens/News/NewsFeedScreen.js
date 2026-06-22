import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { setNews, setLoading, setError } from '../../store/slices/newsSlice';
import AdminService from '../../services/adminService';
import GamificationService from '../../services/gamificationService';
import CommentsService from '../../services/commentsService';
import NewsCard from '../../components/NewsCard';
import CommentSection from '../../components/CommentSection';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { formatDate } from '../../utils/dateUtils';

export default function NewsFeedScreen() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const news = useSelector(state => state.news.news);
  const loading = useSelector(state => state.news.loading);
  const user = useSelector(state => state.auth.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [commentsCount, setCommentsCount] = useState({});

  useEffect(() => {
    const loadNews = async () => {
      dispatch(setLoading(true));
      const result = await AdminService.getAllNews();
      if (result.success) {
        const normalized = result.data.map((item) => {
          const createdAtDate = item.createdAt?.toDate ? item.createdAt.toDate() : null;
          const resolvedDate = item.date || (createdAtDate ? createdAtDate.toISOString() : null);
          return {
            ...item,
            description: item.description || item.content || '',
            image: item.image || item.imageUrl || null,
            date: resolvedDate ? formatDate(resolvedDate) : '',
            likes: item.likes || 0
          };
        });
        dispatch(setNews(normalized));
      } else {
        dispatch(setError(result.error || 'Erreur lors du chargement des actualités'));
      }
    };

    loadNews();
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = news.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews(news);
    }
  }, [searchQuery, news]);

  const handleLike = async (item) => {
    // Optimistic
    const updated = news.map(n => n.id === item.id ? { ...n, likes: (n.likes || 0) + 1 } : n);
    dispatch(setNews(updated));

    try {
      await AdminService.updateNews(item.id, { likes: (item.likes || 0) + 1 });
      // Award small XP for engagement
      if (user?.uid) {
        await GamificationService.awardActionXP(user.uid, 'READ_NEWS');
      }
    } catch (e) {
      // revert on failure (simple)
      const reverted = news.map(n => n.id === item.id ? { ...n, likes: item.likes || 0 } : n);
      dispatch(setNews(reverted));
    }
  };

  const openComments = async (item) => {
    setSelectedNews(item);
    // Optional: prefetch count (component will load comments)
  };

  const closeComments = () => setSelectedNews(null);

  const renderItem = ({ item }) => (
    <View>
      <NewsCard 
        news={item} 
        onPress={() => openComments(item)}
      />
      {/* Quick action bar */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(item)}>
          <Ionicons name="heart-outline" size={18} color={colors.secondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>{item.likes || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openComments(item)}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Commenter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => {
          // Simple XP for reading
          if (user?.uid) GamificationService.awardActionXP(user.uid, 'READ_NEWS');
        }}>
          <Ionicons name="book-outline" size={18} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Lu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Actualités K-pop
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Rechercher des news..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* News List */}
      <FlatList
        data={filteredNews}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Aucune actualité disponible
            </Text>
          </View>
        }
      />

      {/* Comments Modal (Social Layer) */}
      <Modal
        visible={!!selectedNews}
        animationType="slide"
        onRequestClose={closeComments}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeComments}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]} numberOfLines={1}>
              {selectedNews?.title || 'Commentaires'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          {selectedNews && (
            <View style={styles.modalContent}>
              <Text style={[styles.articlePreview, { color: colors.textSecondary }]} numberOfLines={3}>
                {selectedNews.description}
              </Text>

              <CommentSection 
                targetId={selectedNews.id} 
                targetType="news" 
                title="Commentaires de la communauté" 
              />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    height: 50,
    gap: SPACING.sm
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.md
  },
  list: {
    padding: SPACING.lg
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    marginTop: SPACING.md
  },
  // Social actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.lg
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  actionText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '500'
  },
  // Modal
  modalContainer: {
    flex: 1
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)'
  },
  modalTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md
  },
  modalContent: {
    padding: SPACING.lg,
    flex: 1
  },
  articlePreview: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.lg,
    lineHeight: 20
  }
});
