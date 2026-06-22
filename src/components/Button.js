import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  style,
  textStyle,
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  iconPosition = 'left'
}) {
  const isWeb = Platform.OS === 'web';
  const isDisabled = disabled || loading;

  const getPadding = () => {
    if (size === 'sm') return { py: SPACING.sm, px: SPACING.lg };
    if (size === 'lg') return { py: 26, px: SPACING.xl };
    return { py: 14, px: SPACING.lg };
  };
  const pad = getPadding();

  const textSize = size === 'sm' ? FONTS.sizes.sm : size === 'lg' ? FONTS.sizes.lg : FONTS.sizes.md;

  // Premium gradient button - "Se connecter" / "Créer mon compte" style (luxury K-pop CTA)
  if (variant === 'gradient') {
    const isLarge = size === 'lg';
    const buttonHeight = isLarge ? 76 : 54;
    const gradientRadius = isLarge ? BORDER_RADIUS.xxl : BORDER_RADIUS.xl;

    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={isDisabled}
        style={[
          styles.container, 
          { 
            paddingVertical: pad.py, 
            paddingHorizontal: pad.px, 
            minHeight: buttonHeight,
            borderRadius: gradientRadius,
          },
          isWeb && styles.webPressable,
          style
        ]}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[COLORS.gradient.start, COLORS.gradient.middle, COLORS.gradient.end]}
          start={{ x: 0.15, y: 0.1 }}
          end={{ x: 0.85, y: 0.95 }}
          style={[
            styles.gradient, 
            { 
              borderRadius: gradientRadius,
              // Strong premium glow for main CTAs
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 18,
              elevation: 8,
            }
          ]}
        >
          {/* Subtle top highlight for "raised" luxury feel */}
          <LinearGradient
            colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.06)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 0.55 }}
            style={[styles.gradientHighlight, { borderRadius: gradientRadius }]}
          />

          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text 
              style={[
                styles.text, 
                { 
                  fontSize: isLarge ? FONTS.sizes.xl : FONTS.sizes.md,
                  fontWeight: '800',
                  letterSpacing: 0.5,
                }, 
                textStyle
              ]}
            >
              {title}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Glass / frosted style (great on dark + web)
  if (variant === 'glass') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={isDisabled}
        style={[
          styles.container, 
          styles.glass,
          { paddingVertical: pad.py, paddingHorizontal: pad.px },
          isWeb && styles.webPressable,
          style
        ]}
        activeOpacity={0.75}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={[styles.text, { fontSize: textSize, color: '#FFFFFF' }, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  // Main solid + outline variants
  const baseStyle = [
    styles.container,
    { 
      paddingVertical: pad.py, 
      paddingHorizontal: pad.px,
      borderRadius: BORDER_RADIUS.lg,
      minHeight: size === 'lg' ? 56 : 48 
    },
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'outline' && styles.outline,
    variant === 'danger' && styles.danger,
    isDisabled && styles.disabled,
    isWeb && styles.webPressable,
    style
  ];

  const textColor = variant === 'outline' ? COLORS.primary : '#FFFFFF';
  const indicatorColor = variant === 'outline' ? COLORS.primary : '#FFFFFF';

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={isDisabled}
      style={baseStyle}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text style={[
          styles.text, 
          { fontSize: textSize, color: variant === 'outline' ? COLORS.primary : '#FFFFFF' }, 
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm
  },
  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.md
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.md
  },
  danger: {
    backgroundColor: COLORS.error
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary
  },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    ...SHADOWS.lg
  },
  gradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.lg
  },
  gradientHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.45
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2
  },
  // Web niceties (hover + pointer via react-native-web)
  webPressable: {
    cursor: 'pointer',
    transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 160ms ease',
    // @ts-ignore - web only
    ':hover': {
      transform: [{ scale: 1.02 }],
    }
  }
});
