import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';

interface GlobalButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const GlobalButton: React.FC<GlobalButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        (disabled || loading) && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={Colors.white}
        />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default GlobalButton;

const styles = StyleSheet.create({
  button: {
    height: 55,
    width: '100%',
    borderRadius: 14,

    backgroundColor: Colors.primary,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: Colors.white,
    fontSize: 17,
    fontFamily:FontFamily.semiBold,
  },
});