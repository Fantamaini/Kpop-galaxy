import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS, SPACING } from '../constants/theme';

export default function LoadingSpinner({ size = 'large', label, subtle = false }) {
  const { colors, isDarkMode } = useTheme();

  if (subtle) {
    return (
      <View style={styles.subtleContainer}>
        <ActivityIndicator size={size} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.loaderWrapper}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight || colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glowRing}
        />
        <View style={[styles.innerCircle, { backgroundColor: colors.card }]}>
          <ActivityIndicator size={size} color={colors.primary} />
        </View>
      </View>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl
  },
  subtleContainer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loaderWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 78,
    height: 78
  },
  glowRing: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 39,
    opacity: 0.25
  },
  innerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6
  },
  label: {
    marginTop: SPACING.lg,
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    textAlign: 'center'
  }
});
