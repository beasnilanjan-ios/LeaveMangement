import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigator';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';

import { DashboardDataModel, getDashboard } from '../Services/DashboardService';

import { getCurrentUser as fetchCurrentUser } from '../Services/AuthService';

import { setCurrentUser } from '../Services/AuthSession';

/* =========================================================
   DATE HELPERS
========================================================= */

const formatDate = (date: string) => {
  const d = new Date(date);

  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
};

const getMonthName = (date: string) => {
  const d = new Date(date);

  return d.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

/* =========================================================
   NAVIGATION
========================================================= */

type DashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

/* =========================================================
   COMPONENT
========================================================= */

const Dashboard = () => {
  const navigation = useNavigation<DashboardNavigationProp>();

  const [menuVisible, setMenuVisible] = useState(false);

  const [selectedTab, setSelectedTab] = useState('All');

  const [dashboardData, setDashboardData] = useState<DashboardDataModel | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');

  /* =======================================================
     FETCH DASHBOARD DATA
  ======================================================= */

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchDashboard = async () => {
        try {
          setLoading(true);
          setErrorMessage('');

          const data = await getDashboard();

          if (!isActive) {
            return;
          }

          setDashboardData(data);

          try {
            const user = await fetchCurrentUser();

            if (isActive) {
              setCurrentUser(user);
            }
          } catch (error) {
            console.warn('Unable to load profile:', error);
          }
        } catch (error) {
          if (!isActive) {
            return;
          }

          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to load dashboard',
          );
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchDashboard();

      return () => {
        isActive = false;
      };
    }, []),
  );

  /* =======================================================
     INITIAL FETCH
  ======================================================= */

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const data = await getDashboard();

        setDashboardData(data);

        try {
          const user = await fetchCurrentUser();

          setCurrentUser(user);
        } catch (error) {
          console.warn('Unable to load profile:', error);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to load dashboard',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredLeaves = useMemo(() => {
    if (!dashboardData) {
      return [];
    }

    if (selectedTab === 'All') {
      return dashboardData.leaveRequests;
    }

    return dashboardData.leaveRequests.filter(
      item => item.status === selectedTab,
    );
  }, [selectedTab, dashboardData]);

  /* =======================================================
     GROUP BY MONTH
  ======================================================= */

  const groupedLeaves = useMemo(() => {
    const groups: {
      [key: string]: typeof filteredLeaves;
    } = {};

    filteredLeaves.forEach(item => {
      const month = getMonthName(item.fromDate);

      if (!groups[month]) {
        groups[month] = [];
      }

      groups[month].push(item);
    });

    return groups;
  }, [filteredLeaves]);

  /* =======================================================
     LEAVE MONTH DATA
  ======================================================= */

  const groupedLeaveEntries = useMemo(() => {
    return Object.entries(groupedLeaves);
  }, [groupedLeaves]);

  /* =======================================================
     STATUS COLORS
  ======================================================= */

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

  /* =======================================================
     LEAVE TYPE COLORS
  ======================================================= */

  const getLeaveColor = (type: string) => {
    switch (type) {
      case 'Sick Leave':
        return Colors.primary;

      case 'Early Leave':
        return Colors.success;

      case 'Casual Leave':
        return Colors.pending;

      default:
        return Colors.textSecondary;
    }
  };

  /* =======================================================
     EMPTY MESSAGE
  ======================================================= */

  const getEmptyMessage = () => {
    switch (selectedTab) {
      case 'All':
        return 'No leave requests found';
      case 'Approve':
        return 'No approved leave found';
      case 'Pending':
        return 'No pending leave found';
      case 'Rejected':
        return 'No rejected leave found';
      default:
        return 'No leave requests found';
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <View style={styles.container}>
      {/* =================================================
          TOP BAR - FIXED
      ================================================= */}

      <TopBar title="Home" onMenuPress={() => setMenuVisible(prev => !prev)} />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <View style={styles.mainContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : errorMessage && !dashboardData ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{errorMessage}</Text>
          </View>
        ) : (
          <>
            {/* ==========================================
                SUMMARY CARDS - FIXED
            ========================================== */}

            <View style={styles.summaryContainer}>
              {/* Total Leave */}

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Total Leave</Text>

                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color: Colors.primary,
                    },
                  ]}
                >
                  {dashboardData?.leaveSummary.totalLeave}
                </Text>
              </View>

              {/* Balance Leave */}

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Balance Leave</Text>

                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color: Colors.success,
                    },
                  ]}
                >
                  {dashboardData?.leaveSummary.balanceLeave}
                </Text>
              </View>

              {/* Early Leave */}

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Early Leave</Text>

                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color: Colors.accent,
                    },
                  ]}
                >
                  {dashboardData?.leaveSummary.earlyLeave}
                </Text>
              </View>
            </View>

            {/* ==========================================
                FILTER TABS - FIXED
            ========================================== */}

            <View style={styles.tabsContainer}>
              {['All', 'Approve', 'Pending', 'Rejected'].map(tab => {
                const active = selectedTab === tab;

                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, active && styles.activeTab]}
                    onPress={() => setSelectedTab(tab)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[styles.tabText, active && styles.activeTabText]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ==========================================
                ACTION ROW - FIXED
            ========================================== */}

            <View style={styles.actionRow}>
              <Text style={styles.sectionTitle}>Leave Requests</Text>

              <TouchableOpacity
                style={styles.applyButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ApplyLeave')}
              >
                <Text style={styles.applyButtonText}>Apply Leave</Text>
              </TouchableOpacity>
            </View>

            {/* ==========================================
                ONLY LEAVE LIST SCROLLS
            ========================================== */}

            <View style={styles.listWrapper}>
              <FlatList
                data={groupedLeaveEntries}
                keyExtractor={([month]) => month}
                showsVerticalScrollIndicator={false}
                bounces={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.leaveListContent}
                renderItem={({ item: [month, leaves] }) => (
                  <View style={styles.monthSection}>
                    {/* Month */}

                    <Text style={styles.monthTitle}>{month}</Text>

                    {/* Leaves */}

                    {leaves.map(item => {
                      const statusStyle = getStatusStyle(item.status);

                      const leaveColor = getLeaveColor(item.type);

                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.leaveCard}
                          activeOpacity={0.8}
                          onPress={() =>
                            navigation.navigate('LeaveDetail', {
                              id: item.id,
                              type: item.type,
                              applicationType: item.applicationType,
                              fromDate: item.fromDate,
                              toDate: item.toDate,
                              status: item.status,
                              reason: item.reason,
                            })
                          }
                        >
                          {/* =====================
                              CARD TOP
                          ====================== */}

                          <View style={styles.cardTopRow}>
                            <Text style={styles.applicationType}>
                              {item.applicationType}
                            </Text>

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
                                {item.status}
                              </Text>
                            </View>
                          </View>

                          {/* =====================
                              DATE
                          ====================== */}

                          <Text style={styles.dateText}>
                            {formatDate(item.fromDate)}

                            {item.fromDate !== item.toDate &&
                              ` - ${formatDate(item.toDate)}`}
                          </Text>

                          {/* =====================
                              CARD BOTTOM
                          ====================== */}

                          <View style={styles.cardBottomRow}>
                            <Text
                              style={[
                                styles.leaveType,
                                {
                                  color: leaveColor,
                                },
                              ]}
                            >
                              {item.type}
                            </Text>

                            <View style={styles.arrowContainer}>
                              <Text style={styles.arrow}>›</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyListContainer}>
                    <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
                  </View>
                }
              />
            </View>
          </>
        )}
      </View>

      {/* =================================================
          BOTTOM BAR - FIXED
      ================================================= */}

      <View style={styles.bottomBarWrapper}>
        <BottomBar selected={0} />
      </View>

      {/* =================================================
          SIDE MENU
      ================================================= */}

      <SideMenu
        visible={menuVisible}
        selected="Home"
        onClose={() => setMenuVisible(false)}
        onItemPress={item => {
          console.log('Selected:', item);
        }}
      />
    </View>
  );
};

