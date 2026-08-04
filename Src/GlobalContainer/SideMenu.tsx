import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';

import Colors from '../Assets/Colors/Colors';
import {FontFamily} from '../GlobalFont/GlobalFont';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../Navigation/AppNavigator';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  selected?: string;
  onItemPress?: (item: string) => void;
}

const menu = [
  {
    title: 'Home',
    icon: require('../Assets/Icons/home.png'),
  },
  {
    title: 'Apply Leave',
    icon: require('../Assets/Icons/apply.png'),
  },
  {
    title: 'Leave History',
    icon: require('../Assets/Icons/calendar2.png'),
  },
  {
    title: 'Approval',
    icon: require('../Assets/Icons/approval.png'),
  },
  {
    title: 'Holiday',
    icon: require('../Assets/Icons/calendar2.png'),
  },
  {
    title: 'Profile',
    icon: require('../Assets/Icons/user2.png'),
  },
  {
    title: 'Settings',
    icon: require('../Assets/Icons/settings.png'),
  },
  {
    title: 'Logout',
    icon: require('../Assets/Icons/logout.png'),
  },
];

const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
  selected = 'Home',
  onItemPress,
}) => {
type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  if (!visible) {
    return null;
  }

 const handleItemPress = (title: string) => {
  onItemPress?.(title);

  onClose();

  switch (title) {
    case 'Home':
      navigation.replace('Dashboard');
      break;

    case 'Apply Leave':
      navigation.replace('ApplyLeave');
      break;

    case 'Holiday':
      navigation.replace('Holiday');
      break;

    case 'Logout':
      navigation.replace('Login');
      break;  

    default:
      break;
  }
};

  return (
    <View style={styles.overlay}>

      {/* Background */}
      <Pressable
        style={styles.background}
        onPress={onClose}
      />

      {/* Drawer */}
      <View style={styles.drawer}>

        {/* Close */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        {/* Profile */}
        <View style={styles.profileSection}>

          <View style={styles.avatarContainer}>
            <Image
              source={require('../Assets/Icons/user2.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.name}>
            Nilanjan Ghosh
          </Text>

          <Text style={styles.employeeId}>
            Employee ID : EMP001
          </Text>

        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Menu */}
        <View style={styles.menuContainer}>
          {menu.map(item => {
            const isSelected = selected === item.title;

            return (
              <TouchableOpacity
                key={item.title}
                style={[
                  styles.row,
                  isSelected && styles.selectedRow,
                ]}
                activeOpacity={0.7}
                onPress={() => handleItemPress(item.title)}>

                {/* Selected indicator */}
                {isSelected && (
                  <View style={styles.selectedIndicator} />
                )}

                <Image
                  source={item.icon}
                  style={[
                    styles.icon,
                    isSelected && styles.selectedIcon,
                  ]}
                  resizeMode="contain"
                />

                <Text
                  style={[
                    styles.title,
                    isSelected && styles.selectedTitle,
                  ]}>
                  {item.title}
                </Text>

              </TouchableOpacity>
            );
          })}
        </View>

      </View>
    </View>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    flexDirection: 'row',

    zIndex: 1000,

    elevation: 1000,
  },

  background: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },

  drawer: {
    width: 285,
    height: '100%',

    backgroundColor: Colors.white,

    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,

    paddingTop: 45,

    elevation: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 0,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  /* Close Button */

  closeButton: {
    position: 'absolute',

    top: 18,
    right: 18,

    width: 36,
    height: 36,

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 2,
  },

  closeText: {
    fontSize: 32,

    fontFamily: FontFamily.regular,

    color: Colors.text,

    lineHeight: 32,
  },

  /* Profile */

  profileSection: {
    paddingHorizontal: 25,

    paddingTop: 25,

    paddingBottom: 25,
  },

  avatarContainer: {
    width: 70,
    height: 70,

    borderRadius: 35,

    backgroundColor: '#EEF0FF',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 14,
  },

  avatar: {
    width: 45,
    height: 45,

    tintColor: Colors.primary,
  },

  name: {
    fontSize: 20,

    fontFamily: FontFamily.bold,

    color: Colors.text,
  },

  employeeId: {
    marginTop: 5,

    fontSize: 14,

    fontFamily: FontFamily.regular,

    color: Colors.textSecondary,
  },

  divider: {
    height: 1,

    backgroundColor: '#E8E8E8',

    marginHorizontal: 25,

    marginBottom: 18,
  },

  /* Menu */

  menuContainer: {
    paddingTop: 0,
  },

  row: {
    height: 54,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 25,

    position: 'relative',

    marginBottom: 4,
  },

  selectedRow: {
    backgroundColor: '#EEF0FF',

    marginLeft: 10,

    marginRight: 25,

    borderRadius: 0,

    paddingLeft: 15,
  },

  selectedIndicator: {
    position: 'absolute',

    left: 0,
    top: 0,
    bottom: 0,

    width: 4,

    backgroundColor: Colors.primary,

    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },

  icon: {
    width: 23,
    height: 23,

    tintColor: '#222222',

    marginRight: 20,
  },

  selectedIcon: {
    tintColor: Colors.primary,
  },

  title: {
    fontSize: 15,

    fontFamily: FontFamily.medium,

    color: '#222222',
  },

  selectedTitle: {
    color: Colors.primary,

    fontFamily: FontFamily.semiBold,
  },
});