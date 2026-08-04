import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import GlobalTextInput from '../GlobalContainer/GlobalTextInput';
import GlobalButton from '../GlobalContainer/GlobalButton';
import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../Navigation/AppNavigator';

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginNavigationProp>();

  const handleLogin = () => {
    console.log('Login:', employeeId, password);
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />

      {/* Decorative background shapes */}
      <View style={styles.blueCircleTop} />
      <View style={styles.redCircleTop} />
      <View style={styles.blueCircleBottom} />
      <View style={styles.redCircleBottom} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../Assets/Images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Heading */}
          <Text style={styles.title}>Employee Login</Text>

          <Text style={styles.subtitle}>Sign in to continue</Text>

          {/* Email */}
          <GlobalTextInput
            placeholder="Employee ID"
            value={employeeId}
            onChangeText={setEmployeeId}
            icon={require('../Assets/Icons/user.png')}
          />

          {/* Password */}
          <GlobalTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            isPassword
            icon={require('../Assets/Icons/password.png')}
          />

          {/* Sign In */}
          <GlobalButton title="Sign In" onPress={handleLogin} />

          {/* Forgot Password */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => console.log('Forgot Password')}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 70,
    paddingBottom: 45,
  },

  /* -------------------------
     Decorative circles
  ------------------------- */

  blueCircleTop: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    top: -35,
    left: -35,
  },

  redCircleTop: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: Colors.accentLight,
    top: 90,
    left: 15,
  },

  blueCircleBottom: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    bottom: -35,
    right: -25,
  },

  redCircleBottom: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 25,
    backgroundColor: Colors.accentLight,
    bottom: 60,
    right: 60,
  },

  /* -------------------------
     Logo
  ------------------------- */

  logoContainer: {
    width: 145,
    height: 145,
    borderRadius: 25,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,

    marginBottom: 28,
  },

  logo: {
    width: 115,
    height: 115,
  },

  /* -------------------------
     Heading
  ------------------------- */

  title: {
    fontSize: 27,
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
    marginTop: 5,
  },

  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
    marginTop: 9,
    marginBottom: 42,
  },

  /* -------------------------
     Input
  ------------------------- */

  inputContainer: {
    width: '100%',
    height: 54,
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 15,
    marginBottom: 20,

    borderWidth: 1,
    borderColor: Colors.border,
  },

  inputIcon: {
    width: 32,
    fontSize: 19,
    color: Colors.primary,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.text,
  },

  eyeButton: {
    padding: 7,
  },

  eyeText: {
    fontSize: 18,
    color: Colors.primary,
  },

  /* -------------------------
     Button
  ------------------------- */

  signInButton: {
    width: '65%',
    height: 55,

    backgroundColor: Colors.primary,

    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 18,

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 5,
  },

  signInText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: FontFamily.semiBold,
  },

  /* -------------------------
     Forgot Password
  ------------------------- */

  forgotPassword: {
    color: Colors.primary,
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    marginTop: 30,
  },
});
