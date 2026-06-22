import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { QUIZ_CATEGORIES } from '../../constants/data';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function QuizScreen({ navigation }) {
  const { colors } = useTheme();
  const gamification = useSelector(state => state.gamification);
  const quizHistory = useSelector(state => state.quiz.history) || [];

  const quizzesTaken = gamification?.stats?.quizzesTaken || quizHistory.length || 0;
  const badgesCount = (gamification?.badges?.length || 0);
  const avgScore = quizzesTaken > 0 
    ? Math.round(quizHistory.reduce((sum, h) => sum + (h.accuracy || (h.score / h.totalQuestions * 100) || 0), 0) / quizzesTaken)
    : 0;

  const handleStartQuiz = (category) => {
    navigation.navigate('QuizPlay', { category });
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleStartQuiz(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[COLORS.gradient.start, COLORS.gradient.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.categoryCard}
      >
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <Text style={styles.categoryName}>{item.name}</Text>
        <View style={styles.categoryInfo}>
          <Ionicons name="help-circle-outline" size={16} color="#FFFFFF" />
          <Text style={styles.categoryText}>20 questions</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Quiz K-pop
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Quiz')}>
          <Ionicons name="trophy" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Gamification Stats */}
      <View style={styles.stats}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{quizzesTaken}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Quiz complétés
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{badgesCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Badges
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{avgScore}%</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Score moyen
          </Text>
        </View>
      </View>

      {/* XP teaser */}
      <View style={[styles.xpBar, { backgroundColor: colors.card }]}>
        <Ionicons name="flash" size={18} color="#F59E0B" />
        <Text style={[styles.xpLabel, { color: colors.text }]}>
          {gamification?.xp || 0} XP • {gamification?.level?.title || 'Rookie Fan'}
        </Text>
      </View>

      {/* Categories */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Choisissez une catégorie (20 questions)
      </Text>

      <FlatList
        data={QUIZ_CATEGORIES}
        renderItem={renderCategory}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
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
  stats: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
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
    fontWeight: 'bold'
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.xs,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md
  },
  grid: {
    paddingHorizontal: SPACING.lg
  },
  row: {
    gap: SPACING.md,
    marginBottom: SPACING.md
  },
  categoryCard: {
    width: (100 * 1.7),
    height: 160,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    justifyContent: 'space-between',
    elevation: 4
  },
  categoryIcon: {
    fontSize: 40
  },
  categoryName: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  categoryText: {
    fontSize: FONTS.sizes.xs,
    color: '#FFFFFF',
    opacity: 0.9
  },
  xpBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md
  },
  xpLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600'
  }
});
