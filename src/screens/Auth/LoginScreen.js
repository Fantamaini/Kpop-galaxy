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

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoadingState] = useState(false);

  const handleLogin = async () => {
    // Validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email requis';
    if (!password) newErrors.password = 'Mot de passe requis';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoadingState(true);
    dispatch(setLoading(true));

    const result = await AuthService.signInWithEmail(email, password);

    if (result.success) {
      dispatch(setUser(result.user));
      navigation.replace('MainTabs');
    } else {
      dispatch(setError(result.error));
      setErrors({ general: 'Email ou mot de passe incorrect' });
    }

    setLoadingState(false);
    dispatch(setLoading(false));
  };

  const handleGoogleLogin = async () => {
    setLoadingState(true);
    const result = await AuthService.signInWithGoogle();

    if (result.success) {
      dispatch(setUser(result.user));
      navigation.replace('MainTabs');
    } else {
      // Show the real error (important for "only on web" message etc.)
      setErrors({ general: result.error || 'Erreur de connexion avec Google' });
    }

    setLoadingState(false);
  };

  const handleAppleLogin = async () => {
    setLoadingState(true);
    const result = await AuthService.signInWithApple();

    if (result.success) {
      dispatch(setUser(result.user));
      navigation.replace('MainTabs');
    } else {
      setErrors({ general: result.error || 'Erreur de connexion avec Apple' });
    }

    setLoadingState(false);
  };

  const handleDemoMode = async () => {
    // Mode démo - uses the new local auth
    const result = await AuthService.signInDemo();
    if (result.success) {
      dispatch(setUser(result.user));
      navigation.replace('MainTabs');
    }
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
        {/* Refined top header */}
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
          {/* Hero Header */}
          <View style={styles.header}>
            <Text style={styles.welcomeTitle}>Content de vous revoir</Text>
            <Text style={styles.subtitle}>
              Connectez-vous pour retrouver vos groupes, concerts et la communauté.
            </Text>
          </View>

          {/* Premium Form Card */}
          <View style={[styles.form, { backgroundColor: colors.card }]}>
            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              icon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
            />

            {/* Forgot Password */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            {errors.general && (
              <View style={[styles.errorBanner, { backgroundColor: 'rgba(244, 63, 94, 0.1)' }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{errors.general}</Text>
              </View>
            )}

            <Button 
              title="Se connecter" 
              onPress={handleLogin}
              variant="gradient"
              size="lg"
              loading={loading}
              style={styles.loginButton}
            />

            {/* Elegant Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OU</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Social logins - premium */}
            {Platform.OS === 'web' ? (
              <Button 
                title="Continuer avec Google" 
                onPress={handleGoogleLogin}
                variant="outline"
                size="md"
              />
            ) : (
              <View style={styles.socialDisabledNote}>
                <Text style={[styles.socialDisabledText, { color: colors.textSecondary }]}>
                  Google disponible sur la version web uniquement
                </Text>
              </View>
            )}

            {(Platform.OS === 'ios' || Platform.OS === 'web') && (
              <Button 
                title="Continuer avec Apple" 
                onPress={handleAppleLogin}
                variant="outline"
                style={styles.appleButton}
                size="md"
              />
            )}

            {Platform.OS === 'web' && (
              <Text style={[styles.webNote, { color: colors.textSecondary }]}>
                Si Google ne répond pas : ajoutez votre URL (localhost:xxxx) dans Firebase Console → Authentication → Authorized domains
              </Text>
            )}

            {/* Subtle Demo Mode (kept for dev, visually toned down) */}
            <TouchableOpacity 
              style={styles.demoLink} 
              onPress={handleDemoMode}
            >
              <Text style={[styles.demoLinkText, { color: colors.textTertiary || colors.textSecondary }]}>
                🎮 Mode démo (explorer sans compte)
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Pas encore de compte ?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.link, { color: colors.primary, fontWeight: '700' }]}>
                  Créer un compte
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
    maxWidth: 520,
  },
  welcomeTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 340,
  },

  form: {
    width: '100%',
    maxWidth: 460,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    ...SHADOWS.xl,
  },

  loginButton: {
    marginTop: SPACING.md,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 300,
  },
  appleButton: {
    marginTop: SPACING.sm,
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

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    letterSpacing: 2,
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: SPACING.md,
  },
  forgotPasswordText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },

  demoLink: {
    marginTop: SPACING.lg,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  demoLinkText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    textAlign: 'center',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: FONTS.sizes.sm,
  },
  link: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
  },

  socialDisabledNote: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  socialDisabledText: {
    fontSize: FONTS.sizes.xs,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  webNote: {
    fontSize: FONTS.sizes.xs,
    textAlign: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
});
