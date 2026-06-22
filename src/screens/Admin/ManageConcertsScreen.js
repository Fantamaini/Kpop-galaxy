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
import { COLORS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';
import ImagePicker from '../../components/ImagePicker';

export default function ManageConcertsScreen({ navigation }) {
  const { colors } = useTheme();
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConcert, setEditingConcert] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    date: '',
    venue: '',
    city: '',
    country: '',
    ticketUrl: '',
    imageUrl: '',
    imagePath: '',
    description: ''
  });

  useEffect(() => {
    loadConcerts();
  }, []);

  const loadConcerts = async () => {
    setLoading(true);
    const result = await AdminService.getAllConcerts();
    if (result.success) {
      setConcerts(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.date) {
      Alert.alert('Erreur', 'Titre et date requis');
      return;
    }

    const result = editingConcert
      ? await AdminService.updateConcert(editingConcert.id, formData)
      : await AdminService.createConcert(formData);

    if (result.success) {
      Alert.alert('Succès', editingConcert ? 'Concert modifié' : 'Concert créé');
      setModalVisible(false);
      resetForm();
      loadConcerts();
    } else {
      Alert.alert('Erreur', result.error);
    }
  };

  const handleEdit = (item) => {
    setEditingConcert(item);
    setFormData({
      title: item.title,
      artist: item.artist || '',
      date: item.date || '',
      venue: item.venue || '',
      city: item.city || '',
      country: item.country || '',
      ticketUrl: item.ticketUrl || '',
      imageUrl: item.imageUrl || '',
      imagePath: item.imagePath || '',
      description: item.description || ''
    });
    setModalVisible(true);
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Confirmation',
      'Supprimer ce concert ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const result = await AdminService.deleteConcert(item.id);
            if (result.success) {
              loadConcerts();
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      date: '',
      venue: '',
      city: '',
      country: '',
      ticketUrl: '',
      imageUrl: '',
      imagePath: '',
      description: ''
    });
    setEditingConcert(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#9D7CE8', '#B794F6', '#EC4899']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gérer les Concerts</Text>
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
          {concerts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="musical-notes-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Aucun concert</Text>
              <Button title="Créer un concert" onPress={() => setModalVisible(true)} />
            </View>
          ) : (
            concerts.map((item) => (
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
                  {item.artist} • {item.date}
                </Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>
                  {item.venue} - {item.city}, {item.country}
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
                {editingConcert ? 'Modifier le concert' : 'Nouveau concert'}
              </Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.label, { color: colors.text }]}>Titre *</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.title} onChangeText={(text) => setFormData({ ...formData, title: text })} placeholder="BTS World Tour" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Artiste</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.artist} onChangeText={(text) => setFormData({ ...formData, artist: text })} placeholder="BTS" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Date *</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.date} onChangeText={(text) => setFormData({ ...formData, date: text })} placeholder="2024-12-25" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Lieu</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.venue} onChangeText={(text) => setFormData({ ...formData, venue: text })} placeholder="Stade de France" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Ville</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.city} onChangeText={(text) => setFormData({ ...formData, city: text })} placeholder="Paris" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Pays</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.country} onChangeText={(text) => setFormData({ ...formData, country: text })} placeholder="France" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>URL Billetterie</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.ticketUrl} onChangeText={(text) => setFormData({ ...formData, ticketUrl: text })} placeholder="https://ticketmaster.fr" placeholderTextColor={colors.textSecondary} />

              <ImagePicker
                onImageSelected={(url, path) => setFormData({ ...formData, imageUrl: url, imagePath: path })}
                currentImage={formData.imageUrl}
                label="Image du concert"
              />

              <Text style={[styles.label, { color: colors.text }]}>Description</Text>
              <TextInput style={[styles.textArea, { backgroundColor: colors.background, color: colors.text }]} value={formData.description} onChangeText={(text) => setFormData({ ...formData, description: text })} placeholder="Description" placeholderTextColor={colors.textSecondary} multiline numberOfLines={4} />

              <Button title={editingConcert ? 'Modifier' : 'Créer'} onPress={handleSubmit} variant="gradient" style={styles.submitButton} />
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
  title: { flex: 1, fontSize: 18, fontWeight: 'bold' },
  actions: { flexDirection: 'row' },
  info: { fontSize: 14, marginTop: SPACING.xs / 2 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.1)' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { padding: SPACING.md },
  label: { fontSize: 14, fontWeight: '600', marginBottom: SPACING.xs, marginTop: SPACING.sm },
  input: { borderRadius: 8, padding: SPACING.sm, fontSize: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)' },
  textArea: { borderRadius: 8, padding: SPACING.sm, fontSize: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', minHeight: 80, textAlignVertical: 'top' },
  submitButton: { marginTop: SPACING.lg, marginBottom: SPACING.xl },
});
