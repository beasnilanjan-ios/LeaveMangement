import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Colors from '../Assets/Colors/Colors';
import {FontFamily} from '../GlobalFont/GlobalFont';

type ApprovalItemProps = {
  approved?: boolean;
  pending?: boolean;
  rejected?: boolean;
  name: string;
  designation: string;
  date?: string;
};

const ApprovalItem: React.FC<ApprovalItemProps> = ({
  approved,
  rejected,
  name,
  designation,
  date,
}) => {
  let icon = '⏳';
  let color = Colors.pending;
  let status = 'Waiting for approval';

  if (approved) {
    icon = '✓';
    color = Colors.success;
    status = `Approved${date ? ` • ${date}` : ''}`;
  }

  if (rejected) {
    icon = '✕';
    color = Colors.rejected;
    status = `Rejected${date ? ` • ${date}` : ''}`;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: color,
          },
        ]}>
        <Text style={styles.icon}>
          {icon}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>
          {name}
        </Text>

        <Text style={styles.designation}>
          {designation}
        </Text>

        <Text
          style={[
            styles.status,
            {
              color,
            },
          ]}>
          {status}
        </Text>
      </View>
    </View>
  );
};

export default ApprovalItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'flex-start',
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  icon: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: FontFamily.bold,
  },

  content: {
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },

  designation: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },

  status: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: FontFamily.medium,
  },
});