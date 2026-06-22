import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AdminService from '../../services/adminService';
import { showAlert } from '../../utils/alert';
import { COLORS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';
import ImagePicker from '../../components/ImagePicker';

export default function ManageMediaScreen({ navigation }) {
  const { colors } = useTheme();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    youtubeUrl: '',
    type: 'MV',
    category: 'Music Video',
    thumbnailUrl: '',
    thumbnailPath: ''
  });

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    const result = await AdminService.getAllMedia();
    if (result.success) {
      setMedia(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.youtubeUrl) {
      showAlert('Erreur', 'Titre et URL YouTube requis');
      return;
    }

    const result = editingMedia
      ? await AdminService.updateMedia(editingMedia.id, formData)
      : await AdminService.createMedia(formData);

    if (result.success) {
      showAlert('Succès', editingMedia ? 'Média modifié' : 'Média créé');
      setModalVisible(false);
      resetForm();
      loadMedia();
    } else {
      showAlert('Erreur', result.error);
    }
  };

  const handleEdit = (item) => {
    setEditingMedia(item);
    setFormData({
      title: item.title,
      artist: item.artist || '',
      youtubeUrl: item.youtubeUrl,
      type: item.type || 'MV',
      category: item.category || 'Music Video',
      thumbnailUrl: item.thumbnailUrl || '',
      thumbnailPath: item.thumbnailPath || ''
    });
    setModalVisible(true);
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Confirmation',
      'Supprimer ce média ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const result = await AdminService.deleteMedia(item.id);
            if (result.success) loadMedia();
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      youtubeUrl: '',
      type: 'MV',
      category: 'Music Video',
      thumbnailUrl: '',
      thumbnailPath: ''
    });
    setEditingMedia(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#9D7CE8', '#B794F6', '#EC4899']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gérer la Médiathèque</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
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
          {media.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="play-circle-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Aucun média</Text>
              <Button title="Ajouter un média" onPress={() => setModalVisible(true)} />
            </View>
          ) : (
            media.map((item) => (
              <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
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
                  {item.artist} • {item.category}
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
                {editingMedia ? 'Modifier le média' : 'Nouveau média'}
              </Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.label, { color: colors.text }]}>Titre *</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.title} onChangeText={(text) => setFormData({ ...formData, title: text })} placeholder="Titre de la vidéo" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Artiste</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.artist} onChangeText={(text) => setFormData({ ...formData, artist: text })} placeholder="BTS, BLACKPINK, etc." placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>URL YouTube *</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.youtubeUrl} onChangeText={(text) => setFormData({ ...formData, youtubeUrl: text })} placeholder="https://youtube.com/watch?v=..." placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Type</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.type} onChangeText={(text) => setFormData({ ...formData, type: text })} placeholder="MV, Performance, Interview" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Catégorie</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.category} onChangeText={(text) => setFormData({ ...formData, category: text })} placeholder="Music Video, Live, etc." placeholderTextColor={colors.textSecondary} />

              <ImagePicker
                onImageSelected={(url, path) => setFormData({ ...formData, thumbnailUrl: url, thumbnailPath: path })}
                currentImage={formData.thumbnailUrl}
                label="Miniature de la vidéo"
              />

              <Button title={editingMedia ? 'Modifier' : 'Créer'} onPress={handleSubmit} variant="gradient" style={styles.submitButton} />
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
  emptyText: { fontSize: 18, marginTop: SPACING.md, marginBottom: SPACING.lg },
  card: { padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.md, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xs },
  title: { flex: 1, fontSize: 16, fontWeight: 'bold', marginRight: SPACING.sm },
  actions: { flexDirection: 'row' },
  info: { fontSize: 14 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.1)' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { padding: SPACING.md },
  label: { fontSize: 14, fontWeight: '600', marginBottom: SPACING.xs, marginTop: SPACING.sm },
  input: { borderRadius: 8, padding: SPACING.sm, fontSize: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)' },
  submitButton: { marginTop: SPACING.lg, marginBottom: SPACING.xl },
});
