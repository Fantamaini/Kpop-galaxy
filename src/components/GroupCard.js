import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function GroupCard({ group, onPress, onFavorite, isFavorite }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Image du groupe */}
      <View style={styles.imageContainer}>
        {group.image ? (
          <Image source={{ uri: group.image }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.primary }]}>
            <Ionicons name="people" size={40} color="#FFFFFF" />
          </View>
        )}
        {/* Bouton favori */}
        <TouchableOpacity 
          style={[styles.favoriteButton, { backgroundColor: colors.background }]}
          onPress={onFavorite}
        >
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={20} 
            color={colors.secondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Informations */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {group.name}
        </Text>
        <Text style={[styles.agency, { color: colors.textSecondary }]} numberOfLines={1}>
          {group.agency}
        </Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {group.debutYear}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {group.members} membres
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 208,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    ...SHADOWS.sm,
  },
  info: {
    padding: SPACING.lg,
  },
  name: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  agency: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '500',
  },
});
