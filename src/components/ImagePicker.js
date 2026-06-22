import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import StorageService from '../services/storageService';
import { COLORS, SPACING } from '../constants/theme';

export default function ImagePicker({ onImageSelected, currentImage, label = "Image" }) {
  const { colors } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(currentImage);

  const handleSelectImage = async () => {
    if (Platform.OS === 'web') {
      // Web: Créer un input file invisible
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Afficher l'aperçu local
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);

        // Upload vers Firebase Storage
        setUploading(true);
        const result = await StorageService.uploadImage(file, 'kpop-images');
        setUploading(false);

        if (result.success) {
          onImageSelected(result.url, result.path);
        } else {
          Alert.alert('Erreur', 'Erreur lors de l\'upload: ' + result.error);
          setImagePreview(null);
        }
      };

      input.click();
    } else {
      // Mobile: Demander la permission et utiliser expo-image-picker
      const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder aux photos');
        return;
      }

      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setImagePreview(asset.uri);

        // Upload vers Firebase Storage
        setUploading(true);
        
        // Convertir l'URI en blob pour l'upload
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        
        const uploadResult = await StorageService.uploadImage(blob, 'kpop-images');
        setUploading(false);

        if (uploadResult.success) {
          onImageSelected(uploadResult.url, uploadResult.path);
        } else {
          Alert.alert('Erreur', 'Erreur lors de l\'upload: ' + uploadResult.error);
          setImagePreview(null);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      
      {imagePreview ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imagePreview }} style={styles.image} />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={handleSelectImage}
            disabled={uploading}
          >
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={handleSelectImage}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={32} color={colors.textSecondary} />
              <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
                {Platform.OS === 'web' ? 'Cliquer pour choisir une image' : 'Toucher pour choisir une image'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  uploadButton: {
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: SPACING.sm,
    fontSize: 14,
  },
});
