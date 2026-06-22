import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../store/slices/authSlice';
import AuthService from '../../services/authService';
import GamificationService from '../../services/gamificationService';
import { setGamificationData } from '../../store/slices/gamificationSlice';
import Button from '../../components/Button';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function ProfileScreen({ navigation }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const favorites = useSelector(state => state.favorites);
  const quizHistory = useSelector(state => state.quiz.history);
  const gamification = useSelector(state => state.gamification);
  const badges = gamification?.badges?.length ? gamification.badges : (useSelector(state => state.quiz.badges) || []);

  // Load latest gamification data when profile mounts
  useEffect(() => {
    const loadGamif = async () => {
      if (user?.uid) {
        const res = await GamificationService.getUserGamification(user.uid);
        if (res.success) {
          dispatch(setGamificationData(res.data));
        }
      }
    };
    loadGamif();
  }, [user?.uid]);

  const handleLogout = async () => {
    await AuthService.signOut();
    dispatch(logout());
    navigation.replace('Login');
  };

  const xp = gamification?.xp || 0;
  const level = gamification?.level || { title: 'Rookie Fan', minXP: 0 };
  const progress = gamification?.progress || 0;

  const menuItems = [
    { id: 1, title: 'Favoris', icon: 'heart', count: favorites.groups.length, route: 'Favorites' },
    { id: 2, title: 'Quiz complétés', icon: 'trophy', count: gamification?.stats?.quizzesTaken || quizHistory.length },
    { id: 3, title: 'Badges', icon: 'star', count: badges.length },
    { id: 4, title: 'Top Fans', icon: 'globe', route: 'Leaderboard' },
    { id: 5, title: 'KChat IA', icon: 'chatbubbles', route: 'KChat' },
    { id: 6, title: 'Mode sombre', icon: isDarkMode ? 'moon' : 'sunny', toggle: true }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header avec profil */}
        <LinearGradient
          colors={[COLORS.gradient.start, COLORS.gradient.end]}
          style={styles.header}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.userName}>
            {user?.displayName || 'Utilisateur'}
          </Text>
          
          <Text style={styles.userEmail}>
            {user?.email || 'email@example.com'}
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* My Idol Universe Header */}
        <View style={[styles.universeHeader, { backgroundColor: colors.card }]}>
          <Text style={[styles.universeTitle, { color: colors.text }]}>My Idol Universe</Text>
          <Text style={[styles.levelTitle, { color: colors.primary }]}>{level.title}</Text>

          {/* XP Bar */}
          <View style={styles.xpContainer}>
            <View style={[styles.xpBarBg, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.xpBarFill, 
                  { 
                    backgroundColor: '#F59E0B',
                    width: `${Math.round(progress * 100)}%` 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.xpText, { color: colors.text }]}>
              {xp} XP
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Ionicons name="heart" size={24} color={colors.secondary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {favorites.groups.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Favoris
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Ionicons name="trophy" size={24} color={colors.warning} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {gamification?.stats?.quizzesTaken || quizHistory.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Quiz
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Ionicons name="star" size={24} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {badges.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Badges
              </Text>
            </View>
          </View>

          {/* Menu */}
          <View style={[styles.menu, { backgroundColor: colors.card }]}>
            {menuItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => {
                    if (item.toggle) {
                      toggleTheme();
                    } else if (item.route) {
                      navigation.navigate(item.route);
                    }
                  }}
                >
                  <View style={styles.menuLeft}>
                    <View style={[styles.menuIcon, { backgroundColor: colors.background }]}>
                      <Ionicons name={item.icon} size={20} color={colors.primary} />
                    </View>
                    <Text style={[styles.menuText, { color: colors.text }]}>
                      {item.title}
                    </Text>
                  </View>

                  {item.count !== undefined && !item.toggle && (
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.badgeText}>{item.count}</Text>
                    </View>
                  )}

                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                {index < menuItems.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>

          {/* My Idol Universe - Biases / Personalization teaser */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mes Biases & Univers</Text>
            {gamification?.biases?.length > 0 ? (
              <Text style={{ color: colors.textSecondary }}>
                {gamification.biases.map(b => b.name || b).join(', ')}
              </Text>
            ) : (
              <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
                Sélectionne tes biases dans les réglages pour personnaliser ton univers.
              </Text>
            )}
            <TouchableOpacity style={styles.smallBtn} onPress={() => navigation.navigate('Groups')}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Choisir mes groupes favoris →</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Badges */}
          {badges.length > 0 && (
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges récents</Text>
              <View style={styles.badgesRow}>
                {badges.slice(0, 5).map((b, i) => (
                  <View key={i} style={styles.badgePill}>
                    <Text>{b.icon || '🏅'} {b.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Paramètres */}
          <TouchableOpacity style={[styles.menu, styles.menuSingle, { backgroundColor: colors.card }]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.background }]}>
                <Ionicons name="settings" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Paramètres
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Déconnexion */}
          <Button 
            title="Se déconnecter"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg
  },
  avatarContainer: {
    marginBottom: SPACING.md
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF'
  },
  userName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: SPACING.xs
  },
  userEmail: {
    fontSize: FONTS.sizes.sm,
    color: '#FFFFFF',
    opacity: 0.8
  },
  content: {
    padding: SPACING.lg
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg
  },
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    elevation: 2
  },
  statNumber: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    marginVertical: SPACING.xs
  },
  statLabel: {
    fontSize: FONTS.sizes.xs
  },
  menu: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    elevation: 2
  },
  menuSingle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md
  },
  menuText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500'
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
    marginRight: SPACING.sm
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.xs,
    fontWeight: '600'
  },
  divider: {
    height: 1,
    marginHorizontal: SPACING.md
  },
  logoutButton: {
    marginTop: SPACING.md
  },
  // My Idol Universe additions
  universeHeader: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2
  },
  universeTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginBottom: 2
  },
  levelTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    marginBottom: SPACING.sm
  },
  xpContainer: {
    marginTop: SPACING.xs
  },
  xpBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 4
  },
  xpText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    textAlign: 'right'
  },
  section: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginBottom: SPACING.sm
  },
  placeholder: {
    fontSize: FONTS.sizes.sm,
    fontStyle: 'italic'
  },
  smallBtn: {
    marginTop: SPACING.sm
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  badgePill: {
    backgroundColor: 'rgba(92, 61, 217, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: FONTS.sizes.xs
  }
});
