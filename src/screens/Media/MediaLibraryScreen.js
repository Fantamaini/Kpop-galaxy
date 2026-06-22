import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AdminService from '../../services/adminService';
import youtubeService from '../../services/youtubeService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useSelector } from 'react-redux';

export default function MediaLibraryScreen({ navigation }) {
  const { colors } = useTheme();
  
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Music Videos');
  
  const categories = [
    { id: 1, name: 'Music Videos', icon: 'play-circle' },
    { id: 2, name: 'Live Performances', icon: 'mic' },
    { id: 3, name: 'TV Shows', icon: 'tv' },
    { id: 4, name: 'Variety', icon: 'happy' }
  ];

  const user = useSelector(state => state.auth.user);
  const favorites = useSelector(state => state.favorites);
  const [smartVideos, setSmartVideos] = useState([]);
  const [activeMood, setActiveMood] = useState(null);

  const MOODS = [
    { label: 'Workout 💪', query: 'energetic kpop workout' },
    { label: 'Chill 🌙', query: 'relaxing kpop ballad' },
    { label: 'Happy ✨', query: 'upbeat happy kpop' },
    { label: 'Sad 💔', query: 'emotional sad kpop' }
  ];

  const loadSmartPlaylist = async (mood) => {
    setActiveMood(mood.label);
    setLoading(true);
    try {
      // Personalized if favorites exist
      const artist = favorites.groups?.[0]?.name || 'BTS';
      const res = await youtubeService.searchVideos(`${mood.query} ${artist}`, 12);
      if (res.success) {
        setSmartVideos(res.data);
      } else {
        setSmartVideos([]);
      }
    } catch (e) {
      setSmartVideos([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadMedia = async () => {
      setLoading(true);
      const result = await AdminService.getAllMedia();
      if (result.success) {
        setMedia(result.data);
      }
      setLoading(false);
    };

    loadMedia();
  }, []);

  const renderVideoCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.videoCard, { backgroundColor: colors.card }]}
      onPress={() => console.log('Play video:', item.id)}
    >
      <View style={[styles.thumbnail, { backgroundColor: colors.border }]}>
        {item.thumbnailUrl ? (
          <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnailImage} />
        ) : (
          <Ionicons name="play-circle" size={48} color={colors.primary} />
        )}
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        {item.artist ? (
          <Text style={[styles.videoArtist, { color: colors.textSecondary }]}>
            {item.artist}
          </Text>
        ) : null}
        <View style={styles.videoStats}>
          <Text style={[styles.statsText, { color: colors.textSecondary }]}>
            {item.category || item.type || 'Média'}
          </Text>
          {item.type && item.category ? (
            <Text style={[styles.statsText, { color: colors.textSecondary }]}>
              {item.type}
            </Text>
          ) : null}
        </View>
      </View>

      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Médiathèque
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.name)}
            style={[
              styles.categoryButton,
              { backgroundColor: selectedCategory === cat.name ? colors.primary : colors.card }
            ]}
          >
            <Ionicons 
              name={cat.icon} 
              size={20} 
              color={selectedCategory === cat.name ? '#FFFFFF' : colors.text} 
            />
            <Text style={[
              styles.categoryText,
              { color: selectedCategory === cat.name ? '#FFFFFF' : colors.text }
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Video List */}
      <FlatList
        data={media}
        renderItem={renderVideoCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xl
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold'
  },
  categories: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs
  },
  categoryText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600'
  },
  list: {
    padding: SPACING.lg
  },
  videoCard: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2
  },
  thumbnail: {
    width: 120,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
    resizeMode: 'cover'
  },
  videoInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between'
  },
  videoTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600'
  },
  videoArtist: {
    fontSize: FONTS.sizes.xs,
    marginTop: 4
  },
  videoStats: {
    flexDirection: 'row',
    gap: SPACING.md
  },
  statsText: {
    fontSize: FONTS.sizes.xs
  },
  favoriteButton: {
    padding: SPACING.xs
  }
});
