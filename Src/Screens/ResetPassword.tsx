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
  Alert,
} from 'react-native';

import GlobalTextInput from '../GlobalContainer/GlobalTextInput';
import GlobalButton from '../GlobalContainer/GlobalButton';
import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../Navigation/AppNavigator';
import { resetPassword } from '../Services/AuthService';

type ResetPasswordNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ResetPassword'
>;

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<ResetPasswordNavigationProp>();

  const handleReset = async () => {
    if (!currentPassword || !newPassword) {
      setErrorMessage('Please enter current and new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const response = await resetPassword(currentPassword, newPassword);

      Alert.alert(
        'Success',
        response.message || 'Password changed successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Dashboard'),
          },
        ],
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to change password',
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
          <Text style={styles.title}>Reset Password</Text>

          <Text style={styles.subtitle}>
            Set a new password for your account
          </Text>

          {/* Current Password */}
          <GlobalTextInput
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            isPassword
            icon={require('../Assets/Icons/password.png')}
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

          {/* Reset Button */}
          <GlobalButton
            title="Change Password"
            onPress={handleReset}
            loading={loading}
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ResetPassword;

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
});
