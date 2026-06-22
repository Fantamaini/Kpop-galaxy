import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AdminService from '../../services/adminService';
import { COLORS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';

export default function ManageQuizScreen({ navigation }) {
  const { colors } = useTheme();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Moyen',
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    const result = await AdminService.getAllQuiz();
    if (result.success) {
      setQuizzes(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || formData.questions.length === 0) {
      Alert.alert('Erreur', 'Titre et au moins 1 question requis');
      return;
    }

    const result = editingQuiz
      ? await AdminService.updateQuiz(editingQuiz.id, formData)
      : await AdminService.createQuiz(formData);

    if (result.success) {
      showAlert('Succès', editingQuiz ? 'Quiz modifié' : 'Quiz créé');
      setModalVisible(false);
      resetForm();
      loadQuizzes();
    } else {
      showAlert('Erreur', result.error);
    }
  };

  const handleEdit = (item) => {
    setEditingQuiz(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      difficulty: item.difficulty || 'Moyen',
      questions: item.questions || []
    });
    setModalVisible(true);
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Confirmation',
      'Supprimer ce quiz ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const result = await AdminService.deleteQuiz(item.id);
            if (result.success) loadQuizzes();
          }
        }
      ]
    );
  };

  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(o => !o)) {
      Alert.alert('Erreur', 'Remplissez la question et toutes les options');
      return;
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, { ...currentQuestion }]
    });
    setCurrentQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', difficulty: 'Moyen', questions: [] });
    setCurrentQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
    setEditingQuiz(null);
  };

  const openModal = () => {
    resetForm();
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#9D7CE8', '#B794F6', '#EC4899']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gérer les Quiz</Text>
          <TouchableOpacity onPress={openModal}>
            <Ionicons name="add-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {quizzes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="help-circle-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Aucun quiz</Text>
              <Button title="Créer un quiz" onPress={openModal} />
            </View>
          ) : (
            quizzes.map((item) => (
              <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleEdit(item)}>
                      <Ionicons name="create-outline" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} style={{ marginLeft: 12 }}>
                      <Ionicons name="trash-outline" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={[styles.info, { color: colors.textSecondary }]}>
                  Questions: {item.questions?.length || 0} • Joué: {item.plays || 0} fois
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingQuiz ? 'Modifier le quiz' : 'Nouveau quiz'}
              </Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.label, { color: colors.text }]}>Titre *</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.title} onChangeText={(text) => setFormData({ ...formData, title: text })} placeholder="Quiz K-pop" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Description</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.description} onChangeText={(text) => setFormData({ ...formData, description: text })} placeholder="Description du quiz" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Difficulté</Text>
              <View style={styles.difficultyButtons}>
                {['Facile', 'Moyen', 'Difficile'].map(diff => (
                  <TouchableOpacity key={diff} onPress={() => setFormData({ ...formData, difficulty: diff })} style={[styles.diffButton, formData.difficulty === diff && { backgroundColor: COLORS.primary }]}>
                    <Text style={[styles.diffText, { color: formData.difficulty === diff ? '#fff' : colors.text }]}>{diff}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Questions ({formData.questions.length})</Text>
              {formData.questions.map((q, idx) => (
                <View key={idx} style={[styles.questionCard, { backgroundColor: colors.background }]}>
                  <Text style={[styles.qText, { color: colors.text }]}>{idx + 1}. {q.question}</Text>
                  <TouchableOpacity onPress={() => removeQuestion(idx)}>
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Ajouter une question</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={currentQuestion.question} onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, question: text })} placeholder="Question" placeholderTextColor={colors.textSecondary} />

              {currentQuestion.options.map((opt, idx) => (
                <View key={idx} style={styles.optionRow}>
                  <TouchableOpacity onPress={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: idx })} style={[styles.radio, currentQuestion.correctAnswer === idx && styles.radioSelected]}>
                    {currentQuestion.correctAnswer === idx && <View style={styles.radioDot} />}
                  </TouchableOpacity>
                  <TextInput style={[styles.optionInput, { backgroundColor: colors.background, color: colors.text }]} value={opt} onChangeText={(text) => {
                    const newOpts = [...currentQuestion.options];
                    newOpts[idx] = text;
                    setCurrentQuestion({ ...currentQuestion, options: newOpts });
                  }} placeholder={`Option ${idx + 1}`} placeholderTextColor={colors.textSecondary} />
                </View>
              ))}

              <Button title="+ Ajouter cette question" onPress={addQuestion} style={{ marginTop: SPACING.sm }} />
              <Button title={editingQuiz ? 'Modifier' : 'Créer'} onPress={handleSubmit} variant="gradient" style={styles.submitButton} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: SPACING.xl * 2, paddingBottom: SPACING.lg, paddingHorizontal: SPACING.md },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.md },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 18, marginTop: SPACING.md },
  card: { padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.md, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  title: { flex: 1, fontSize: 16, fontWeight: 'bold' },
  actions: { flexDirection: 'row' },
  info: { fontSize: 14 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.1)' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { padding: SPACING.md },
  label: { fontSize: 14, fontWeight: '600', marginBottom: SPACING.xs, marginTop: SPACING.sm },
  input: { borderRadius: 8, padding: SPACING.sm, fontSize: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)' },
  difficultyButtons: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  diffButton: { flex: 1, padding: SPACING.sm, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', alignItems: 'center' },
  diffText: { fontSize: 14, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: SPACING.md, marginBottom: SPACING.sm },
  questionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.sm, borderRadius: 8, marginBottom: SPACING.xs },
  qText: { flex: 1, fontSize: 14 },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.primary, marginRight: SPACING.sm, justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: COLORS.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  optionInput: { flex: 1, borderRadius: 8, padding: SPACING.sm, fontSize: 14, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)' },
  submitButton: { marginTop: SPACING.lg, marginBottom: SPACING.xl },
});
