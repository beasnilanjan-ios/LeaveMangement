import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import Colors from '../Assets/Colors/Colors';
import {FontFamily} from '../GlobalFont/GlobalFont';

import type {RootStackParamList} from '../Navigation/AppNavigator';

interface BottomBarProps {
  selected?: number;
}

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const BottomBar = ({selected = 0}: BottomBarProps) => {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationProp>();

  const handleNavigation = (screen: keyof RootStackParamList) => {
    navigation.replace(screen as never);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: insets.bottom,
        },
      ]}>
      
      <View style={styles.container}>

        {/* HOME */}
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.7}
          onPress={() => handleNavigation('Dashboard')}>

          <View
            style={[
              styles.iconContainer,
              selected === 0 && styles.selectedIconContainer,
            ]}>
            <Image
              source={require('../Assets/Icons/home.png')}
              style={[
                styles.icon,
                selected === 0 && styles.selectedIcon,
              ]}
            />
          </View>

          <Text
            style={[
              styles.label,
              selected === 0 && styles.selectedLabel,
            ]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* APPLY */}
        <TouchableOpacity
          style={styles.applyItem}
          activeOpacity={0.8}
          onPress={() => handleNavigation('ApplyLeave')}>

          <View style={styles.applyButton}>
            <Text style={styles.plus}>+</Text>
          </View>

          <Text
            style={[
              styles.label,
              selected === 1 && styles.selectedLabel,
            ]}>
            Apply
          </Text>
        </TouchableOpacity>

        {/* HOLIDAY */}
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.7}
          onPress={() => handleNavigation('Holiday')}>

          <View
            style={[
              styles.iconContainer,
              selected === 2 && styles.selectedIconContainer,
            ]}>
            <Image
              source={require('../Assets/Icons/calendar.png')}
              style={[
                styles.icon,
                selected === 2 && styles.selectedIcon,
              ]}
            />
          </View>

          <Text
            style={[
              styles.label,
              selected === 2 && styles.selectedLabel,
            ]}>
            Holiday
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
  },

  container: {
    height: 72,

    backgroundColor: Colors.white,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',

    paddingHorizontal: 25,
  },

  item: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    height: 72,
  },

  applyItem: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    height: 85,

    marginTop: -20,
  },

  iconContainer: {
    width: 42,
    height: 34,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 12,
  },

  selectedIconContainer: {
    backgroundColor: '#EEF0FF',
  },

  icon: {
    width: 23,
    height: 23,

    tintColor: '#555555',
  },

  selectedIcon: {
    tintColor: Colors.primary,
  },

  applyButton: {
    width: 54,
    height: 54,

    borderRadius: 27,

    backgroundColor: Colors.primary,

    alignItems: 'center',
    justifyContent: 'center',

    elevation: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  plus: {
    color: Colors.white,

    fontSize: 34,
    fontFamily: FontFamily.regular,

    lineHeight: 38,

    marginTop: -2,
  },

  label: {
    marginTop: 3,

    fontSize: 12,

    fontFamily: FontFamily.medium,

    color: '#555555',

    textAlign: 'center',
  },

  selectedLabel: {
    color: Colors.primary,

    fontFamily: FontFamily.semiBold,
  },
});