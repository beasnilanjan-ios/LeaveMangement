import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  Image,
} from 'react-native';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';

interface GlobalTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  icon?: React.ReactNode;
}

const GlobalTextInput: React.FC<GlobalTextInputProps> = ({
  label,
  error,
  isPassword = false,
  icon,
  ...textInputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>

      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      {/* Input */}
      <View
        style={[
          styles.inputContainer,
          focused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >

        {/* Left Icon */}
        {icon && (
          <View style={styles.iconContainer}>
             <Image
              source={icon}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
        )}

        <TextInput
          {...textInputProps}
          style={styles.input}
          placeholderTextColor="#78909C"
          secureTextEntry={
            isPassword ? !showPassword : textInputProps.secureTextEntry
          }
          onFocus={(event) => {
            setFocused(true);
            textInputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            textInputProps.onBlur?.(event);
          }}
        />

        {/* Password Eye */}
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error */}
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}

    </View>
  );
};

export default GlobalTextInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 7,
  },

  inputContainer: {
    height: 54,
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: Colors.background,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: Colors.border,

    paddingHorizontal: 14,
  },

  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },

  inputError: {
    borderColor: Colors.rejected,
  },

  iconContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },

  input: {
    flex: 1,
    height: '100%',

    color: Colors.text,

    fontSize: 16,
    paddingVertical: 0,
    fontFamily: FontFamily.regular,
  },

  eyeButton: {
    paddingHorizontal: 5,
    paddingVertical: 8,
    fontFamily: FontFamily.semiBold,
  },

  eyeText: {
    color: Colors.primary,
    fontSize: 13,
    fontFamily: FontFamily.regular,
  },

  errorText: {
    color: Colors.rejected,
    fontSize: 12,
    fontFamily: FontFamily.regular,
    marginTop: 5,
    marginLeft: 3,
  },

  icon: {
    width: 20,
    height: 20,
    tintColor: Colors.primary,
  },
});