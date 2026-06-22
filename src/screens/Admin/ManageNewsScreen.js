import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AdminService from '../../services/adminService';
import { showAlert } from '../../utils/alert';
import ImagePicker from '../../components/ImagePicker';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';

export default function ManageNewsScreen({ navigation }) {
  const { colors } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'K-pop',
    imageUrl: '',
    imagePath: '',
    author: 'Admin'
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    const result = await AdminService.getAllNews();
    if (result.success) {
      setNews(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      showAlert('Erreur', 'Titre et contenu requis');
      return;
    }

    const result = editingNews
      ? await AdminService.updateNews(editingNews.id, formData)
      : await AdminService.createNews(formData);

    if (result.success) {
      showAlert('Succès', editingNews ? 'Article modifié' : 'Article créé');
      setModalVisible(false);
      resetForm();
      loadNews();
    } else {
      showAlert('Erreur', result.error);
    }
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      imageUrl: item.imageUrl || '',
      imagePath: item.imagePath || '',
      author: item.author
    });
    setModalVisible(true);
  };

  const handleDelete = (item) => {
    showAlert(
      'Confirmation',
      'Supprimer cet article ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const result = await AdminService.deleteNews(item.id);
            if (result.success) {
              loadNews();
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'K-pop',
      imageUrl: '',
      imagePath: '',
      author: 'Admin'
    });
    setEditingNews(null);
  };

  const openModal = () => {
    resetForm();
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#9D7CE8', '#B794F6', '#EC4899']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gérer les Actualités</Text>
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
          {news.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="newspaper-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aucune actualité
              </Text>
              <Button title="Créer un article" onPress={openModal} />
            </View>
          ) : (
            news.map((item) => (
              <View key={item.id} style={[styles.newsCard, { backgroundColor: colors.card }]}>
                <View style={styles.newsHeader}>
                  <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleEdit(item)}>
                      <Ionicons name="create-outline" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} style={{ marginLeft: 12 }}>
                      <Ionicons name="trash-outline" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={[styles.newsContent, { color: colors.textSecondary }]} numberOfLines={3}>
                  {item.content}
                </Text>
                <View style={styles.newsFooter}>
                  <Text style={[styles.newsCategory, { color: COLORS.primary }]}>
                    {item.category}
                  </Text>
                  <Text style={[styles.newsDate, { color: colors.textSecondary }]}>
                    {item.createdAt?.toDate?.().toLocaleDateString('fr-FR') || 'Date inconnue'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Modal for Create/Edit */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingNews ? 'Modifier l\'article' : 'Nouvel article'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.label, { color: colors.text }]}>Titre *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="Titre de l'article"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.label, { color: colors.text }]}>Contenu *</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.background, color: colors.text }]}
                value={formData.content}
                onChangeText={(text) => setFormData({ ...formData, content: text })}
                placeholder="Contenu de l'article"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
              />

              <Text style={[styles.label, { color: colors.text }]}>Catégorie</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                placeholder="Catégorie"
                placeholderTextColor={colors.textSecondary}
              />

              <ImagePicker
                onImageSelected={(url, path) => setFormData({ ...formData, imageUrl: url, imagePath: path })}
                currentImage={formData.imageUrl}
                label="Image de l'article"
              />

              <Button 
                title={editingNews ? 'Modifier' : 'Créer'} 
                onPress={handleSubmit}
                variant="gradient"
                style={styles.submitButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  newsCard: {
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  newsTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
  },
  newsContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  newsCategory: {
    fontSize: 12,
    fontWeight: '600',
  },
  newsDate: {
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  textArea: {
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
});
