import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import GroupCard from '../../components/GroupCard';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function FavoritesScreen({ navigation }) {
  const { colors } = useTheme();
  const favoriteGroups = useSelector(state => state.favorites.groups);

  const data = useMemo(() => favoriteGroups || [], [favoriteGroups]);

  const renderItem = ({ item }) => (
    <GroupCard
      group={item}
      onPress={() => navigation.navigate('GroupDetails', { group: item })}
      onFavorite={() => {}}
      isFavorite={true}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Favoris</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Aucun favori</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Ajoute des groupes en favoris pour les retrouver ici.
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
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg
  }
});
