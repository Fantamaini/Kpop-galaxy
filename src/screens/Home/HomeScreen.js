import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Image 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import AuthService from '../../services/authService';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { getContainerStyle, isMobile, isTablet, isWeb } from '../../utils/responsive';

export default function HomeScreen({ navigation }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const user = useSelector(state => state.auth.user);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && user.uid) {
        const adminStatus = await AuthService.isAdmin();
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, [user]);

  const menuItems = [
    { 
      id: 1, 
      title: 'News Feed', 
      icon: 'newspaper', 
      route: 'News',
      gradient: [COLORS.primary, COLORS.accent]
    },
    { 
      id: 2, 
      title: 'Groupes K-pop', 
      icon: 'people', 
      route: 'Groups',
      gradient: [COLORS.secondary, '#FF6B9D']
    },
    { 
      id: 3, 
      title: 'Concerts', 
      icon: 'musical-notes', 
      route: 'Concerts',
      gradient: [COLORS.accent, COLORS.secondary]
    },
    { 
      id: 4, 
      title: 'Médiathèque', 
      icon: 'play-circle', 
      route: 'MediaLibrary',
      gradient: [COLORS.primary, COLORS.secondary]
    },
    { 
      id: 5, 
      title: 'Quiz', 
      icon: 'help-circle', 
      route: 'Quiz',
      gradient: ['#F59E0B', '#EF4444']
    },
    { 
      id: 6, 
      title: 'Agenda', 
      icon: 'calendar', 
      route: 'Agenda',
      gradient: ['#10B981', '#3B82F6']
    }
  ];

  const containerStyle = getContainerStyle();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Header */}
      <View style={[styles.header, containerStyle, { paddingTop: isWeb ? SPACING.lg : SPACING.xl }]}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={[styles.appTitle, { color: colors.text }]}>K-POP GALAXY</Text>
            <Text style={[styles.appTagline, { color: colors.textSecondary }]}>L'univers des fans</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={toggleTheme} 
            style={[styles.themeButton, { backgroundColor: colors.card }, isWeb && styles.webHover]}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isDarkMode ? 'sunny' : 'moon'} 
              size={22} 
              color={colors.text} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, containerStyle]}
      >
        {/* HERO — Stunning & Immersive */}
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0.05 }}
          end={{ x: 1, y: 0.95 }}
          style={styles.hero}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>BIENVENUE DANS LA GALAXIE</Text>
            <Text style={styles.heroTitle}>K-POP{'\n'}GALAXY</Text>
            <Text style={styles.heroSubtitle}>
              Toute la K-pop. En un seul endroit.{'\n'}Actualités, concerts, vidéos, quiz et plus encore.
            </Text>

            <TouchableOpacity 
              style={styles.heroCta} 
              onPress={() => navigation.navigate('Groups')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroCtaText}>Explorer les groupes →</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* EXPLORER — Beautiful feature grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Explorer</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Tout ce qu'un fan mérite</Text>
          </View>
          
          <View style={styles.grid}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.82}
                style={[styles.menuItemWrapper, isWeb && styles.webCardHover]}
              >
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0.1, y: 0.1 }}
                  end={{ x: 0.9, y: 1 }}
                  style={styles.menuItem}
                >
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon} size={isTablet ? 34 : 30} color="#FFFFFF" />
                  </View>
                  <Text style={styles.menuText}>{item.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* NEW: ENGAGE — Gamification + Social + AI (K-POP GALAXY advanced) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Engage &amp; Gamify</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Gagne de l'XP, discute avec l'IA, domine le classement</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: SPACING.md }}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('KChat')} 
              style={[styles.engageCard, { backgroundColor: colors.card }]}
            >
              <Ionicons name="chatbubbles" size={26} color={colors.primary} />
              <Text style={[styles.engageTitle, { color: colors.text }]}>KChat IA</Text>
              <Text style={[styles.engageSub, { color: colors.textSecondary }]}>Recommandations • Fanfics • Analyse bias</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Leaderboard')} 
              style={[styles.engageCard, { backgroundColor: colors.card }]}
            >
              <Ionicons name="trophy" size={26} color="#F59E0B" />
              <Text style={[styles.engageTitle, { color: colors.text }]}>Top Fans</Text>
              <Text style={[styles.engageSub, { color: colors.textSecondary }]}>Classement mondial des stans</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ADMIN — Elegant & prominent when visible */}
        {isAdmin && (
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminDashboard')}
              activeOpacity={0.88}
              style={isWeb && styles.webCardHover}
            >
              <LinearGradient
                colors={['#E11D48', '#BE123C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.adminButton}
              >
                <View style={styles.adminButtonContent}>
                  <View style={styles.adminIconWrap}>
                    <Ionicons name="shield-checkmark" size={26} color="#FFFFFF" />
                  </View>
                  <View style={styles.adminButtonText}>
                    <Text style={styles.adminButtonTitle}>Dashboard Administrateur</Text>
                    <Text style={styles.adminButtonSubtitle}>Gérer le contenu, les quiz, les utilisateurs et plus</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* STATS — Premium stat cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ton activité</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Continue à briller</Text>
          </View>

          <View style={styles.statsContainer}>
            {[
              { icon: 'heart', label: 'Favoris', value: '0', color: COLORS.secondary },
              { icon: 'trophy', label: 'Quiz complétés', value: '0', color: COLORS.warning },
              { icon: 'star', label: 'Badges', value: '0', color: COLORS.primary },
            ].map((stat, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: colors.card }, isWeb && styles.webCardHover]}>
                <Ionicons name={stat.icon} size={22} color={stat.color} />
                <Text style={[styles.statNumber, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logo: {
    width: 46,
    height: 46,
  },
  appTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  appTagline: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: -2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  themeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  webHover: {
    // @ts-ignore web
    cursor: 'pointer',
  },

  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },

  // HERO
  hero: {
    borderRadius: BORDER_RADIUS.xxl,
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
    minHeight: 280,
    justifyContent: 'center',
  },
  heroContent: {
    maxWidth: 620,
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: SPACING.sm,
  },
  heroTitle: {
    fontSize: FONTS.sizes.xxxl + 10,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 50,
    marginBottom: SPACING.md,
    letterSpacing: -1.2,
  },
  heroSubtitle: {
    fontSize: FONTS.sizes.lg,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 26,
    marginBottom: SPACING.xl,
  },
  heroCta: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  heroCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.3,
  },

  // SECTIONS
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: FONTS.sizes.sm,
    marginTop: 2,
    fontWeight: '500',
  },

  // FEATURE GRID
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  menuItemWrapper: {
    width: isMobile ? '47.5%' : isTablet ? '31%' : '23%',
    minWidth: 138,
  },
  menuItem: {
    height: isTablet ? 134 : 122,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    justifyContent: 'space-between',
    ...SHADOWS.lg,
  },
  menuIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: isTablet ? FONTS.sizes.md : FONTS.sizes.sm,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  webCardHover: {
    // @ts-ignore - nice lift on web
    transition: 'transform 160ms ease, box-shadow 160ms ease',
    cursor: 'pointer',
  },

  // ADMIN BANNER
  adminButton: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.xl,
  },
  adminButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  adminIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminButtonText: {
    flex: 1,
  },
  adminButtonTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    marginBottom: 2,
  },
  adminButtonSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FONTS.sizes.sm,
  },

  // STATS
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  statNumber: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    marginVertical: 6,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ENGAGE CARDS (KChat, Leaderboard, Gamification)
  engageCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.md
  },
  engageTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginTop: 8,
    color: '#FFFFFF' // overridden inline when needed
  },
  engageSub: {
    fontSize: FONTS.sizes.xs,
    marginTop: 2
  }
});
