import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AdminService from '../../services/adminService';
import { showAlert } from '../../utils/alert';
import { COLORS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';
import ImagePicker from '../../components/ImagePicker';

export default function ManageEventsScreen({ navigation }) {
  const { colors } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Concert',
    imageUrl: '',
    imagePath: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const result = await AdminService.getAllEvents();
    if (result.success) {
      setEvents(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.date) {
      showAlert('Erreur', 'Titre et date requis');
      return;
    }

    const result = editingEvent
      ? await AdminService.updateEvent(editingEvent.id, formData)
      : await AdminService.createEvent(formData);

    if (result.success) {
      showAlert('Succès', editingEvent ? 'Événement modifié' : 'Événement créé');
      setModalVisible(false);
      resetForm();
      loadEvents();
    } else {
      showAlert('Erreur', result.error);
    }
  };

  const handleEdit = (item) => {
    setEditingEvent(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      date: item.date || '',
      time: item.time || '',
      location: item.location || '',
      type: item.type || 'Concert',
      imageUrl: item.imageUrl || '',
      imagePath: item.imagePath || ''
    });
    setModalVisible(true);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm('Supprimer cet événement ?');
    
    if (confirmed) {
      const result = await AdminService.deleteEvent(item.id);
      if (result.success) {
        showAlert('Succès', 'Événement supprimé');
        loadEvents();
      } else {
        showAlert('Erreur', result.error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'Concert',
      imageUrl: '',
      imagePath: ''
    });
    setEditingEvent(null);
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
          <Text style={styles.headerTitle}>Gérer l'Agenda</Text>
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
          {events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Aucun événement</Text>
              <Button title="Créer un événement" onPress={openModal} />
            </View>
          ) : (
            events.map((item) => (
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
                  {item.date} • {item.location} • Participants: {item.attendees || 0}
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
                {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
              </Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.label, { color: colors.text }]}>Titre *</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.title} onChangeText={(text) => setFormData({ ...formData, title: text })} placeholder="Titre de l'événement" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Type</Text>
              <View style={styles.typeButtons}>
                {['Concert', 'Fan Meeting', 'Showcase', 'Festival', 'Autre'].map(type => (
                  <TouchableOpacity key={type} onPress={() => setFormData({ ...formData, type })} style={[styles.typeButton, formData.type === type && { backgroundColor: COLORS.primary }]}>
                    <Text style={[styles.typeText, { color: formData.type === type ? '#fff' : colors.text }]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.text }]}>Date *</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.date} onChangeText={(text) => setFormData({ ...formData, date: text })} placeholder="2024-12-25" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Heure</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.time} onChangeText={(text) => setFormData({ ...formData, time: text })} placeholder="20:00" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Lieu</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} value={formData.location} onChangeText={(text) => setFormData({ ...formData, location: text })} placeholder="Paris, France" placeholderTextColor={colors.textSecondary} />

              <Text style={[styles.label, { color: colors.text }]}>Description</Text>
              <TextInput style={[styles.textArea, { backgroundColor: colors.background, color: colors.text }]} value={formData.description} onChangeText={(text) => setFormData({ ...formData, description: text })} placeholder="Description de l'événement" placeholderTextColor={colors.textSecondary} multiline numberOfLines={4} />

              <ImagePicker
                onImageSelected={(url, path) => setFormData({ ...formData, imageUrl: url, imagePath: path })}
                currentImage={formData.imageUrl}
                label="Image de l'événement"
              />

              <Button title={editingEvent ? 'Modifier' : 'Créer'} onPress={handleSubmit} variant="gradient" style={styles.submitButton} />
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
  textArea: { borderRadius: 8, padding: SPACING.sm, fontSize: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', minHeight: 80, textAlignVertical: 'top' },
  typeButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  typeButton: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)' },
  typeText: { fontSize: 12, fontWeight: '600' },
  submitButton: { marginTop: SPACING.lg, marginBottom: SPACING.xl },
});
