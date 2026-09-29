import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import LeaveRequestCard from '../GlobalContainer/LeaveRequestCard';

import {
  getAllLeaveRequests,
  LeaveRequestListItem,
} from '../Services/LeaveRequestService';

const LeaveRequest = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const [selectedTab, setSelectedTab] = useState<
    'All' | 'Approve' | 'Pending' | 'Rejected'
  >('All');

  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestListItem[]>(
    [],
  );

  const navigation = useNavigation<any>();

  /**
   * Fetch Leave Requests
   */
  const fetchLeaveRequests = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const data = await getAllLeaveRequests(query);

      setLeaveRequests(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load leave requests',
      );

      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reload API every time this screen comes into focus.
   *
   * This will execute:
   * - First time the screen opens
   * - When navigating away and coming back
   * - When returning from LeaveRequestDetail
   * - Whenever this screen becomes active again
   */
  useFocusEffect(
    useCallback(() => {
      fetchLeaveRequests(search.trim());

      return () => {
        // Optional cleanup when screen loses focus
      };
    }, [fetchLeaveRequests]),
  );

  /**
   * Search API
   *
   * Do not call this immediately when the page first loads.
   * The focus effect above handles the initial API call.
   */
  useEffect(() => {
    const trimmedSearch = search.trim();

    // Don't call API again for empty search.
    // Initial loading is handled by useFocusEffect.
    if (trimmedSearch === '') {
      return;
    }

    const timer = setTimeout(() => {
      fetchLeaveRequests(trimmedSearch);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, fetchLeaveRequests]);

  /**
   * Filter by selected tab
   */
  const filteredData = useMemo(() => {
    return leaveRequests.filter(item => {
      const matchStatus = selectedTab === 'All' || item.status === selectedTab;

      return matchStatus;
    });
  }, [selectedTab, leaveRequests]);

  return (
    <View style={styles.container}>
      <TopBar
        title="Leave Request"
        onMenuPress={() => setMenuVisible(prev => !prev)}
      />

      <View style={styles.mainContent}>
        {/* Search */}
        <TextInput
          placeholder="Search Employee..."
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['All', 'Approve', 'Pending', 'Rejected'].map(tab => {
            const selected = selectedTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selected && styles.selectedTab]}
                onPress={() => setSelectedTab(tab as any)}
              >
                <Text
                  style={[styles.tabText, selected && styles.selectedTabText]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : errorMessage ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Unable to Load Requests</Text>

            <Text style={styles.emptyText}>{errorMessage}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const detailItem = {
                ...item,
                employeeName: item.employeeName || 'N/A',
                designation: item.designation || 'N/A',
                leaveType: item.leaveType || 'N/A',
                no_of_days: item.no_of_days ?? 0,
                duration: item.duration || 'N/A',
                reason: item.reason || 'N/A',
              };

              return (
                <LeaveRequestCard
                  item={item}
                  onPress={() => {
                    navigation.navigate('LeaveRequestDetail', detailItem);
                  }}
                />
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Leave Requests</Text>

                <Text style={styles.emptyText}>No leave requests found.</Text>
              </View>
            }
          />
        )}
      </View>

      <SideMenu
        visible={menuVisible}
        selected="Leave Requests"
        onClose={() => setMenuVisible(false)}
      />

      <BottomBar />
    </View>
  );
};

export default LeaveRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },

  searchInput: {
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  tabContainer: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 16,
    backgroundColor: '#EAF3FB',
    borderRadius: 14,
    padding: 4,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },

  selectedTab: {
    backgroundColor: Colors.white,
  },

  tabText: {
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
  },

  selectedTabText: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },

  listContent: {
    paddingBottom: 18,
    flexGrow: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontSize: 18,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
});
