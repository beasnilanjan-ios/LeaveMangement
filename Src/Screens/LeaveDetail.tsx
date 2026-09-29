import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../Navigation/AppNavigator';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import InfoRow from '../GlobalContainer/InfoRow';
import ApprovalItem from '../GlobalContainer/ApprovalItem';

import {
  getLeaveDetails,
  LeaveDetailsDataModel,
} from '../Services/LeaveDetailsService';

const formatDate = (date: string) => {
  if (!date) {
    return '';
  }

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return date;
  }

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approve':
    case 'approved':
      return {
        backgroundColor: Colors.successLight,
        color: Colors.success,
      };

    case 'pending':
      return {
        backgroundColor: Colors.pendingLight,
        color: Colors.pending,
      };

    case 'reject':
    case 'rejected':
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

const LeaveDetail = () => {
  const route = useRoute<LeaveDetailRouteProp>();
  const navigation = useNavigation<LeaveDetailNavigationProp>();

  const [menuVisible, setMenuVisible] = useState(false);

  const [leaveData, setLeaveData] = useState<LeaveDetailsDataModel | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /*
   * ID coming from Leave List screen
   */
  const { id } = route.params;

  console.log('LeaveDetail params:', route.params);

  /* -------------------------------------------------------------------------- */
  /* Fetch Leave Details                                                        */
  /* -------------------------------------------------------------------------- */

  const fetchLeaveDetails = async (leaveId: number | string) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const data = await getLeaveDetails(leaveId);

      setLeaveData(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to load leave details',
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Initial API Call                                                           */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (id !== undefined && id !== null) {
      fetchLeaveDetails(id);
    }
  }, [id]);

  /* -------------------------------------------------------------------------- */
  /* Loading                                                                     */
  /* -------------------------------------------------------------------------- */

  if (loading && !leaveData) {
    return (
      <View style={styles.container}>
        <TopBar
          title="Leave Detail"
          backVisible={true}
          onMenuPress={() => navigation.goBack()}
        />

        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />

          <Text style={styles.loadingText}>Loading leave details...</Text>
        </View>

        <SideMenu
          visible={menuVisible}
          selected="Leave Detail"
          onClose={() => setMenuVisible(false)}
        />
      </View>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* Error                                                                       */
  /* -------------------------------------------------------------------------- */

  if (errorMessage && !leaveData) {
    return (
      <View style={styles.container}>
        <TopBar
          title="Leave Detail"
          backVisible={true}
          onMenuPress={() => navigation.goBack()}
        />

        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchLeaveDetails(id)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>

        <SideMenu
          visible={menuVisible}
          selected="Leave Detail"
          onClose={() => setMenuVisible(false)}
        />
      </View>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* No Data                                                                     */
  /* -------------------------------------------------------------------------- */

  if (!leaveData) {
    return (
      <View style={styles.container}>
        <TopBar
          title="Leave Detail"
          backVisible={true}
          onMenuPress={() => navigation.goBack()}
        />

        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No leave details found.</Text>
        </View>

        <SideMenu
          visible={menuVisible}
          selected="Leave Detail"
          onClose={() => setMenuVisible(false)}
        />
      </View>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* API Data                                                                    */
  /* -------------------------------------------------------------------------- */

  const leave = leaveData.leave;

  const statusStyle = getStatusStyle(leave.status);

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
        showsVerticalScrollIndicator={false}
      >
        {/* =====================================================
            Header Card
        ===================================================== */}

        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Text style={styles.leaveTitle}>{leave.leaveType}</Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusStyle.backgroundColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: statusStyle.color,
                  },
                ]}
              >
                {leave.status}
              </Text>
            </View>
          </View>

          <Text style={styles.headerDate}>
            {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
          </Text>

          <Text style={styles.totalDay}>{leave.totalDays} Days</Text>
        </View>

        {/* =====================================================
            Leave Information
        ===================================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leave Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.card}>
              <InfoRow label="Leave Type" value={leave.leaveType} />

              <InfoRow label="Application" value={leave.applicationType} />

              <InfoRow
                label="Status"
                value={leave.status}
                valueColor={statusStyle.color}
              />

              <InfoRow label="From Date" value={formatDate(leave.fromDate)} />

              <InfoRow label="To Date" value={formatDate(leave.toDate)} />

              <InfoRow label="Applied On" value={formatDate(leave.appliedOn)} />

              <InfoRow
                label="Total Days"
                value={`${leave.totalDays} Days`}
                valueColor={Colors.primary}
              />
            </View>
          </View>
        </View>

        {/* =====================================================
            Reason
        ===================================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason</Text>

          <View style={styles.infoCard}>
            <Text style={styles.reasonText}>
              {leave.reason || 'No reason provided'}
            </Text>
          </View>
        </View>

        {/* =====================================================
            Rejection Reason
        ===================================================== */}

        {leave.rejectionReason ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rejection Reason</Text>

            <View style={styles.infoCard}>
              <Text style={styles.reasonText}>{leave.rejectionReason}</Text>
            </View>
          </View>
        ) : null}

        {/* =====================================================
            Approval Flow
        ===================================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Approval Flow</Text>

          <View style={styles.infoCard}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Approval Timeline</Text>

              <FlatList
                data={leave.approvals}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <ApprovalItem
                    name={item.name}
                    designation={item.designation}
                    approved={
                      item.status?.toLowerCase() === 'approved' ||
                      item.status?.toLowerCase() === 'approve'
                    }
                    pending={item.status?.toLowerCase() === 'pending'}
                    rejected={
                      item.status?.toLowerCase() === 'rejected' ||
                      item.status?.toLowerCase() === 'reject'
                    }
                    date={item.date}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* =====================================================
            Request Information
        ===================================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Request Information</Text>

          <View style={styles.infoCard}>
            <InfoRow label="Request ID" value={leave.id.toString()} />

            <InfoRow label="Applied On" value={formatDate(leave.appliedOn)} />

            <InfoRow
              label="Balance Leave"
              value={`${leaveData.earnedLeave}`}
              valueColor={Colors.primary}
            />
          </View>
        </View>

        {/* =====================================================
            Back Button
        ===================================================== */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>

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

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },

  errorText: {
    fontSize: 15,
    fontFamily: FontFamily.medium,
    color: Colors.rejected,
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    height: 46,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  retryButtonText: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
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

  /* ===========================
     Header Card
  =========================== */

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
    flex: 1,
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    marginRight: 10,
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

  /* ===========================
     Section
  =========================== */

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
