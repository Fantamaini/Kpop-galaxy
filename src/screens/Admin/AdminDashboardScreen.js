import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AdminService from '../../services/adminService';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { getContainerStyle } from '../../utils/responsive';

export default function AdminDashboardScreen({ navigation }) {
  const { colors } = useTheme();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    const result = await AdminService.getStatistics();
    if (result.success) {
      setStats(result.data);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  const adminSections = [
    {
      title: 'Actualités',
      icon: 'newspaper-outline',
      color: '#EC4899',
      count: stats.news || 0,
      screen: 'ManageNews'
    },
    {
      title: 'Groupes K-pop',
      icon: 'people-outline',
      color: '#9D7CE8',
      count: stats.groups || 0,
      screen: 'ManageGroups'
    },
    {
      title: 'Concerts',
      icon: 'musical-notes-outline',
      color: '#F59E0B',
      count: stats.concerts || 0,
      screen: 'ManageConcerts'
    },
    {
      title: 'Médiathèque',
      icon: 'play-circle-outline',
      color: '#10B981',
      count: stats.media || 0,
      screen: 'ManageMedia'
    },
    {
      title: 'Quiz',
      icon: 'help-circle-outline',
      color: '#3B82F6',
      count: stats.quiz || 0,
      screen: 'ManageQuiz'
    },
    {
      title: 'Agenda',
      icon: 'calendar-outline',
      color: '#8B5CF6',
      count: stats.events || 0,
      screen: 'ManageEvents'
    },
    {
      title: 'Utilisateurs',
      icon: 'person-outline',
      color: '#EF4444',
      count: stats.users || 0,
      screen: 'ManageUsers'
    }
  ];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Chargement du dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#9D7CE8', '#B794F6', '#EC4899']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard Admin</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.content, getContainerStyle()]}>
          {/* Statistics Overview */}
          <View style={styles.statsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Vue d'ensemble
            </Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <Ionicons name="people" size={32} color="#9D7CE8" />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {stats.users || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Utilisateurs
                </Text>
              </View>
              
              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <Ionicons name="newspaper" size={32} color="#EC4899" />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {stats.news || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Articles
                </Text>
              </View>
              
              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <Ionicons name="musical-notes" size={32} color="#F59E0B" />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {stats.concerts || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Concerts
                </Text>
              </View>
              
              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <Ionicons name="play-circle" size={32} color="#10B981" />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {stats.media || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Vidéos
                </Text>
              </View>
            </View>
          </View>

          {/* Management Sections */}
          <View style={styles.sectionsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Gestion du contenu
            </Text>
            <View style={styles.sectionsGrid}>
              {adminSections.map((section, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.sectionCard, { backgroundColor: colors.card }]}
                  onPress={() => navigation.navigate(section.screen)}
                >
                  <View style={styles.sectionHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
                      <Ionicons name={section.icon} size={28} color={section.color} />
                    </View>
                    <View style={styles.countBadge}>
                      <Text style={[styles.countText, { color: colors.background }]}>
                        {section.count}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.sectionTitle2, { color: colors.text }]}>
                    {section.title}
                  </Text>
                  <View style={styles.sectionFooter}>
                    <Text style={[styles.actionText, { color: section.color }]}>
                      Gérer
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={section.color} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
  },
  header: {
    paddingTop: SPACING.xl * 2,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  content: {
    padding: SPACING.md,
  },
  statsContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: 14,
    marginTop: SPACING.xs,
  },
  sectionsContainer: {
    marginTop: SPACING.lg,
  },
  sectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  sectionCard: {
    flex: 1,
    minWidth: 160,
    padding: SPACING.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 30,
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle2: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  sectionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
