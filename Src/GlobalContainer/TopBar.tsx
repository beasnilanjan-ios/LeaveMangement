import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopBarProps {
  onMenuPress?: () => void;
}

const TopBar = ({ onMenuPress }: TopBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        style={{
          height: insets.top,
          backgroundColor: '#FFFFFF',
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={onMenuPress}>
          <Image
            source={require('../Images/menu_new.png')}
            style={styles.menu}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  header: {
    height: 30,
    backgroundColor: '#C62828',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 15,
  },

  menu: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});