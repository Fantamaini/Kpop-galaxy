import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput,
  ActivityIndicator, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AdminService from '../../services/adminService';
import { showAlert } from '../../utils/alert';
import { COLORS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';

export default function ManageUsersScreen({ navigation }) {
  const { colors } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const result = await AdminService.getAllUsers();
    if (result.success) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.displayName) {
      showAlert('Erreur', 'Email et nom requis');
      return;
    }

    if (editingUser) {
      // Modifier utilisateur existant
      const result = await AdminService.updateUser(editingUser.id, {
        displayName: formData.displayName,
        role: formData.role
      });

      if (result.success) {
        showAlert('Succès', 'Utilisateur modifié');
        setModalVisible(false);
        resetForm();
        loadUsers();
      } else {
        showAlert('Erreur', result.error);
      }
    } else {
      // Créer une fiche utilisateur (Firestore)
      const result = await AdminService.createUserRecord({
        email: formData.email,
        displayName: formData.displayName,
        role: formData.role
      });

      if (result.success) {
        showAlert('Succès', 'Utilisateur ajouté');
        setModalVisible(false);
        resetForm();
        loadUsers();
      } else {
        showAlert('Erreur', result.error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingUser(item);
    setFormData({
      email: item.email,
      displayName: item.displayName || '',
      password: '',
      role: item.role || 'user'
    });
    setModalVisible(true);
  };

  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmed = window.confirm(`Changer le rôle en ${newRole === 'admin' ? 'Admin' : 'User'} ?`);
    
    if (confirmed) {
      const result = await AdminService.updateUserRole(userId, newRole);
      if (result.success) {
        showAlert('Succès', 'Rôle modifié');
        loadUsers();
      } else {
        showAlert('Erreur', result.error);
      }
    }
  };

  const handleDeleteUser = async (userId, email) => {
    const confirmed = window.confirm(`Supprimer l'utilisateur ${email} ?`);
    
    if (confirmed) {
      const result = await AdminService.deleteUser(userId);
      if (result.success) {
        showAlert('Succès', 'Utilisateur supprimé');
        loadUsers();
      } else {
        showAlert('Erreur', result.error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      displayName: '',
      password: '',
      role: 'user'
    });
    setEditingUser(null);
  };

  const openModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const renderUser = ({ item }) => (
    <View style={[styles.userCard, { backgroundColor: colors.card }]}>
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {item.displayName || 'Utilisateur'}
          </Text>
          <View style={[
            styles.roleBadge,
            { backgroundColor: item.role === 'admin' ? '#EF4444' : '#3B82F6' }
          ]}>
            <Text style={styles.roleText}>
              {item.role === 'admin' ? 'ADMIN' : 'USER'}
            </Text>
          </View>
        </View>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
          {item.email}
        </Text>
        <View style={styles.userStats}>
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            Quiz: {item.stats?.quizzesTaken || 0}
          </Text>
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            Badges: {item.badges?.length || 0}
          </Text>
        </View>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleChangeRole(item.id, item.role)}
        >
          <Ionicons name="swap-horizontal" size={24} color="#F59E0B" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteUser(item.id, item.email)}
        >
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#9D7CE8', '#B794F6', '#EC4899']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gérer les Utilisateurs</Text>
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
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="person-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aucun utilisateur
              </Text>
              <Button title="Créer un utilisateur" onPress={openModal} />
            </View>
          }
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingUser ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
              </Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
              <Text style={[styles.label, { color: colors.text }]}>Email *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="email@example.com"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={[styles.label, { color: colors.text }]}>Nom *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={formData.displayName}
                onChangeText={(text) => setFormData({ ...formData, displayName: text })}
                placeholder="Nom affiché"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.label, { color: colors.text }]}>Mot de passe (optionnel)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                placeholder="********"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
              />

              <Text style={[styles.label, { color: colors.text }]}>Rôle</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    { backgroundColor: formData.role === 'user' ? colors.primary : colors.background }
                  ]}
                  onPress={() => setFormData({ ...formData, role: 'user' })}
                >
                  <Text
                    style={[styles.roleText, { color: formData.role === 'user' ? '#fff' : colors.text }]}
                  >
                    User
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    { backgroundColor: formData.role === 'admin' ? '#EF4444' : colors.background }
                  ]}
                  onPress={() => setFormData({ ...formData, role: 'admin' })}
                >
                  <Text
                    style={[styles.roleText, { color: formData.role === 'admin' ? '#fff' : colors.text }]}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                title={editingUser ? 'Modifier' : 'Créer'}
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
  listContent: { padding: SPACING.md },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 18, marginTop: SPACING.md },
  userCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: { flex: 1 },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  userName: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  userEmail: { fontSize: 14, marginBottom: SPACING.xs },
  userStats: { flexDirection: 'row', gap: SPACING.md },
  statText: { fontSize: 12 },
  userActions: { justifyContent: 'center', gap: SPACING.sm },
  actionButton: { padding: SPACING.xs },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.1)' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { padding: SPACING.md },
  label: { fontSize: 14, fontWeight: '600', marginBottom: SPACING.xs, marginTop: SPACING.sm },
  input: { borderRadius: 8, padding: SPACING.sm, fontSize: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)' },
  roleButtons: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  roleButton: { flex: 1, padding: SPACING.sm, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', alignItems: 'center' },
  roleText: { fontSize: 14, fontWeight: '600' },
  submitButton: { marginTop: SPACING.lg, marginBottom: SPACING.xl },
});
