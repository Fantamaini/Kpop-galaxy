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
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';
import ImagePicker from '../../components/ImagePicker';

export default function ManageGroupsScreen({ navigation }) {
  const { colors } = useTheme();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    debutYear: '',
    members: '',
    agency: '',
    imageUrl: '',
    imagePath: '',
    description: ''
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    const result = await AdminService.getAllGroups();
    if (result.success) {
      setGroups(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.debutYear) {
      showAlert('Erreur', 'Nom et année de début requis');
      return;
    }

    const groupData = {
      ...formData,
      debutYear: parseInt(formData.debutYear),
      memberCount: formData.members ? formData.members.split(',').length : 0
    };

    const result = editingGroup
      ? await AdminService.updateGroup(editingGroup.id, groupData)
      : await AdminService.createGroup(groupData);

    if (result.success) {
      showAlert('Succès', editingGroup ? 'Groupe modifié' : 'Groupe créé');
      setModalVisible(false);
      resetForm();
      loadGroups();
    } else {
      showAlert('Erreur', result.error);
    }
  };

  const handleEdit = (item) => {
    setEditingGroup(item);
    setFormData({
      name: item.name,
      debutYear: item.debutYear?.toString() || '',
      members: item.members || '',
      agency: item.agency || '',
      imageUrl: item.imageUrl || '',
      imagePath: item.imagePath || '',
      description: item.description || ''
    });
    setModalVisible(true);
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Confirmation',
      'Supprimer ce groupe ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const result = await AdminService.deleteGroup(item.id);
            if (result.success) {
              loadGroups();
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      debutYear: '',
      members: '',
      agency: '',
      imageUrl: '',
      imagePath: '',
      description: ''
    });
    setEditingGroup(null);
  };

  const openModal = () => {
    resetForm();
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['#9D7CE8', '#B794F6', '#EC4899']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gérer les Groupes</Text>
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
          {groups.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aucun groupe
              </Text>
              <Button title="Créer un groupe" onPress={openModal} />
            </View>
          ) : (
            groups.map((item) => (
              <View key={item.id} style={[styles.groupCard, { backgroundColor: colors.card }]}>
                <View style={styles.groupHeader}>
                  <Text style={[styles.groupName, { color: colors.text }]}>
                    {item.name}
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
                <Text style={[styles.groupInfo, { color: colors.textSecondary }]}>
                  Début: {item.debutYear} • {item.agency || 'Agence inconnue'}
                </Text>
                {item.description && (
                  <Text style={[styles.groupDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

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
                {editingGroup ? 'Modifier le groupe' : 'Nouveau groupe'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.label, { color: colors.text }]}>Nom *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Nom du groupe"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.label, { color: colors.text }]}>Année de début *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={formData.debutYear}
                onChangeText={(text) => setFormData({ ...formData, debutYear: text })}
                placeholder="2020"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />

              <Text style={[styles.label, { color: colors.text }]}>Agence</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={formData.agency}
                onChangeText={(text) => setFormData({ ...formData, agency: text })}
                placeholder="SM Entertainment, YG, etc."
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.label, { color: colors.text }]}>Membres (séparés par des virgules)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={formData.members}
                onChangeText={(text) => setFormData({ ...formData, members: text })}
                placeholder="Jisoo, Jennie, Rosé, Lisa"
                placeholderTextColor={colors.textSecondary}
              />

              <ImagePicker
                onImageSelected={(url, path) => setFormData({ ...formData, imageUrl: url, imagePath: path })}
                currentImage={formData.imageUrl}
                label="Image du groupe"
              />

              <Text style={[styles.label, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.background, color: colors.text }]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Description du groupe"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />

              <Button 
                title={editingGroup ? 'Modifier' : 'Créer'} 
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
  container: { flex: 1 },
  header: { paddingTop: SPACING.xl * 2, paddingBottom: SPACING.lg, paddingHorizontal: SPACING.md },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.md },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 18, marginTop: SPACING.md, marginBottom: SPACING.lg },
  groupCard: { padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xs },
  groupName: { flex: 1, fontSize: 18, fontWeight: 'bold' },
  actions: { flexDirection: 'row' },
  groupInfo: { fontSize: 14, marginBottom: SPACING.xs },
  groupDescription: { fontSize: 14, marginTop: SPACING.xs },
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
