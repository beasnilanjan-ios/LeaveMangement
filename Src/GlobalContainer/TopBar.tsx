import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Colors from '../Assets/Colors/Colors';
import {FontFamily} from '../GlobalFont/GlobalFont';

interface TopBarProps {
  title?: string;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
}

const TopBar = ({
  title = 'Leaves',
  onMenuPress,
  onSearchPress,
}: TopBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* Status Bar */}
      <View
        style={[
          styles.statusBar,
          {
            height: insets.top,
          },
        ]}
      />

      {/* Header */}
      <View style={styles.header}>
        {/* Menu */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          activeOpacity={0.7}>
          <Image
            source={require('../Images/menu_new.png')}
            style={styles.menu}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Right spacer
            Keeps title position consistent */}
        <View style={styles.rightSpacer} />
      </View>
    </>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: Colors.white,
  },

  header: {
    height: 58,
    width: '100%',

    backgroundColor: Colors.white,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 12,

    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  menuButton: {
    width: 44,
    height: 44,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 4,
  },

  menu: {
    width: 22,
    height: 22,

    resizeMode: 'contain',

    tintColor: Colors.text,
  },

  title: {
    flex: 1,

    fontSize: 18,
    fontFamily: FontFamily.semiBold,

    color: Colors.text,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  rightSpacer: {
    width: 44,
    height: 44,
  },
});