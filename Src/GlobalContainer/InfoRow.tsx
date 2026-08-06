import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';

type InfoRowProps = {
  label: string;
  value: string | number;
  valueColor?: string;
  multiline?: boolean;
};

const InfoRow = ({
  label,
  value,
  valueColor = Colors.text,
  multiline = false,
}: InfoRowProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Text
        style={[
          styles.value,
          {
            color: valueColor,
          },
        ]}
        numberOfLines={multiline ? undefined : 1}>
        {value}
      </Text>
    </View>
  );
};

export default InfoRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    paddingVertical: 14,

    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F6',
  },

  label: {
    width: '38%',
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },

  value: {
    flex: 1,
    textAlign: 'right',

    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
});