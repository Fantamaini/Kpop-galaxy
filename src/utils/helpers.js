// Validation des emails
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation des mots de passe
export const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins 6 caractères' };
  }
  return { valid: true };
};

// Validation du nom d'utilisateur
export const validateUsername = (username) => {
  if (username.length < 3) {
    return { valid: false, message: 'Le nom doit contenir au moins 3 caractères' };
  }
  if (username.length > 20) {
    return { valid: false, message: 'Le nom ne doit pas dépasser 20 caractères' };
  }
  return { valid: true };
};

// Formater les nombres (vues, likes)
export const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Tronquer le texte
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Générer un ID unique
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
