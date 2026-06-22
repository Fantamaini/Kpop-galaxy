import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { addQuizToHistory, updateStats } from '../../store/slices/gamificationSlice';
import { addToHistory, addBadge, setScore as setReduxScore } from '../../store/slices/quizSlice';
import GamificationService from '../../services/gamificationService';
import { getProgressiveQuiz } from '../../constants/quizData';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function QuizPlayScreen({ route, navigation }) {
  const { category } = route.params;
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [quizStartTime] = useState(Date.now());
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Load expanded question set on mount (20 questions, progressive difficulty)
  useEffect(() => {
    const loadedQuestions = getProgressiveQuiz(category.name, 20);
    // Fallback if category has no data
    const finalQs = loadedQuestions.length > 0 ? loadedQuestions : getProgressiveQuiz('Groupes', 20);
    setQuestions(finalQs);
  }, [category]);

  const currentQ = questions[currentQuestion] || {};
  const totalQuestions = questions.length || 20;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  const getDifficultyLabel = (diff) => {
    switch (diff) {
      case 'easy': return { label: 'FACILE', color: '#10B981' };
      case 'medium': return { label: 'MOYEN', color: '#F59E0B' };
      case 'hard': return { label: 'DIFFICILE', color: '#EF4444' };
      default: return { label: '', color: colors.textSecondary };
    }
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    
    const isCorrect = index === currentQ.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    
    if (isCorrect) {
      setScore(newScore);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz finished - compute result and save
        finishQuiz(newScore);
      }
    }, 900);
  };

  const finishQuiz = async (finalScore) => {
    const accuracy = totalQuestions > 0 ? Math.round((finalScore / totalQuestions) * 100) : 0;
    const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);

    const result = {
      category: category,
      score: finalScore,
      totalQuestions,
      correctAnswers: finalScore,
      accuracy,
      timeSpent,
      xpGained: 0 // filled after gamification call
    };

    // Dispatch local quiz history (old slice for compatibility)
    dispatch(addToHistory(result));
    dispatch(setReduxScore(finalScore));

    // Persist + award XP via service (also updates Firestore)
    let xpGained = 0;
    let leveledUp = false;
    let newBadges = [];

    if (user && user.uid) {
      const saveRes = await GamificationService.recordQuizCompletion(user.uid, {
        ...result,
        accuracy
      });

      if (saveRes.success) {
        xpGained = saveRes.xpGained || 0;
        leveledUp = !!saveRes.leveledUp;
        newBadges = saveRes.newBadges || [];
        result.xpGained = xpGained;

        // Update Redux gamification
        dispatch(addQuizToHistory(result));
        dispatch(updateStats({ 
          quizzesTaken: (saveRes.stats?.quizzesTaken) || undefined 
        }));

        // Legacy badge sync
        newBadges.forEach(badge => dispatch(addBadge(badge)));
      }
    } else {
      // Guest mode: still give local XP feeling
      xpGained = 40 + (accuracy >= 100 ? 30 : accuracy >= 80 ? 15 : 0);
      result.xpGained = xpGained;
      dispatch(addQuizToHistory(result));
    }

    setQuizResult({ ...result, xpGained, leveledUp, newBadges });
    setShowResults(true);
  };

  const handleFinish = () => {
    navigation.goBack();
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Chargement des questions...</Text>
      </SafeAreaView>
    );
  }

  // RESULTS SCREEN
  if (showResults && quizResult) {
    const { accuracy, xpGained, leveledUp, newBadges } = quizResult;
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
            <Ionicons 
              name={accuracy >= 80 ? "trophy" : accuracy >= 50 ? "star" : "sad-outline"} 
              size={64} 
              color={accuracy >= 80 ? '#F59E0B' : colors.primary} 
            />
            <Text style={[styles.resultTitle, { color: colors.text }]}>
              Quiz terminé !
            </Text>
            <Text style={[styles.resultScore, { color: colors.primary }]}>
              {quizResult.score} / {totalQuestions}
            </Text>
            <Text style={[styles.resultAccuracy, { color: colors.textSecondary }]}>
              {accuracy}% de bonnes réponses
            </Text>

            <View style={styles.xpContainer}>
              <Ionicons name="flash" size={20} color="#F59E0B" />
              <Text style={[styles.xpText, { color: colors.text }]}>
                +{xpGained} XP gagnés !
              </Text>
            </View>

            {leveledUp && (
              <View style={[styles.levelUpBanner, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="arrow-up-circle" size={22} color={colors.success} />
                <Text style={[styles.levelUpText, { color: colors.success }]}>Niveau supérieur débloqué !</Text>
              </View>
            )}

            {newBadges && newBadges.length > 0 && (
              <View style={styles.badgesEarned}>
                <Text style={[styles.badgesTitle, { color: colors.text }]}>Nouveaux badges :</Text>
                {newBadges.map((b, idx) => (
                  <Text key={idx} style={styles.badgeEarnedText}>{b.icon} {b.name}</Text>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.finishButton, { backgroundColor: colors.primary }]}
            onPress={handleFinish}
          >
            <Text style={styles.finishButtonText}>Retour aux quizzes</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // PLAYING SCREEN
  const diffMeta = getDifficultyLabel(currentQ.difficulty);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.progress, { color: colors.text }]}>
          {currentQuestion + 1} / {totalQuestions}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: colors.primary,
              width: `${progress}%`
            }
          ]} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Category + Difficulty */}
        <View style={styles.metaRow}>
          <Text style={[styles.categoryLabel, { color: colors.primary }]}>
            {category.name}
          </Text>
          {diffMeta.label && (
            <View style={[styles.diffBadge, { backgroundColor: diffMeta.color + '22' }]}>
              <Text style={[styles.diffText, { color: diffMeta.color }]}>{diffMeta.label}</Text>
            </View>
          )}
        </View>

        {/* Question */}
        <View style={[styles.questionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.question, { color: colors.text }]}>
            {currentQ.question}
          </Text>
        </View>

        {/* Answers */}
        <View style={styles.answers}>
          {(currentQ.answers || []).map((answer, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQ.correctAnswer;
            
            let backgroundColor = colors.card;
            let borderColor = colors.border;
            
            if (isSelected) {
              backgroundColor = isCorrect ? colors.success : colors.error;
              borderColor = isCorrect ? colors.success : colors.error;
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                style={[
                  styles.answerButton,
                  { backgroundColor, borderColor }
                ]}
              >
                <Text style={[
                  styles.answerText,
                  { color: isSelected ? '#FFFFFF' : colors.text }
                ]}>
                  {answer}
                </Text>
                {isSelected && (
                  <Ionicons 
                    name={isCorrect ? 'checkmark-circle' : 'close-circle'} 
                    size={24} 
                    color="#FFFFFF" 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          {currentQ.difficulty === 'hard' ? 'Question difficile • +XP bonus si parfait' : 'Réponds rapidement pour plus de fun !'}
        </Text>
      </ScrollView>
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
  progress: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600'
  },
  progressBarContainer: {
    height: 6,
    marginHorizontal: SPACING.lg,
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: 3
  },
  content: {
    padding: SPACING.lg
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm
  },
  categoryLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    letterSpacing: 1
  },
  diffBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm
  },
  diffText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700'
  },
  questionCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginVertical: SPACING.lg,
    elevation: 4
  },
  question: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    lineHeight: 32
  },
  answers: {
    gap: SPACING.md
  },
  answerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    elevation: 2
  },
  answerText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    flex: 1
  },
  hint: {
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontSize: FONTS.sizes.xs
  },
  // Results
  resultsContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    paddingTop: SPACING.xxxl
  },
  resultCard: {
    width: '100%',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    elevation: 6
  },
  resultTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    marginTop: SPACING.md
  },
  resultScore: {
    fontSize: 56,
    fontWeight: '800',
    marginVertical: SPACING.xs
  },
  resultAccuracy: {
    fontSize: FONTS.sizes.lg,
    marginBottom: SPACING.lg
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm
  },
  xpText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700'
  },
  levelUpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md
  },
  levelUpText: {
    fontWeight: '700'
  },
  badgesEarned: {
    marginTop: SPACING.lg,
    alignItems: 'center'
  },
  badgesTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginBottom: SPACING.xs
  },
  badgeEarnedText: {
    fontSize: FONTS.sizes.md,
    marginVertical: 2
  },
  finishButton: {
    marginTop: SPACING.xxl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    width: '100%'
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '700'
  }
});
