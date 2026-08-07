import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Colors from '../Assets/Colors/Colors';
import {FontFamily} from '../GlobalFont/GlobalFont';

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

type Props = {
  item: any;
  onPress: (item: any) => void;
};

const LeaveRequestCard = ({item, onPress}: Props) => {

  const approved = item.status === 'Approve';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => onPress(item)}>

      <View style={styles.header}>

        <View style={{flex: 1, alignSelf:'center'}}>
          <Text style={styles.employeeName}>
            {item.employeeName}
          </Text>

          {/* <Text style={styles.employeeId}>
            {item.employeeId}
          </Text> */}

        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: approved
                ? Colors.successLight
                : Colors.pendingLight,
            },
          ]}>

          <Text
            style={{
              color: approved
                ? Colors.success
                : Colors.pending,
              fontSize: 12,
              fontFamily: FontFamily.semiBold,
            }}>
            {item.status}
          </Text>

        </View>

      </View>

      <Text style={styles.date}>
        {formatDate(item.fromDate)}
          {item.fromDate !== item.toDate &&
            ` - ${formatDate(item.toDate)}`}
      </Text>

      <Text style={styles.leaveType}>
        {item.leaveType}
      </Text>

      <View style={styles.footer}>

        <Text style={styles.application}>
          {item.applicationType}
        </Text>

        <Text style={styles.arrow}>›</Text>

      </View>

    </TouchableOpacity>
  );
};

export default LeaveRequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  employeeName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.text,
  },

  employeeId: {
    marginTop: 3,
    color: Colors.textSecondary,
  },

  badge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 7,
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
    marginTop: 10
  },

  arrow: {
    fontSize: 28,
    color: Colors.textSecondary,
  },
});