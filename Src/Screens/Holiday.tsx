import React, {useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

import Colors from '../Assets/Colors/Colors';
import {FontFamily} from '../GlobalFont/GlobalFont';

/* ---------------------------------------------------
   Static Holiday Data
   Later you can directly replace this with API data
--------------------------------------------------- */

const holidayData = [
  {
    id: 1,
    date: '2026-01-26',
    day: 'Mon',
    name: 'Republic Day',
    type: 'General',
  },
  {
    id: 2,
    date: '2026-03-04',
    day: 'Wed',
    name: 'Holi',
    type: 'General',
  },
  {
    id: 3,
    date: '2026-04-03',
    day: 'Fri',
    name: 'Good Friday',
    type: 'General',
  },
  {
    id: 4,
    date: '2026-05-01',
    day: 'Fri',
    name: 'May Day',
    type: 'Restricted',
  },
  {
    id: 5,
    date: '2026-08-15',
    day: 'Sat',
    name: 'Independence Day',
    type: 'General',
  },
  {
    id: 6,
    date: '2026-09-04',
    day: 'Fri',
    name: 'Janmashtami',
    type: 'Restricted',
  },
  {
    id: 7,
    date: '2026-10-02',
    day: 'Fri',
    name: 'Gandhi Jayanti',
    type: 'General',
  },
  {
    id: 8,
    date: '2026-10-20',
    day: 'Tue',
    name: 'Diwali',
    type: 'General',
  },
  {
    id: 9,
    date: '2026-12-25',
    day: 'Fri',
    name: 'Christmas',
    type: 'General',
  },
];

/* ---------------------------------------------------
   Helpers
--------------------------------------------------- */

const getMonthName = (date: string) => {
  const month = new Date(date).toLocaleString('en-US', {
    month: 'short',
  });

  const year = new Date(date).getFullYear();

  return `${month} ${year}`;
};

const getDateNumber = (date: string) => {
  return new Date(date).getDate().toString();
};

const getMonthShort = (date: string) => {
  return new Date(date)
    .toLocaleString('en-US', {
      month: 'short',
    })
    .toUpperCase();
};

/* ---------------------------------------------------
   Component
--------------------------------------------------- */

const Holiday = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const [selectedType, setSelectedType] = useState('All');

  /* ---------------------------------------------------
     Filter Holidays
  --------------------------------------------------- */

  const filteredHolidays = useMemo(() => {
    if (selectedType === 'All') {
      return holidayData;
    }

    return holidayData.filter(
      item => item.type === selectedType,
    );
  }, [selectedType]);

  /* ---------------------------------------------------
     Group Holidays By Month
  --------------------------------------------------- */

  const groupedHolidays = useMemo(() => {
    return filteredHolidays.reduce(
      (groups: {[key: string]: typeof holidayData}, item) => {
        const month = getMonthName(item.date);

        if (!groups[month]) {
          groups[month] = [];
        }

        groups[month].push(item);

        return groups;
      },
      {},
    );
  }, [filteredHolidays]);

  return (
    <View style={styles.container}>

      {/* ------------------------------------------------
          Top Bar
      ------------------------------------------------ */}

      <TopBar
        title="Holiday"
        onMenuPress={() =>
          setMenuVisible(prev => !prev)
        }
      />

      {/* ------------------------------------------------
          Content
      ------------------------------------------------ */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>

        {/* Page Title */}

        <Text style={styles.pageTitle}>
          Holiday Calendar
        </Text>

        <Text style={styles.pageSubtitle}>
          View upcoming holidays and company holidays
        </Text>

        {/* ------------------------------------------------
            Holiday Period
        ------------------------------------------------ */}

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.periodContainer}>

          <View style={styles.periodLeft}>

            <Image
              source={require('../Assets/Icons/calendar2.png')}
              style={styles.periodIcon}
              resizeMode="contain"
            />

            <View>
              <Text style={styles.periodLabel}>
                Holiday Period
              </Text>

              <Text style={styles.periodValue}>
                Jan 2026 - Dec 2026
              </Text>
            </View>

          </View>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>

        {/* ------------------------------------------------
            Holiday Type
        ------------------------------------------------ */}

        <Text style={styles.sectionTitle}>
          Holiday Type
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}>

          {/* All */}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedType('All')}
            style={[
              styles.filterButton,
              selectedType === 'All' &&
                styles.filterButtonSelected,
            ]}>

            <Text
              style={[
                styles.filterText,
                selectedType === 'All' &&
                  styles.filterTextSelected,
              ]}>
              All
            </Text>

          </TouchableOpacity>

          {/* General */}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              setSelectedType('General')
            }
            style={[
              styles.filterButton,
              selectedType === 'General' &&
                styles.filterButtonSelected,
            ]}>

            <Text
              style={[
                styles.filterText,
                selectedType === 'General' &&
                  styles.filterTextSelected,
              ]}>
              General Holiday
            </Text>

          </TouchableOpacity>

          {/* Restricted */}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              setSelectedType('Restricted')
            }
            style={[
              styles.filterButton,
              selectedType === 'Restricted' &&
                styles.filterButtonSelected,
            ]}>

            <Text
              style={[
                styles.filterText,
                selectedType === 'Restricted' &&
                  styles.filterTextSelected,
              ]}>
              Restricted Holiday
            </Text>

          </TouchableOpacity>

        </ScrollView>

        {/* ------------------------------------------------
            Holiday List
        ------------------------------------------------ */}

        {Object.keys(groupedHolidays).map(month => (
          <View
            key={month}
            style={styles.monthSection}>

            {/* Month */}

            <Text style={styles.monthTitle}>
              {month}
            </Text>

            {/* Holidays */}

            {groupedHolidays[month].map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={styles.holidayCard}>

                {/* Date Box */}

                <View
                  style={[
                    styles.dateBox,
                    item.type === 'Restricted' &&
                      styles.restrictedDateBox,
                  ]}>

                  <Text style={styles.dateNumber}>
                    {getDateNumber(item.date)}
                  </Text>

                  <Text style={styles.dateMonth}>
                    {getMonthShort(item.date)}
                  </Text>

                </View>

                {/* Holiday Information */}

                <View style={styles.holidayInfo}>

                  <Text style={styles.holidayName}>
                    {item.name}
                  </Text>

                  <Text style={styles.holidayDay}>
                    {item.day}
                  </Text>

                  <View
                    style={[
                      styles.typeBadge,
                      item.type === 'Restricted' &&
                        styles.restrictedBadge,
                    ]}>

                    <Text
                      style={[
                        styles.typeBadgeText,
                        item.type === 'Restricted' &&
                          styles.restrictedBadgeText,
                      ]}>
                      {item.type === 'General'
                        ? 'General Holiday'
                        : 'Restricted Holiday'}
                    </Text>

                  </View>

                </View>

                {/* Arrow */}

                <View style={styles.cardArrowContainer}>
                  <Text style={styles.cardArrow}>
                    ›
                  </Text>
                </View>

              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Empty State */}

        {filteredHolidays.length === 0 && (
          <View style={styles.emptyContainer}>

            <Image
              source={require('../Assets/Icons/calendar2.png')}
              style={styles.emptyIcon}
              resizeMode="contain"
            />

            <Text style={styles.emptyTitle}>
              No Holidays Found
            </Text>

            <Text style={styles.emptyText}>
              There are no holidays for the selected type.
            </Text>

          </View>
        )}

      </ScrollView>

      {/* ------------------------------------------------
          Bottom Bar
      ------------------------------------------------ */}

      <BottomBar selected={2} />

      {/* ------------------------------------------------
          Side Menu
      ------------------------------------------------ */}

      <SideMenu
        visible={menuVisible}
        selected="Holiday"
        onClose={() => setMenuVisible(false)}
      />

    </View>
  );
};

export default Holiday;

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

  /* ---------------------------------------------------
     Period
  --------------------------------------------------- */

  periodContainer: {
    marginTop: 20,

    minHeight: 58,

    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: Colors.border,

    borderRadius: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 14,
  },

  periodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  periodIcon: {
    width: 22,
    height: 22,

    tintColor: Colors.primary,

    marginRight: 11,
  },

  periodLabel: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },

  periodValue: {
    marginTop: 2,

    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },

  arrow: {
    fontSize: 28,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },

  /* ---------------------------------------------------
     Filter
  --------------------------------------------------- */

  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,

    fontSize: 15,
    fontFamily: FontFamily.semiBold,

    color: Colors.text,
  },

  filterContainer: {
    paddingRight: 10,
  },

  filterButton: {
    minHeight: 40,

    paddingHorizontal: 16,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#9AA7B2',

    borderRadius: 22,

    marginRight: 8,

    backgroundColor: Colors.white,
  },

  filterButtonSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },

  filterText: {
    fontSize: 13,

    fontFamily: FontFamily.medium,

    color: Colors.textSecondary,
  },

  filterTextSelected: {
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
  },

  /* ---------------------------------------------------
     Month
  --------------------------------------------------- */

  monthSection: {
    marginTop: 24,
  },

  monthTitle: {
    marginBottom: 10,

    fontSize: 17,

    fontFamily: FontFamily.semiBold,

    color: Colors.text,
  },

  /* ---------------------------------------------------
     Holiday Card
  --------------------------------------------------- */

  holidayCard: {
    minHeight: 82,

    backgroundColor: Colors.white,

    borderRadius: 11,

    marginBottom: 9,

    padding: 8,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: Colors.border,

    elevation: 1,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },

  /* ---------------------------------------------------
     Date Box
  --------------------------------------------------- */

  dateBox: {
    width: 60,
    height: 64,

    borderRadius: 10,

    backgroundColor: Colors.primaryLight,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 13,
  },

  restrictedDateBox: {
    backgroundColor: Colors.pendingLight,
  },

  dateNumber: {
    fontSize: 22,

    fontFamily: FontFamily.semiBold,

    color: Colors.primary,
  },

  dateMonth: {
    marginTop: 1,

    fontSize: 11,

    fontFamily: FontFamily.semiBold,

    color: Colors.textSecondary,
  },

  /* ---------------------------------------------------
     Holiday Information
  --------------------------------------------------- */

  holidayInfo: {
    flex: 1,

    justifyContent: 'center',
  },

  holidayName: {
    fontSize: 15,

    fontFamily: FontFamily.semiBold,

    color: Colors.text,
  },

  holidayDay: {
    marginTop: 3,

    fontSize: 12,

    fontFamily: FontFamily.regular,

    color: Colors.textSecondary,
  },

  /* ---------------------------------------------------
     Badge
  --------------------------------------------------- */

  typeBadge: {
    alignSelf: 'flex-start',

    marginTop: 5,

    paddingHorizontal: 7,
    paddingVertical: 3,

    borderRadius: 5,

    backgroundColor: Colors.successLight,
  },

  typeBadgeText: {
    fontSize: 9,

    fontFamily: FontFamily.medium,

    color: Colors.success,
  },

  restrictedBadge: {
    backgroundColor: Colors.pendingLight,
  },

  restrictedBadgeText: {
    color: Colors.pending,
  },

  /* ---------------------------------------------------
     Arrow
  --------------------------------------------------- */

  cardArrowContainer: {
    width: 30,
    height: 30,

    borderRadius: 15,

    backgroundColor: Colors.background,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 5,
  },

  cardArrow: {
    fontSize: 25,

    fontFamily: FontFamily.regular,

    color: Colors.textSecondary,

    marginTop: -2,
  },

  /* ---------------------------------------------------
     Empty
  --------------------------------------------------- */

  emptyContainer: {
    alignItems: 'center',

    paddingTop: 70,
  },

  emptyIcon: {
    width: 55,
    height: 55,

    tintColor: Colors.textSecondary,

    opacity: 0.5,
  },

  emptyTitle: {
    marginTop: 15,

    fontSize: 17,

    fontFamily: FontFamily.semiBold,

    color: Colors.text,
  },

  emptyText: {
    marginTop: 5,

    fontSize: 13,

    fontFamily: FontFamily.regular,

    color: Colors.textSecondary,

    textAlign: 'center',
  },
});