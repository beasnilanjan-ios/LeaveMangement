import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import { RootStackParamList } from '../Navigation/AppNavigator';
import InfoRow from '../GlobalContainer/InfoRow';
import { updateLeaveStatus } from '../Services/LeaveRequestService';

type LeaveRequestDetailRouteProp = RouteProp<
  RootStackParamList,
  'LeaveRequestDetail'
>;

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LeaveRequestDetail'
>;

const LeaveRequestDetail = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LeaveRequestDetailRouteProp>();
  const item = route.params;

  const employeeName = item.employeeName || 'N/A';
  const designation = item.designation || 'N/A';
  const leaveType = item.leaveType || 'N/A';
  const noOfDays = item.no_of_days ?? 0;
  const duration = item.duration || 'N/A';
  const reason = item.reason || 'N/A';

  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const status = item.status === 'Approve' ? 'Approved' : item.status;

  const handleStatusUpdate = async (nextStatus: 'Approved' | 'Rejected') => {
    try {
      setSubmitting(true);

      const payload = {
        noOfDays: String(noOfDays),
        status: nextStatus,
        ...(nextStatus === 'Rejected' && {
          rejection_reason: rejectReason.trim(),
        }),
      };

      await updateLeaveStatus(item.id, payload);
      Alert.alert('Success', 'Leave status updated');
      navigation.goBack();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to update leave status';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar
        title="Leave Request Detail"
        backVisible={true}
        onMenuPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.employeeCard}>
          <Text style={styles.employeeName}>{employeeName}</Text>

          <Text style={styles.employeeDesignation}>{designation}</Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  status === 'Pending'
                    ? Colors.pendingLight
                    : status === 'Approved'
                    ? Colors.successLight
                    : Colors.rejectedLight,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    status === 'Pending'
                      ? Colors.pending
                      : status === 'Approved'
                      ? Colors.success
                      : Colors.rejected,
                },
              ]}
            >
              {status}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Leave Information</Text>

          <InfoRow label="Leave Type" value={leaveType} />

          <InfoRow label="From Date" value={item.fromDate || 'N/A'} />

          <InfoRow label="To Date" value={item.toDate || 'N/A'} />

          <InfoRow label="No. of Days" value={String(noOfDays)} />

          <InfoRow label="Duration" value={duration} />
        </View>

        <View style={styles.reasonCard}>
          <Text style={styles.reasonTitle}>Reason for Leave</Text>

          <View style={styles.reasonBox}>
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        </View>

        {item.status === 'Pending' && (
          <Text style={styles.rejectLabel}>
            Reject Reason (Required only if rejecting)
          </Text>
        )}
        {item.status === 'Pending' && (
          <TextInput
            style={styles.rejectInput}
            multiline
            placeholder="Enter rejection reason..."
            placeholderTextColor={Colors.textSecondary}
            value={rejectReason}
            onChangeText={setRejectReason}
          />
        )}

        {item.status === 'Pending' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleStatusUpdate('Approved')}
              disabled={submitting}
            >
              <Text style={styles.approveText}>
                {submitting ? 'Updating...' : 'Approve Leave'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => {
                if (!rejectReason.trim()) {
                  Alert.alert(
                    'Reject Reason',
                    'Please enter rejection reason.',
                  );
                  return;
                }

                handleStatusUpdate('Rejected');
              }}
              disabled={submitting}
            >
              <Text style={styles.rejectText}>
                {submitting ? 'Updating...' : 'Reject Leave'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default LeaveRequestDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 25,
  },

  employeeCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 18,
  },

  employeeName: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },

  employeeDesignation: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    marginBottom: 15,
  },

  rejectLabel: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },

  rejectInput: {
    minHeight: 120,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 14,
    color: Colors.text,
    fontFamily: FontFamily.regular,
  },

  buttonContainer: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 12,
  },

  approveButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },

  approveText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
  },

  rejectButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.rejected,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rejectText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
  },

  reasonCard: {
    marginTop: 18,
  },

  reasonTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    marginBottom: 10,
  },

  reasonBox: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
  },

  reasonText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: FontFamily.regular,
    color: Colors.text,
  },
});
