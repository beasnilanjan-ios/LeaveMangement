import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../Navigation/AppNavigator';
import { FontFamily } from '../GlobalFont/GlobalFont';
import Colors from '../Assets/Colors/Colors';
import {
  getCurrentLoginResponse,
  initAuthSession,
} from '../Services/AuthSession';

type SplashNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

const Splash = () => {
  const navigation = useNavigation<SplashNavigationProp>();

  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;
  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;
  const dot3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(logoScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // Text animation
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),

        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Dots loader animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot1Opacity, {
          toValue: 0.4,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 0.4,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 0.4,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const timer = setTimeout(() => {
      (async () => {
        await initAuthSession();

        const user = getCurrentLoginResponse()?.user;

        if (
          user == null ||
          user.employeeId == null ||
          user.employeeId === undefined
        ) {
          navigation.replace('Login');
        } else {
          navigation.replace('Dashboard');
        }
      })();
    }, 3200);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Top Accent Bar */}
      <View style={styles.topAccent} />

      {/* Content Section */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.Image
          source={require('../Images/beas_logo.png')}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
          resizeMode="contain"
        />

        {/* Text Section */}
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.title}>Leave Management</Text>
          <Text style={styles.titleSecond}>System</Text>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>
            Streamline and manage employee leaves efficiently
          </Text>
        </Animated.View>
      </View>

      {/* Loading Indicator */}
      <Animated.View style={[styles.loaderContainer, { opacity: dotOpacity }]}>
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot1Opacity,
              backgroundColor: Colors.primary,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot2Opacity,
              backgroundColor: Colors.primary,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot3Opacity,
              backgroundColor: Colors.primary,
            },
          ]}
        />
      </Animated.View>

      {/* Bottom Accent Bar */}
      <View style={styles.bottomAccent} />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topAccent: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.primary,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logo: {
    width: 140,
    height: 140,
    marginBottom: 48,
  },

  textContainer: {
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
  },

  titleSecond: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 4,
  },

  divider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.primary,
    marginVertical: 18,
    borderRadius: 1,
  },

  subtitle: {
    marginTop: 0,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },

  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.4,
  },

  bottomAccent: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.primary,
  },
});
