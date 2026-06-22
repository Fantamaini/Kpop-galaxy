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
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AuthService from '../../services/authService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { showAlert } from '../../utils/alert';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { getContainerStyle } from '../../utils/responsive';

export default function ForgotPasswordScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    // Validation
    if (!email) {
      setError('Email requis');
      return;
    }

    // Validation email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format d\'email invalide');
      return;
    }

    setLoading(true);
    setError('');

    const result = await AuthService.resetPassword(email);

    if (result.success) {
      setSuccess(true);
      showAlert(
        'Email envoyé',
        'Un lien de réinitialisation a été envoyé à votre adresse email. Vérifiez aussi vos spams.'
      );
    } else {
      console.error('Reset password error:', result.error);
      setError(result.error || 'Erreur lors de l\'envoi de l\'email. Vérifiez que l\'email existe dans notre système.');
    }

    setLoading(false);
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
        {/* Top bar with back */}
        <View style={[styles.topHeader, containerStyle]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
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
        >
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={42} color="#FFFFFF" />
            </View>
            <Text style={styles.welcomeTitle}>Mot de passe oublié ?</Text>
            <Text style={styles.subtitle}>
              Pas de souci. Entre ton email et on t'envoie un lien pour le réinitialiser.
            </Text>
          </View>

          {/* Form */}
          <View style={[styles.form, { backgroundColor: colors.card }]}>
            {!success ? (
              <>
                <Input
                  label="Email"
                  placeholder="votre@email.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  icon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={error}
                />

                <Button 
                  title="Envoyer le lien de réinitialisation" 
                  onPress={handleResetPassword}
                  variant="gradient"
                  loading={loading}
                  style={styles.resetButton}
                />
              </>
            ) : (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={56} color={COLORS.success} />
                <Text style={[styles.successTitle, { color: colors.text }]}>
                  Email envoyé !
                </Text>
                <Text style={[styles.successText, { color: colors.textSecondary }]}>
                  Vérifie ta boîte de réception (et les spams). Le lien est valable quelques heures.
                </Text>
                <Button 
                  title="Retour à la connexion" 
                  onPress={() => navigation.navigate('Login')}
                  variant="primary"
                  style={styles.backToLoginButton}
                />
              </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Tu te souviens de ton mot de passe ?{' '}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.xl * 1.4,
    paddingBottom: SPACING.md,
  },
  backButton: {
    marginRight: SPACING.md,
    padding: SPACING.xs,
  },
  topLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  topLogo: {
    width: 36,
    height: 36,
  },
  topTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },

  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  welcomeTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },

  form: {
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    ...SHADOWS.xl,
  },

  resetButton: {
    marginTop: SPACING.sm,
  },

  successContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  successTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  successText: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  backToLoginButton: {
    width: '100%',
    marginTop: SPACING.sm,
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
