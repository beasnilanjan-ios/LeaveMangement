import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';

type Props = {
  item: any;
  onPress: (item: any) => void;
};

const LeaveRequestCard = ({ item, onPress }: Props) => {
  const approved = item.status === 'Approve';
  const rejected = item.status === 'Rejected';

  const badgeBackground = approved
    ? Colors.successLight
    : rejected
    ? Colors.rejectedLight
    : Colors.pendingLight;

  const badgeTextColor = approved
    ? Colors.success
    : rejected
    ? Colors.rejected
    : Colors.pending;

  const formatDate = (value?: string) => {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => onPress(item)}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.employeeName}>{item.employeeName}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: badgeBackground }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.date}>
        {formatDate(item.fromDate)}
        {item.fromDate !== item.toDate && ` - ${formatDate(item.toDate)}`}
      </Text>

      {item.is_restricted === 1 && (
        <Text style={styles.leaveType}>{item.leaveType}</Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.application}>{item.applicationType}</Text>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LeaveRequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 13,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerContent: {
    flex: 1,
    alignSelf: 'center',
  },

  employeeName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.text,
  },

  badge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 7,
  },

  badgeText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
  },

  date: {
    marginTop: 10,
    fontSize: 21,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },

  leaveType: {
    color: Colors.primary,
    fontFamily: FontFamily.medium,
    fontSize: 14,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  application: {
    color: Colors.textSecondary,
    marginTop: 10,
  },

  arrow: {
    fontSize: 28,
    color: Colors.textSecondary,
  },
});
