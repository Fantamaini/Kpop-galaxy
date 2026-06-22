import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminService from '../../services/adminService';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

/**
 * Top Fans of the Week / Global Leaderboard
 * Simple implementation: sorts by xp + quizzesTaken
 */
export default function LeaderboardScreen({ navigation }) {
  const { colors } = useTheme();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaders = async () => {
      setLoading(true);
      try {
        const res = await AdminService.getAllUsers();
        let users = (res.data || []).map((u, idx) => {
          const xp = u.xp || 0;
          const qCount = u.stats?.quizzesTaken || (u.quizHistory?.length || 0);
          return {
            id: u.uid,
            rank: idx + 1,
            displayName: u.displayName || u.email?.split('@')[0] || 'Fan anonyme',
            xp,
            quizzes: qCount,
            levelTitle: u.levelTitle || 'Rookie Fan'
          };
        });

        // Sort by XP then quizzes
        users.sort((a, b) => (b.xp - a.xp) || (b.quizzes - a.quizzes));
        users = users.slice(0, 25).map((u, i) => ({ ...u, rank: i + 1 }));

        setLeaders(users);
      } catch (e) {
        console.warn('Leaderboard load error:', e.message);
        setLeaders([]);
      }
      setLoading(false);
    };
    loadLeaders();
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, { backgroundColor: colors.card }]}>
      <View style={styles.rank}>
        <Text style={[styles.rankText, { color: index < 3 ? '#F59E0B' : colors.text }]}>#{item.rank}</Text>
      </View>
      <View style={styles.user}>
        <Text style={[styles.name, { color: colors.text }]}>{item.displayName}</Text>
        <Text style={[styles.level, { color: colors.textSecondary }]}>{item.levelTitle}</Text>
      </View>
      <View style={styles.stats}>
        <Text style={[styles.xp, { color: colors.primary }]}>{item.xp} XP</Text>
        <Text style={[styles.quizzes, { color: colors.textSecondary }]}>{item.quizzes} quizzes</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Top Fans de la Semaine</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : leaders.length > 0 ? (
        <FlatList
          data={leaders}
          renderItem={renderItem}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: SPACING.lg }}
        />
      ) : (
        <View style={styles.empty}>
          <Ionicons name="globe-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Le classement s'affichera dès que des fans accumulent de l'XP !
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xl
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    elevation: 1
  },
  rank: { width: 42 },
  rankText: { fontSize: FONTS.sizes.lg, fontWeight: '800' },
  user: { flex: 1 },
  name: { fontSize: FONTS.sizes.md, fontWeight: '600' },
  level: { fontSize: FONTS.sizes.xs },
  stats: { alignItems: 'flex-end' },
  xp: { fontWeight: '700' },
  quizzes: { fontSize: FONTS.sizes.xs },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { marginTop: SPACING.md, textAlign: 'center', paddingHorizontal: 40 }
});
