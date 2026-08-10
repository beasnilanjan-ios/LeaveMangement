import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import { forgotPassword } from '../Services/AuthService';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<ForgotPasswordNavigationProp>();

  const handleReset = async () => {
    const input = identifier.trim();

    if (!input || !newPassword) {
      setErrorMessage('Please enter employee ID/email and new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await forgotPassword(input, newPassword);

      setSuccessMessage(
        response.message || 'Password reset successfully. Please login.',
      );

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to reset password',
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
          <Text style={styles.title}>Forgot Password</Text>

          <Text style={styles.subtitle}>Reset your password to continue</Text>

          {/* Employee ID / Email */}
          <GlobalTextInput
            placeholder="Employee ID or Email"
            value={identifier}
            onChangeText={setIdentifier}
            icon={require('../Assets/Icons/user.png')}
            editable={!loading}
          />

          {/* New Password */}
          <GlobalTextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            isPassword
            icon={require('../Assets/Icons/password.png')}
            editable={!loading}
          />

          {/* Confirm Password */}
          <GlobalTextInput
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            icon={require('../Assets/Icons/password.png')}
            editable={!loading}
          />

          {errorMessage ? (
            <Text style={styles.errorMessage}>
              {errorMessage}
            </Text>
          ) : null}

          {successMessage ? (
            <Text style={styles.successMessage}>
              {successMessage}
            </Text>
          ) : null}

          {/* Reset Button */}
          <GlobalButton
            title="Reset Password"
            onPress={handleReset}
            loading={loading}
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPassword;

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
     Messages
  ------------------------- */

  errorMessage: {
    width: '100%',
    color: Colors.rejected,
    fontSize: 13,
    fontFamily: FontFamily.medium,
    marginBottom: 14,
    textAlign: 'center',
  },

  successMessage: {
    width: '100%',
    color: Colors.success,
    fontSize: 13,
    fontFamily: FontFamily.medium,
    marginBottom: 14,
    textAlign: 'center',
  },
});
