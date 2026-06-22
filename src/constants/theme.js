export const COLORS = {
  // ============================================
  // K-POP GALAXY - PREMIUM DESIGN SYSTEM
  // "200/100" Modern K-pop Fan Portal Aesthetic
  // ============================================

  // Core Brand (rich, luxurious, idol-stage energy)
  primary: '#5C3DD9',        // Deep electric violet
  primaryLight: '#7C5AE8',   // Lighter for gradients/hovers
  secondary: '#FF2D95',      // Signature hot pink / rose vif
  accent: '#A78BFA',         // Soft lavender accent
  accentDark: '#6D28D9',     // Richer purple for depth

  // Backgrounds - Immersive Galaxy
  background: {
    light: '#F8F7FC',        // Soft off-white with purple tint
    dark: '#090713',         // True deep space black-purple
    card: {
      light: '#FFFFFF',
      dark: '#13101F'        // Rich dark card with subtle depth
    },
    surface: {
      light: '#F1EEF8',
      dark: '#1A1628'
    }
  },

  // Text - Excellent contrast & readability
  text: {
    primary: {
      light: '#1A1726',
      dark: '#F4F1FF'
    },
    secondary: {
      light: '#5C5770',
      dark: '#A8A3B8'
    },
    tertiary: {
      light: '#8A859E',
      dark: '#6B667A'
    }
  },

  // Status (vibrant but harmonious)
  success: '#10B981',
  successLight: '#34D399',
  error: '#F43F5E',
  errorLight: '#FB7185',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Gradients - Stunning multi-stage (hero, cards, buttons)
  gradient: {
    start: '#5C3DD9',
    middle: '#7C5AE8',
    end: '#FF2D95'
  },
  gradientDark: {
    start: '#3D2A9E',
    middle: '#5C3DD9',
    end: '#C0267A'
  },
  gradientPink: {
    start: '#FF2D95',
    middle: '#F472B6',
    end: '#C0267A'
  },

  // Borders & Dividers - Subtle elegance
  border: {
    light: '#E6E3F2',
    dark: '#2A253A'
  },

  // Special Effects
  overlay: 'rgba(9, 7, 19, 0.65)',
  glow: {
    primary: 'rgba(92, 61, 217, 0.25)',
    pink: 'rgba(255, 45, 149, 0.2)'
  }
};

// ============================================
// TYPOGRAPHY - Premium hierarchy
// ============================================
export const FONTS = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',

  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    hero: 40,
    display: 48
  },

  lineHeights: {
    tight: 1.1,
    normal: 1.35,
    relaxed: 1.55
  },

  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
};

// ============================================
// SPACING - Generous but refined breathing room
// ============================================
export const SPACING = {
  xxs: 2,
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
};

// ============================================
// BORDER RADIUS - Modern soft & pill shapes
// ============================================
export const BORDER_RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  full: 9999
};

// ============================================
// SHADOWS - Soft, layered, premium depth
// (elevation for Android + boxShadow for web)
// ============================================
export const SHADOWS = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12
  },
  // Colored glows for K-pop magic
  glowPrimary: {
    shadowColor: '#5C3DD9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6
  },
  glowPink: {
    shadowColor: '#FF2D95',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6
  }
};

// ============================================
// TRANSITION TOKENS (for web + future animated)
// ============================================
export const TRANSITIONS = {
  fast: 'all 120ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 320ms cubic-bezier(0.4, 0, 0.2, 1)'
};
