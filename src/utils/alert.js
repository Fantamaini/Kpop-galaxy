import { Platform, Alert } from 'react-native';

/**
 * Wrapper pour Alert qui fonctionne sur web et mobile
 */
export const showAlert = (title, message, buttons = []) => {
  if (Platform.OS === 'web') {
    // Sur web, utiliser window.confirm
    const confirmMessage = message ? `${title}\n\n${message}` : title;
    
    if (buttons.length === 0) {
      // Simple alert
      window.alert(confirmMessage);
    } else {
      // Confirmation avec boutons
      const confirmed = window.confirm(confirmMessage);
      
      if (confirmed) {
        // Trouver le bouton non-cancel
        const confirmButton = buttons.find(b => b.style !== 'cancel');
        if (confirmButton && confirmButton.onPress) {
          confirmButton.onPress();
        }
      } else {
        // Trouver le bouton cancel
        const cancelButton = buttons.find(b => b.style === 'cancel');
        if (cancelButton && cancelButton.onPress) {
          cancelButton.onPress();
        }
      }
    }
  } else {
    // Sur mobile, utiliser Alert natif
    if (buttons.length === 0) {
      Alert.alert(title, message);
    } else {
      Alert.alert(title, message, buttons);
    }
  }
};

export default { showAlert };