export default Dashboard;

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     MAIN CONTAINER
  ======================================================= */

  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /* =======================================================
     MAIN CONTENT
  ======================================================= */

  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 15,
    minHeight: 0,
  },

  /* =======================================================
     LIST WRAPPER
  ======================================================= */

  listWrapper: {
    flex: 1,
    minHeight: 0,
    marginTop: 0,
  },

  /* =======================================================
     BOTTOM BAR
  ======================================================= */

  bottomBarWrapper: {
    flexShrink: 0,
    backgroundColor: Colors.white,
  },

  /* =======================================================
     SUMMARY
  ======================================================= */

  summaryContainer: {
    flexDirection: 'row',
    gap: 10,
    flexShrink: 0,
  },

  summaryCard: {
    flex: 1,
    minHeight: 95,

    backgroundColor: Colors.white,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: Colors.border,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 5,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,
    shadowRadius: 5,

    elevation: 2,
  },

  summaryTitle: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  summaryValue: {
    marginTop: 8,
    fontSize: 27,
    fontFamily: FontFamily.bold,
  },

  /* =======================================================
     TABS
  ======================================================= */

  tabsContainer: {
    height: 55,

    marginTop: 18,

    backgroundColor: Colors.primaryLight,

    borderRadius: 14,

    flexDirection: 'row',

    alignItems: 'center',

    padding: 4,

    flexShrink: 0,
  },

  tab: {
    flex: 1,

    height: 47,

    justifyContent: 'center',

    alignItems: 'center',

    borderRadius: 12,
  },

  activeTab: {
    backgroundColor: Colors.white,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.06,

    shadowRadius: 4,

    elevation: 2,
  },

  tabText: {
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },

  activeTabText: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },

  /* =======================================================
     ACTION
  ======================================================= */

  actionRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: 22,

    marginBottom: 8,

    flexShrink: 0,
  },

  sectionTitle: {
    fontSize: 18,

    fontFamily: FontFamily.semiBold,

    color: Colors.text,
  },

  applyButton: {
    height: 42,

    paddingHorizontal: 18,

    borderRadius: 9,

    borderWidth: 1.5,

    borderColor: Colors.primary,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: Colors.white,
  },

  applyButtonText: {
    fontSize: 14,

    fontFamily: FontFamily.semiBold,

    color: Colors.primary,
  },

  /* =======================================================
     MONTH
  ======================================================= */

  monthSection: {
    width: '100%',
  },

  monthTitle: {
    marginTop: 14,

    marginBottom: 10,

    fontSize: 15,

    fontFamily: FontFamily.medium,

    color: Colors.textSecondary,
  },

  /* =======================================================
     LEAVE LIST
  ======================================================= */

  leaveListContent: {
    paddingBottom: 20,

    flexGrow: 1,
  },

  /* =======================================================
     CARD
  ======================================================= */

  leaveCard: {
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

  cardTopRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  applicationType: {
    flex: 1,

    fontSize: 14,

    fontFamily: FontFamily.medium,

    color: Colors.textSecondary,

    marginRight: 10,
  },

  statusBadge: {
    paddingHorizontal: 11,

    paddingVertical: 6,

    borderRadius: 7,
  },

  statusText: {
    fontSize: 12,

    fontFamily: FontFamily.semiBold,
  },

  dateText: {
    marginTop: 10,

    fontSize: 21,

    fontFamily: FontFamily.bold,

    color: Colors.text,
  },

  cardBottomRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: 8,
  },

  leaveType: {
    fontSize: 14,

    fontFamily: FontFamily.medium,
  },

  arrowContainer: {
    width: 36,

    height: 36,

    borderRadius: 10,

    backgroundColor: Colors.background,

    justifyContent: 'center',

    alignItems: 'center',
  },

  arrow: {
    fontSize: 28,

    color: Colors.textSecondary,

    lineHeight: 30,
  },

  /* =======================================================
     LOADING
  ======================================================= */

  loadingContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  /* =======================================================
     EMPTY
  ======================================================= */

  emptyContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  emptyListContainer: {
    flex: 1,

    minHeight: 200,

    justifyContent: 'center',

    alignItems: 'center',
  },

  emptyText: {
    fontSize: 15,

    fontFamily: FontFamily.medium,

    color: Colors.textSecondary,

    textAlign: 'center',
  },
});
