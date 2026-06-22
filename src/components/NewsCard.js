import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function NewsCard({ news, onPress }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Image */}
      {news.image && (
        <Image source={{ uri: news.image }} style={styles.image} />
      )}

      {/* Contenu */}
      <View style={styles.content}>
        {/* Catégorie/Tag */}
        {news.category && (
          <View style={[styles.tag, { backgroundColor: colors.primary }]}>
            <Text style={styles.tagText}>{news.category}</Text>
          </View>
        )}

        {/* Titre */}
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {news.title}
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {news.description}
        </Text>

        {/* Footer avec date et groupe */}
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              {news.date}
            </Text>
          </View>
          {news.group && (
            <View style={styles.footerItem}>
              <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                {news.group}
              </Text>
            </View>
          )}
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
  image: {
    width: '100%',
    height: 182,
    resizeMode: 'cover',
  },
  content: {
    padding: SPACING.lg,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '800',
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '500',
  },
});
