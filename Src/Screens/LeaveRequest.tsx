import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import LeaveRequestCard from '../GlobalContainer/LeaveRequestCard';

const leaveRequests = [
  {
    id: 'LV001',
    employeeId: 'EMP001',
    employeeName: 'Rahul Sharma',
    leaveType: 'Casual Leave',
    applicationType: 'Full Day',
    fromDate: '2026-08-12',
    toDate: '2026-08-12',
    status: 'Approve',
    appliedOn: '2026-08-10',
  },
  {
    id: 'LV002',
    employeeId: 'EMP002',
    employeeName: 'Priya Das',
    leaveType: 'Sick Leave',
    applicationType: 'Half Day',
    fromDate: '2026-08-08',
    toDate: '2026-08-08',
    status: 'Pending',
    appliedOn: '2026-08-07',
  },
  {
    id: 'LV003',
    employeeId: 'EMP003',
    employeeName: 'Ankit Roy',
    leaveType: 'Restricted Holiday',
    applicationType: '3 Days Application',
    fromDate: '2026-08-15',
    toDate: '2026-08-18',
    status: 'Pending',
    appliedOn: '2026-08-12',
  },
  {
    id: 'LV004',
    employeeId: 'EMP002',
    employeeName: 'Priya Das',
    leaveType: 'Sick Leave',
    applicationType: 'Half Day',
    fromDate: '2026-09-08',
    toDate: '2026-09-08',
    status: 'Pending',
    appliedOn: '2026-09-08',
  },
];

const LeaveRequest = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'All' | 'Approve' | 'Pending'>(
    'All',
  );

  const [search, setSearch] = useState('');
  const navigation = useNavigation<any>();

  const filteredData = useMemo(() => {
    return leaveRequests.filter(item => {
      const matchStatus = selectedTab === 'All' || item.status === selectedTab;

      const matchSearch = item.employeeName
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [selectedTab, search]);

  return (
    <View style={styles.container}>
      {/* ------------------------------------------------
          Top Bar
      ------------------------------------------------ */}

      <TopBar
        title="Leave Request"
        onMenuPress={() => setMenuVisible(prev => !prev)}
      />

      {/* ------------------------------------------------
          Content
      ------------------------------------------------ */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
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
          {['All', 'Approve', 'Pending'].map(tab => {
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

        {/* List */}

        <FlatList
          data={filteredData}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <LeaveRequestCard
              item={item}
              onPress={item => {
                navigation.navigate('LeaveRequestDetail', {
                  id: item.id,
                });
              }}
            />
          )}
        />
      </ScrollView>

      {/* ------------------------------------------------
          Bottom Bar
      ------------------------------------------------ */}

      {/* <BottomBar selected={2} /> */}

      {/* ------------------------------------------------
          Side Menu
      ------------------------------------------------ */}

      <SideMenu
        visible={menuVisible}
        selected="Leave Requests"
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
};

export default LeaveRequest;

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
    paddingBottom: 25,
  },

  /* ---------------------------------------------------
      Page Header
    --------------------------------------------------- */

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
    marginBottom: 20,
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
});
