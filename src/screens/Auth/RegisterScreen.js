import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { setUser, setLoading, setError } from '../../store/slices/authSlice';
import AuthService from '../../services/authService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { getContainerStyle } from '../../utils/responsive';

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoadingState] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.displayName) newErrors.displayName = 'Nom requis';
    if (!formData.email) newErrors.email = 'Email requis';
    if (!formData.password) newErrors.password = 'Mot de passe requis';
    if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    return newErrors;
  };

  const handleRegister = async () => {
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoadingState(true);
    dispatch(setLoading(true));

    const result = await AuthService.signUpWithEmail(
      formData.email, 
      formData.password,
      formData.displayName
    );

    if (result.success) {
      dispatch(setUser(result.user));
      navigation.replace('MainTabs');
    } else {
      dispatch(setError(result.error));
      setErrors({ general: 'Erreur lors de l\'inscription' });
    }

    setLoadingState(false);
    dispatch(setLoading(false));
  };

  const containerStyle = getContainerStyle();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Top header */}
        <View style={[styles.topHeader, containerStyle]}>
          <View style={styles.topLogoRow}>
            <Image 
              source={require('../../../assets/images/logo.png')}
              style={styles.topLogo}
              resizeMode="contain"
            />
            <Text style={styles.topTitle}>K-POP GALAXY</Text>
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={[styles.scrollContent, containerStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.welcomeTitle}>Rejoins la galaxie</Text>
            <Text style={styles.subtitle}>
              Crée ton compte et accède à tout le contenu K-pop que tu aimes.
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.form, { backgroundColor: colors.card }]}>
            <Input
              label="Nom d'utilisateur"
              placeholder="Ton nom d'artiste préféré"
              value={formData.displayName}
              onChangeText={(value) => updateField('displayName', value)}
              icon="person-outline"
              error={errors.displayName}
            />

            <Input
              label="Email"
              placeholder="votre@email.com"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              icon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              icon="lock-closed-outline"
              secureTextEntry
              error={errors.confirmPassword}
            />

            {errors.general && (
              <View style={[styles.errorBanner, { backgroundColor: 'rgba(244, 63, 94, 0.1)' }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{errors.general}</Text>
              </View>
            )}

            <Button 
              title="Créer mon compte" 
              onPress={handleRegister}
              variant="gradient"
              size="lg"
              loading={loading}
              style={styles.registerButton}
            />

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Déjà un compte ?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.link, { color: colors.primary, fontWeight: '700' }]}>
                  Se connecter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  topHeader: {
    paddingTop: SPACING.xl * 1.6,
    paddingBottom: SPACING.md,
  },
  topLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  topLogo: {
    width: 42,
    height: 42,
  },
  topTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    maxWidth: 480,
  },
  welcomeTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },

  form: {
    width: '100%',
    maxWidth: 460,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    ...SHADOWS.xl,
  },

  registerButton: {
    marginTop: SPACING.md,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 300,
  },

  errorBanner: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
    fontWeight: '600',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    fontSize: FONTS.sizes.sm,
  },
  link: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
  },
});
