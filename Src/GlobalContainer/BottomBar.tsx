import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomBarProps {
  selected?: number;
  onHomePress?: () => void;
  onLeavePress?: () => void;
  onCalendarPress?: () => void;
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
}

const BottomBar = ({
  selected = 0,
  onHomePress,
  onLeavePress,
  onCalendarPress,
  onProfilePress,
  onSettingsPress,
}: BottomBarProps) => {

  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
        },
      ]}
    >

      <TouchableOpacity
        style={styles.item}
        onPress={onHomePress}
      >
        <Image
          source={require('../Images/menu_new.png')}
          style={[
            styles.icon,
            selected === 0 && styles.selected,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={onLeavePress}
      >
        <Image
          source={require('../Images/menu_new.png')}
          style={[
            styles.icon,
            selected === 1 && styles.selected,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={onCalendarPress}
      >
        <Image
          source={require('../Images/menu_new.png')}
          style={[
            styles.icon,
            selected === 2 && styles.selected,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={onProfilePress}
      >
        <Image
          source={require('../Images/menu_new.png')}
          style={[
            styles.icon,
            selected === 3 && styles.selected,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={onSettingsPress}
      >
        <Image
          source={require('../Images/menu_new.png')}
          style={[
            styles.icon,
            selected === 4 && styles.selected,
          ]}
        />
      </TouchableOpacity>

    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({

  container: {

    flexDirection: 'row',

    justifyContent: 'space-around',

    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    height: 65,

    borderTopWidth: 1,

    borderTopColor: '#E5E5E5',
  },

  item: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  icon: {

    width: 24,

    height: 24,

    tintColor: '#999',

    resizeMode: 'contain',
  },

  selected: {

    tintColor: '#C62828',
  },

});