import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const menu = [
  {
    title: 'Dashboard',
    icon: require('../Images/menu_new.png'),
  },
  {
    title: 'Apply Leave',
    icon: require('../Images/menu_new.png'),
  },
  {
    title: 'Leave History',
    icon: require('../Images/menu_new.png'),
  },
  {
    title: 'Approvals',
    icon: require('../Images/menu_new.png'),
  },
  {
    title: 'Holiday',
    icon: require('../Images/menu_new.png'),
  },
  {
    title: 'Profile',
    icon: require('../Images/menu_new.png'),
  },
  {
    title: 'Settings',
    icon: require('../Images/menu_new.png'),
  },
];

const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>

      {/* Dark background */}
      <Pressable
        style={styles.background}
        onPress={onClose}
      />

      {/* Drawer */}
      <View style={styles.drawer}>

        {/* Header */}
        <View style={styles.header}>

          <Image
            source={require('../Images/menu_new.png')}
            style={styles.avatar}
          />

          <Text style={styles.name}>
            Nilanjan Ghosh
          </Text>

          <Text style={styles.email}>
            nilanjan@gmail.com
          </Text>

        </View>

        {/* Menu Items */}
        {menu.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.row}
            activeOpacity={0.7}
          >
            <Image
              source={item.icon}
              style={styles.icon}
            />

            <Text style={styles.title}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}

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
  },

  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  drawer: {
    width: 280,
    height: '100%',

    backgroundColor: '#C62828',

    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,

    paddingTop: 60,
  },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 15,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  email: {
    color: '#FFFFFF',
    marginTop: 5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    paddingHorizontal: 20,
  },

  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
    marginRight: 18,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});