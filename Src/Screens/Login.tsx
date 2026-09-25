import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import GlobalTextInput from '../GlobalContainer/GlobalTextInput';
import GlobalButton from '../GlobalContainer/GlobalButton';
import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../Navigation/AppNavigator';
import { login } from '../Services/AuthService';
import {
  setCurrentLoginResponse,
  clearCurrentUser,
} from '../Services/AuthSession';
import {
  saveRememberedCredentials,
  loadRememberedCredentials,
  clearRememberedCredentials,
} from '../Services/CredentialStorage';

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

//test nilanjan//

const DEFAULT_PASSWORD = 'temp123';

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginNavigationProp>();

  /* -----------------------------------------
     Load remembered credentials
  ----------------------------------------- */

  useEffect(() => {
    const loadCredentials = async () => {
      const remembered = await loadRememberedCredentials();

      if (remembered) {
        setEmployeeId(remembered.identifier);
        setPassword(remembered.password);
        setRememberMe(true);
      }
    };

    loadCredentials();
  }, []);

  const toggleRememberMe = async () => {
    const nextValue = !rememberMe;

    setRememberMe(nextValue);

    if (!nextValue) {
      await clearRememberedCredentials();
    }
  };

  const handleRememberCredentials = async () => {
    if (rememberMe) {
      await saveRememberedCredentials(employeeId.trim(), password);
    } else {
      await clearRememberedCredentials();
    }
  };

  const handleLogin = async () => {
    const identifier = employeeId.trim();

    if (!identifier || !password) {
      setErrorMessage('Please enter employee ID and password');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const response = await login(identifier, password);

      await handleRememberCredentials();

      clearCurrentUser();
      setCurrentLoginResponse(response);

      if (password === DEFAULT_PASSWORD) {
        Alert.alert(
          'Security',
          'For security reasons, you must set a new password before you can continue.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('ResetPassword'),
            },
          ],
        );
      } else {
        navigation.replace('Dashboard');
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to login',
      );
    } finally {
      setLoading(false);
    }
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
            keyboardType="number-pad"
            editable={!loading}
          />

          {/* Password */}
          <GlobalTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            isPassword
            icon={require('../Assets/Icons/password.png')}
            editable={!loading}
          />

          {/* Remember Me */}
          <TouchableOpacity
            style={styles.rememberRow}
            activeOpacity={0.7}
            onPress={toggleRememberMe}
          >
            <View style={styles.checkboxContainer}>
              <View
                style={[
                  styles.checkbox,
                  rememberMe && styles.checkboxChecked,
                ]}
              >
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>

              <Text style={styles.rememberText}>Remember Me</Text>
            </View>
          </TouchableOpacity>

          {errorMessage ? (
            <Text style={styles.errorMessage}>
              {errorMessage}
            </Text>
          ) : null}

          {/* Sign In */}
          <GlobalButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          />

          {/* Forgot Password */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ForgotPassword')}
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
     Remember Me
  ------------------------- */

  rememberRow: {
    width: '100%',
    marginBottom: 18,
    marginTop: -8,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  checkboxChecked: {
    backgroundColor: Colors.primary,
  },

  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    lineHeight: 16,
  },

  rememberText: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
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

  errorMessage: {
    width: '100%',
    color: Colors.rejected,
    fontSize: 13,
    fontFamily: FontFamily.medium,
    marginBottom: 14,
    textAlign: 'center',
  },
});
