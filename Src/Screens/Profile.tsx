import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigator';

import TopBar from '../GlobalContainer/TopBar';
import InfoRow from '../GlobalContainer/InfoRow';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import { getCurrentUser } from '../Services/AuthSession';

type ProfileNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

const Profile = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const user = getCurrentUser();

  if (!user) {
    return (
      <View style={styles.container}>
        <TopBar
          title="Profile"
          backVisible={true}
          onMenuPress={() => navigation.goBack()}
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="Profile"
        backVisible={true}
        onMenuPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* =====================================
            PROFILE HEADER
        ===================================== */}

        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../Assets/Icons/user2.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.name}>{user.name}</Text>

          <Text style={styles.designation}>{user.designation}</Text>

          <View style={styles.employeeBadge}>
            <Text style={styles.employeeBadgeText}>
              Employee ID : {user.employeeId}
            </Text>
          </View>
        </View>

        {/* =====================================
            PROFILE DETAILS
        ===================================== */}

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <InfoRow label="Name" value={user.name} />

          <InfoRow label="Email" value={user.email} multiline />

          <InfoRow label="Designation" value={user.designation} multiline />

          <InfoRow label="Employee ID" value={user.employeeId} />

          <InfoRow label="Role" value={user.role} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 30,
  },

  /* =====================================
     HEADER
  ===================================== */

  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  avatarContainer: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    width: 58,
    height: 58,
    tintColor: Colors.primary,
  },

  name: {
    marginTop: 16,
    fontSize: 21,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
  },

  designation: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  employeeBadge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
  },

  employeeBadgeText: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
  },

  /* =====================================
     DETAILS
  ===================================== */

  detailsCard: {
    marginTop: 18,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
    paddingBottom: 4,
  },

  /* =====================================
     LOADING
  ===================================== */

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
