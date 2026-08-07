import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import { RootStackParamList } from '../Navigation/AppNavigator';
import InfoRow from '../GlobalContainer/InfoRow';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LeaveRequestDetail'
>;

const leaveDetail = {
  id: 'LR-1001',

  employee: {
    id: 'EMP1023',
    name: 'Rahul Sharma',
    designation: 'Software Engineer',
  },

  leaveType: 'Casual Leave',

  fromDate: '2026-09-02',

  toDate: '2026-09-05',

  noOfDays: 4,

  duration: 'Full Day',

  reason:
    'Family tour to attend a wedding ceremony. Need to take time off to be with family and participate in the celebrations.',

  status: 'Pending',

  approvals: [
    {
      id: 1,
      manager: 'Subrata Mukherjee',
      designation: 'Project Manager',
      status: 'Approved',
      date: '02 Sep 2026 10:30 AM',
    },
    {
      id: 2,
      manager: 'Manas Mukherjee',
      designation: 'Project Manager',
      status: 'Pending',
      date: '',
    },
  ],
};

const LeaveRequestDetail = () => {
  const navigation = useNavigation<NavigationProp>();

  const [rejectReason, setRejectReason] = useState('');

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <TopBar
        title="Leave Detail"
        backVisible={true}
        onMenuPress={() => navigation.goBack()}
      />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Your Leave Detail UI */}
        {/* Employee Card */}
          <View style={styles.employeeCard}>
            <Text style={styles.employeeName}>
              {leaveDetail.employee.name}
            </Text>

            <Text style={styles.employeeDesignation}>
              {leaveDetail.employee.designation}
            </Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    leaveDetail.status === 'Pending'
                      ? Colors.pendingLight
                      : leaveDetail.status === 'Approved'
                      ? Colors.successLight
                      : Colors.rejectedLight,
                },
              ]}>
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      leaveDetail.status === 'Pending'
                        ? Colors.pending
                        : leaveDetail.status === 'Approved'
                        ? Colors.success
                        : Colors.rejected,
                  },
                ]}>
                {leaveDetail.status}
              </Text>
            </View>
          </View>

          {/* Leave Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Leave Information</Text>

            <InfoRow
              label="Leave Type"
              value={leaveDetail.leaveType}
            />

            <InfoRow
              label="From Date"
              value={leaveDetail.fromDate}
            />

            <InfoRow
              label="To Date"
              value={leaveDetail.toDate}
            />

            <InfoRow
              label="No. of Days"
              value={`${leaveDetail.noOfDays}`}
            />

            <InfoRow
              label="Duration"
              value={leaveDetail.duration}
            />
          </View>

          <View style={styles.reasonCard}>
            <Text style={styles.reasonTitle}>Reason for Leave</Text>

            <View style={styles.reasonBox}>
              <Text style={styles.reasonText}>
                {leaveDetail.reason}
              </Text>
            </View>
          </View>

          {/* Reject Reason */}
          <Text style={styles.rejectLabel}>
            Reject Reason (Required only if rejecting)
          </Text>

          <TextInput
            style={styles.rejectInput}
            multiline
            placeholder="Enter rejection reason..."
            placeholderTextColor={Colors.textSecondary}
            value={rejectReason}
            onChangeText={setRejectReason}
          />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => {
                console.log('Approved');
              }}>
              <Text style={styles.approveText}>
                Approve Leave
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

                console.log('Rejected', rejectReason);
              }}>
              <Text style={styles.rejectText}>
                Reject Leave
              </Text>
            </TouchableOpacity>
          </View>
       
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

  pageTitle: {
    fontSize: 23,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },

  pageSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
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

infoRow: {
  marginBottom: 16,
},

infoLabel: {
  fontSize: 13,
  fontFamily: FontFamily.medium,
  color: Colors.textSecondary,
},

infoValue: {
  marginTop: 4,
  fontSize: 15,
  fontFamily: FontFamily.semiBold,
  color: Colors.text,
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