import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  TouchableOpacity,
  TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { setGroups, setLoading, setError } from '../../store/slices/groupsSlice';
import { toggleGroupFavorite } from '../../store/slices/favoritesSlice';
import GroupCard from '../../components/GroupCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdminService from '../../services/adminService';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function GroupsListScreen({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  
  const groups = useSelector(state => state.groups.groups);
  const loading = useSelector(state => state.groups.loading);
  const favoriteGroups = useSelector(state => state.favorites.groups);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);

  useEffect(() => {
    const loadGroups = async () => {
      dispatch(setLoading(true));
      const result = await AdminService.getAllGroups();
      if (result.success) {
        const normalized = result.data.map((item) => {
          const memberCount = typeof item.memberCount === 'number'
            ? item.memberCount
            : typeof item.members === 'string'
              ? item.members.split(',').map((m) => m.trim()).filter(Boolean).length
              : typeof item.members === 'number'
                ? item.members
                : 0;

          return {
            ...item,
            image: item.image || item.imageUrl || null,
            members: memberCount
          };
        });
        dispatch(setGroups(normalized));
      } else {
        dispatch(setError(result.error || 'Erreur lors du chargement des groupes'));
      }
    };

    loadGroups();
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.agency.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(groups);
    }
  }, [searchQuery, groups]);

  const handleGroupPress = (group) => {
    navigation.navigate('GroupDetails', { group });
  };

  const handleFavoritePress = (group) => {
    dispatch(toggleGroupFavorite(group));
  };

  const isFavorite = (groupId) => {
    return favoriteGroups.some(g => g.id === groupId);
  };

  const renderItem = ({ item }) => (
    <GroupCard 
      group={item} 
      onPress={() => handleGroupPress(item)}
      onFavorite={() => handleFavoritePress(item)}
      isFavorite={isFavorite(item.id)}
    />
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Groupes K-pop
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Rechercher un groupe..."
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

      {/* Groups List */}
      <FlatList
        data={filteredGroups}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Aucun groupe trouvé
            </Text>
          </View>
        }
      />
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
  }
});
