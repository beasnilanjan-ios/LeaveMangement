import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import {
  HolidayDataModel,
  HolidayModel,
  getHolidays,
} from '../Services/HolidayService';

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

  const [holidayData, setHolidayData] = useState<HolidayDataModel | null>(null);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  /* ---------------------------------------------------
     Fetch Holidays
  --------------------------------------------------- */

  const fetchHolidays = async (year: number) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const data = await getHolidays(year);

      setHolidayData(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to load holidays',
      );
    } finally {
      setLoading(false);
    }
  };

  const getCurrentYear = (): number => {
    return new Date().getFullYear();
  };

  useEffect(() => {
    fetchHolidays(currentYear);
  }, []);

  /* ---------------------------------------------------
     Filter Holidays
  --------------------------------------------------- */

  const filteredHolidays = useMemo(() => {
    if (!holidayData) {
      return [];
    }

    if (selectedType === 'All') {
      return holidayData.holidayData;
    }

    return holidayData.holidayData.filter(item => item.type === selectedType);
  }, [selectedType, holidayData]);

  /* ---------------------------------------------------
     Group Holidays By Month
  --------------------------------------------------- */

  const groupedHolidays = useMemo(() => {
    return filteredHolidays.reduce(
      (groups: { [key: string]: HolidayModel[] }, item) => {
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
      <TopBar
        title="Holiday"
        onMenuPress={() => setMenuVisible(prev => !prev)}
      />

      <View style={styles.mainContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : errorMessage && !holidayData ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Unable to Load Holidays</Text>

            <Text style={styles.emptyText}>{errorMessage}</Text>
          </View>
        ) : (
          <>
            <View style={styles.headerContent}>
              <Text style={styles.pageTitle}>Holiday Calendar</Text>

              <Text style={styles.pageSubtitle}>
                View upcoming holidays and company holidays
              </Text>

              <View style={styles.periodContainer}>
                <View style={styles.periodLeftContainer}>
                  {selectedYear > currentYear && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedYear(currentYear);
                        fetchHolidays(currentYear);
                      }}
                      style={styles.periodArrowButton}
                    >
                      <View style={styles.cardArrowContainer}>
                        <Text style={styles.cardArrow}>‹</Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  <View style={styles.periodLeft}>
                    <Image
                      source={require('../Assets/Icons/calendar2.png')}
                      style={styles.periodIcon}
                      resizeMode="contain"
                    />

                    <View>
                      <Text style={styles.periodLabel}>Holiday Period</Text>

                      <Text style={styles.periodValue}>
                        {holidayData?.holidayPeriod}
                      </Text>
                    </View>
                  </View>
                </View>

                {selectedYear === currentYear && currentMonth === 11 && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      const nextYear = currentYear + 1;
                      setSelectedYear(nextYear);
                      fetchHolidays(nextYear);
                    }}
                    style={styles.rightArrowButton}
                  >
                    <View style={styles.cardArrowContainer}>
                      <Text style={styles.cardArrow}>›</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.sectionTitle}>Holiday Type</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterContainer}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedType('All')}
                  style={[
                    styles.filterButton,
                    selectedType === 'All' && styles.filterButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedType === 'All' && styles.filterTextSelected,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedType('General')}
                  style={[
                    styles.filterButton,
                    selectedType === 'General' && styles.filterButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedType === 'General' && styles.filterTextSelected,
                    ]}
                  >
                    General Holiday
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedType('Restricted')}
                  style={[
                    styles.filterButton,
                    selectedType === 'Restricted' &&
                      styles.filterButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedType === 'Restricted' &&
                        styles.filterTextSelected,
                    ]}
                  >
                    Restricted Holiday
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <ScrollView
              style={styles.listScrollView}
              contentContainerStyle={styles.listContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {Object.keys(groupedHolidays).map(month => (
                <View key={month} style={styles.monthSection}>
                  <Text style={styles.monthTitle}>{month}</Text>

                  {groupedHolidays[month].map(item => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.8}
                      style={styles.holidayCard}
                    >
                      <View
                        style={[
                          styles.dateBox,
                          item.type === 'Restricted' &&
                            styles.restrictedDateBox,
                        ]}
                      >
                        <Text style={styles.dateNumber}>
                          {getDateNumber(item.date)}
                        </Text>

                        <Text style={styles.dateMonth}>
                          {getMonthShort(item.date)}
                        </Text>
                      </View>

                      <View style={styles.holidayInfo}>
                        <Text style={styles.holidayName}>{item.purpose}</Text>

                        <Text style={styles.holidayDay}>{item.day}</Text>

                        <View
                          style={[
                            styles.typeBadge,
                            item.type === 'Restricted' &&
                              styles.restrictedBadge,
                          ]}
                        >
                          <Text
                            style={[
                              styles.typeBadgeText,
                              item.type === 'Restricted' &&
                                styles.restrictedBadgeText,
                            ]}
                          >
                            {item.type === 'General'
                              ? 'General Holiday'
                              : 'Restricted Holiday'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

              {filteredHolidays.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Image
                    source={require('../Assets/Icons/calendar2.png')}
                    style={styles.emptyIcon}
                    resizeMode="contain"
                  />

                  <Text style={styles.emptyTitle}>No Holidays Found</Text>

                  <Text style={styles.emptyText}>
                    There are no holidays for the selected type.
                  </Text>
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>

      <BottomBar selected={2} />

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

  mainContent: {
    flex: 1,
  },

  headerContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 0,
  },

  listScrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  listContentContainer: {
    paddingBottom: 18,
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

  periodContainer: {
    marginTop: 20,
    minHeight: 58,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  periodLeftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  periodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  periodArrowButton: {
    width: 38,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },

  rightArrowButton: {
    width: 38,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
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
    height: 40,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9AA7B2',
    borderRadius: 22,
    marginRight: 4,
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

  monthSection: {
    marginTop: 24,
  },

  monthTitle: {
    marginBottom: 10,
    fontSize: 17,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },

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

  cardArrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardArrow: {
    fontSize: 25,
    lineHeight: 30,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

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

  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
