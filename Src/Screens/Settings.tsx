import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import TopBar from '../GlobalContainer/TopBar';
import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import type { RootStackParamList } from '../Navigation/AppNavigator';

type SettingsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

const Settings = () => {
  const navigation = useNavigation<SettingsNavigationProp>();

  return (
    <View style={styles.container}>
      <TopBar
        title="Settings"
        backVisible={true}
        onMenuPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Account</Text>

        <TouchableOpacity
          style={styles.optionCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={styles.optionTitle}>Change Password</Text>
          <Text style={styles.optionDescription}>
            Change your current user password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  sectionLabel: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  optionCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  optionTitle: {
    fontSize: 17,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },

  optionDescription: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },
});
