import React from 'react';
import { TextInput, View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function Input({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  icon,
  error,
  ...props 
}) {
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';

  const borderColor = error ? colors.error : colors.border;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <View style={[
        styles.inputContainer, 
        { 
          backgroundColor: colors.card, 
          borderColor,
          // Premium focus ring on web
        }
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={18} 
            color={error ? colors.error : colors.textSecondary} 
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary || colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          {...props}
        />
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    paddingHorizontal: SPACING.md,
    minHeight: 54,
    ...SHADOWS.sm,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    paddingVertical: 12,
    fontWeight: '500',
  },
  error: {
    fontSize: FONTS.sizes.xs,
    marginTop: 6,
    fontWeight: '600',
  },
});
