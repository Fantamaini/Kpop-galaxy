import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, TRANSITIONS } from '../constants/theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Premium theme tokens - 200/100 K-POP GALAXY design system
  const theme = {
    isDarkMode,
    colors: {
      // Core brand
      primary: COLORS.primary,
      primaryLight: COLORS.primaryLight,
      secondary: COLORS.secondary,
      accent: COLORS.accent,
      accentDark: COLORS.accentDark,

      // Backgrounds
      background: isDarkMode ? COLORS.background.dark : COLORS.background.light,
      card: isDarkMode ? COLORS.background.card.dark : COLORS.background.card.light,
      surface: isDarkMode ? COLORS.background.surface.dark : COLORS.background.surface.light,

      // Text
      text: isDarkMode ? COLORS.text.primary.dark : COLORS.text.primary.light,
      textSecondary: isDarkMode ? COLORS.text.secondary.dark : COLORS.text.secondary.light,
      textTertiary: isDarkMode ? COLORS.text.tertiary.dark : COLORS.text.tertiary.light,

      // Borders & overlays
      border: isDarkMode ? COLORS.border.dark : COLORS.border.light,
      overlay: COLORS.overlay,

      // Status
      success: COLORS.success,
      successLight: COLORS.successLight,
      error: COLORS.error,
      errorLight: COLORS.errorLight,
      warning: COLORS.warning,
      info: COLORS.info,

      // Beautiful gradients (as array for LinearGradient)
      gradient: isDarkMode 
        ? [COLORS.gradientDark.start, COLORS.gradientDark.middle, COLORS.gradientDark.end] 
        : [COLORS.gradient.start, COLORS.gradient.middle, COLORS.gradient.end],
      gradientPink: [COLORS.gradientPink.start, COLORS.gradientPink.middle, COLORS.gradientPink.end],

      // Glows
      glow: isDarkMode ? COLORS.glow : COLORS.glow
    },

    // Full design system exposure (use everywhere for consistency)
    fonts: FONTS,
    spacing: SPACING,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    transitions: TRANSITIONS,

    toggleTheme
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
