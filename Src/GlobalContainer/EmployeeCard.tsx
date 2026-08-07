import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Colors from '../Assets/Colors/Colors';
import {FontFamily} from '../GlobalFont/GlobalFont';

type Props = {
  item: {
    id: string;
    name: string;
    designation: string;
  };

  onPress: () => void;
};

const EmployeeCard = ({
  item,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0)}
        </Text>
      </View>

      <View style={{flex: 1}}>
        <Text style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.designation}>
          {item.designation}
        </Text>

        <Text style={styles.id}>
          {item.id}
        </Text>
      </View>

    </TouchableOpacity>
  );
};

export default EmployeeCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: Colors.white,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: Colors.border,

    padding: 15,

    marginBottom: 12,
  },

  avatar: {
    width: 52,
    height: 52,

    borderRadius: 26,

    backgroundColor: Colors.primaryLight,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 14,
  },

  avatarText: {
    fontSize: 20,
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },

  name: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: FontFamily.semiBold,
  },

  designation: {
    marginTop: 3,
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },

  id: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.primary,
    fontFamily: FontFamily.medium,
  },
});