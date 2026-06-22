import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { toggleGroupFavorite } from '../../store/slices/favoritesSlice';
import Button from '../../components/Button';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function GroupDetailsScreen({ route, navigation }) {
  const { group } = route.params;
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const favoriteGroups = useSelector(state => state.favorites.groups);

  const isFavorite = favoriteGroups.some(g => g.id === group.id);

  const handleFavorite = () => {
    dispatch(toggleGroupFavorite(group));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header avec image */}
        <View style={styles.headerContainer}>
          {group.image ? (
            <Image source={{ uri: group.image }} style={styles.headerImage} />
          ) : (
            <LinearGradient
              colors={[COLORS.gradient.start, COLORS.gradient.end]}
              style={styles.headerImage}
            >
              <Ionicons name="people" size={80} color="#FFFFFF" />
            </LinearGradient>
          )}

          {/* Back button */}
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Favorite button */}
          <TouchableOpacity 
            style={[styles.favoriteButton, { backgroundColor: colors.card }]}
            onPress={handleFavorite}
          >
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={colors.secondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Contenu */}
        <View style={styles.content}>
          {/* Nom du groupe */}
          <Text style={[styles.groupName, { color: colors.text }]}>
            {group.name}
          </Text>

          {/* Infos */}
          <View style={styles.infoRow}>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Ionicons name="business" size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Agence
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {group.agency}
              </Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Début
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {group.debutYear}
              </Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Ionicons name="people" size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Membres
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {group.members}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              À propos
            </Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              {group.name} est un groupe K-pop sous {group.agency}. Le groupe a fait ses débuts en {group.debutYear} et compte actuellement {group.members} membres.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button 
              title="Voir les MV"
              onPress={() => navigation.navigate('MediaLibrary', { artist: group.name })}
              variant="gradient"
              style={styles.actionButton}
            />

            <Button 
              title="Concerts"
              onPress={() => navigation.navigate('Concerts', { artist: group.name })}
              variant="outline"
              style={styles.actionButton}
            />
          </View>

          {/* Placeholder pour les membres (à implémenter) */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Membres
            </Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              Liste des membres à venir...
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    position: 'relative',
    height: 300
  },
  headerImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: SPACING.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: SPACING.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },
  content: {
    padding: SPACING.lg
  },
  groupName: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    marginBottom: SPACING.lg
  },
  infoRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg
  },
  infoCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    elevation: 2
  },
  infoLabel: {
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.xs
  },
  infoValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginTop: 4
  },
  section: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.sm
  },
  sectionText: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 22
  },
  actions: {
    gap: SPACING.md,
    marginVertical: SPACING.md
  },
  actionButton: {
    width: '100%'
  }
});
