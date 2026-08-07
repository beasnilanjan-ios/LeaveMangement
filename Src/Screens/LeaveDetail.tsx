import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigator';
import { FlatList } from 'react-native';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import InfoRow from '../GlobalContainer/InfoRow';
import ApprovalItem from '../GlobalContainer/ApprovalItem';

type LeaveDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LeaveDetail'
>;

type LeaveDetailRouteProp = {
  params: RootStackParamList['LeaveDetail'];
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Approve':
      return {
        backgroundColor: Colors.successLight,
        color: Colors.success,
      };
    case 'Pending':
      return {
        backgroundColor: Colors.pendingLight,
        color: Colors.pending,
      };
    case 'Rejected':
      return {
        backgroundColor: Colors.rejectedLight,
        color: Colors.rejected,
      };
    default:
      return {
        backgroundColor: Colors.background,
        color: Colors.textSecondary,
      };
  }
};

const leaveDetail = {
  id: 'LV-20260811-001',
  leaveType: 'Casual Leave',
  applicationType: 'Full Day',
  status: 'Pending',
  fromDate: '2026-08-11',
  toDate: '2026-08-13',
  appliedOn: '2026-08-08',
  totalDays: 3,
  reason:
    'Going to my hometown due to a family function. Kindly approve my leave.',

  approvals: [
    {
      id: 1,
      name: 'Subrata Mukherjee',
      designation: 'Project Manager',
      status: 'Approved',
      date: '08 Aug 2026',
    },
    {
      id: 2,
      name: 'Manas Mukherjee',
      designation: 'Project Manager',
      status: 'Approved',
      date: '08 Aug 2026',
    },
    {
      id: 3,
      name: 'Prodip Ghosal',
      designation: 'Project Manager',
      status: 'Pending',
      date: '',
    },
  ],
};

const LeaveDetail = () => {
  const route = useRoute<LeaveDetailRouteProp>();
  const navigation = useNavigation<LeaveDetailNavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);

  const { id, type, applicationType, fromDate, toDate, status, reason } =
    route.params;

  const statusStyle = getStatusStyle(status);


  return (
    <View style={styles.container}>
      {/* ------------------------------------------------
          Top Bar
      ------------------------------------------------ */}
      <TopBar
        title="Leave Detail"
        backVisible={true}
        onMenuPress={() => navigation.goBack()}
      />

      {/* ------------------------------------------------
          Content
      ------------------------------------------------ */}
      
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>

      {/* Header Card */}

      <View style={styles.headerCard}>

          <View style={styles.headerRow}>

              <Text style={styles.leaveTitle}>
                  {type}
              </Text>

              <View
                  style={[
                      styles.statusBadge,
                      {
                          backgroundColor:
                              statusStyle.backgroundColor,
                      },
                  ]}>
                  <Text
                      style={[
                          styles.statusText,
                          {color: statusStyle.color},
                      ]}>
                      {leaveDetail.status}
                  </Text>
              </View>

          </View>

          <Text style={styles.headerDate}>
              {formatDate(leaveDetail.fromDate)} - {formatDate(leaveDetail.toDate)}
          </Text>

          <Text style={styles.totalDay}>
              {leaveDetail.totalDays} Days
          </Text>

      </View>



      {/* Leave Information */}

      <View style={styles.section}>

          <Text style={styles.sectionTitle}>
              Leave Information
          </Text>

          <View style={styles.infoCard}>

            <View style={styles.card}>
              <InfoRow
                label="Leave Type"
                value={leaveDetail.leaveType}
              />

              <InfoRow
                label="Application"
                value={leaveDetail.applicationType}
              />

              <InfoRow
                label="Status"
                value={leaveDetail.status}
                valueColor={Colors.pending}
              />

              <InfoRow
                label="From Date"
                value={formatDate(leaveDetail.fromDate)}
              />

              <InfoRow
                label="To Date"
                value={formatDate(leaveDetail.toDate)}
              />

              <InfoRow
                label="Applied On"
                value={formatDate(leaveDetail.appliedOn)}
              />

              <InfoRow
                label="Total Days"
                value={`${leaveDetail.totalDays} Days`}
                valueColor={Colors.primary}
              />

              {/* <InfoRow
                label="Reason"
                value={leaveDetail.reason}
                multiline
              /> */}
            </View>

          </View>

      </View>



      {/* Reason */}

      <View style={styles.section}>

          <Text style={styles.sectionTitle}>
              Reason
          </Text>

          <View style={styles.infoCard}>

              <Text style={styles.reasonText}>
                  {leaveDetail.reason}
              </Text>

          </View>

      </View>



      {/* Approval Flow */}

      <View style={styles.section}>

          <Text style={styles.sectionTitle}>
              Approval Flow
          </Text>

          <View style={styles.infoCard}>

             <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                    Approval Timeline
                </Text>

                <FlatList
                    data={leaveDetail.approvals}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <ApprovalItem
                            name={item.name}
                            designation={item.designation}
                            approved={item.status === 'Approved'}
                            pending={item.status === 'Pending'}
                            rejected={item.status === 'Rejected'}
                            date={item.date}
                        />
                    )}
                />

            </View>

          </View>

      </View>



      {/* Request */}

      <View style={styles.section}>

          <Text style={styles.sectionTitle}>
              Request Information
          </Text>

          <View style={styles.infoCard}>

              <InfoRow
                  label="Request ID"
                  value={id}
              />

              <InfoRow
                  label="Applied On"
                  value="05 Aug 2026"
              />

          </View>

      </View>



      <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>

          <Text style={styles.backButtonText}>
              Back
          </Text>

      </TouchableOpacity>

  </ScrollView>

      {/* ------------------------------------------------
          Bottom Bar
      ------------------------------------------------ */}
      {/* <BottomBar selected={0} /> */}

      {/* ------------------------------------------------
          Side Menu
      ------------------------------------------------ */}
      <SideMenu
        visible={menuVisible}
        selected="Leave Detail"
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
};

export default LeaveDetail;

/* =====================================================
   Styles
===================================================== */

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
    paddingBottom: 100,
  },

  /* ===========================
     Status Badge
  =========================== */

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
  },

  statusText: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
  },

  /* ===========================
     Card
  =========================== */

  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },

  value: {
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },

  /* ===========================
     Actions
  =========================== */

  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },

  button: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  approveButton: {
    backgroundColor: Colors.success,
  },

  approveButtonText: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },

  rejectButton: {
    backgroundColor: Colors.rejected,
  },

  rejectButtonText: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },

  backButton: {
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
  },

  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.border,
},

headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},

leaveTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: Colors.text,
},

headerDate: {
    marginTop: 14,
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
},

totalDay: {
    marginTop: 8,
    fontSize: 22,
    color: Colors.primary,
    fontFamily: FontFamily.bold,
},

section: {
    marginBottom: 18,
},

sectionTitle: {
    fontSize: 17,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
    marginBottom: 10,
},

infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
},

reasonText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    fontFamily: FontFamily.regular,
},
});
