import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    // Premium entrance animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 580,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 580,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 1750);

    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: fadeAnim }
      ]}
    >
      <LinearGradient
        colors={[COLORS.gradient.start, COLORS.gradient.middle, COLORS.gradient.end]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.gradient, { backgroundColor: COLORS.gradient.start }]}
      >
        <Animated.Image
          source={require('../../assets/images/logo.png')}
          style={[
            styles.logo,
            { transform: [{ scale: scaleAnim }], opacity: fadeAnim }
          ]}
          resizeMode="contain"
        />

        <View style={styles.branding}>
          <Text style={styles.title}>K-POP GALAXY</Text>
          <Text style={styles.tagline}>Ton univers K-pop. Tout. Maintenant.</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: Math.min(width * 0.58, 240),
    height: 128,
    maxWidth: 260,
    marginBottom: 26,
  },
  branding: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  tagline: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.82)',
    letterSpacing: 1.4,
    fontWeight: '500',
  },
});