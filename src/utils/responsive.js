import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Breakpoints
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280
};

// Détection du type d'appareil
export const isSmallDevice = SCREEN_WIDTH < BREAKPOINTS.mobile;
export const isMobile = SCREEN_WIDTH < BREAKPOINTS.tablet;
export const isTablet = SCREEN_WIDTH >= BREAKPOINTS.tablet && SCREEN_WIDTH < BREAKPOINTS.desktop;
export const isDesktop = SCREEN_WIDTH >= BREAKPOINTS.desktop;
export const isWeb = Platform.OS === 'web';

// Largeur maximale pour le contenu (premium web breathing room)
export const getMaxWidth = () => {
  if (SCREEN_WIDTH < BREAKPOINTS.tablet) return '100%';
  if (SCREEN_WIDTH < BREAKPOINTS.desktop) return BREAKPOINTS.tablet;
  if (SCREEN_WIDTH < 1400) return 1180;
  return 1320; // generous on very wide screens
};

// Colonnes pour les grilles
export const getGridColumns = () => {
  if (SCREEN_WIDTH < BREAKPOINTS.mobile) return 1;
  if (SCREEN_WIDTH < BREAKPOINTS.tablet) return 2;
  if (SCREEN_WIDTH < BREAKPOINTS.desktop) return 3;
  return 4;
};

// Taille des cartes
export const getCardWidth = (columns = 2, padding = 32, gap = 16) => {
  const totalPadding = padding * 2;
  const totalGap = gap * (columns - 1);
  return (SCREEN_WIDTH - totalPadding - totalGap) / columns;
};

// Responsive font size
export const responsiveFontSize = (size) => {
  const scale = SCREEN_WIDTH / 375; // Base: iPhone X
  const newSize = size * scale;
  return Math.round(newSize);
};

// Responsive spacing
export const responsiveSpacing = (size) => {
  if (SCREEN_WIDTH < BREAKPOINTS.mobile) return size * 0.8;
  if (SCREEN_WIDTH < BREAKPOINTS.tablet) return size;
  return size * 1.2;
};

// Container style responsive
export const getContainerStyle = () => ({
  width: '100%',
  maxWidth: getMaxWidth(),
  alignSelf: 'center',
  paddingHorizontal: isMobile ? 16 : isTablet ? 24 : 32
});
