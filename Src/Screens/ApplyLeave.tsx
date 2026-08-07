import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

import { FontFamily } from '../GlobalFont/GlobalFont';
import Colors from '../Assets/Colors/Colors';
import Calendar from 'react-native-calendars/src/calendar';

type LeaveDuration = 'FULL_DAY' | 'HALF_DAY' | 'QUARTERLY';

/*
 * Static data
 * --------------------------------
 * Later you can replace this with
 * your API response.
 */
const leaveBalance = {
  totalLeave: 33,
  balanceLeave: 25,
  restrictedLeave: 3,
};

const ApplyLeave = () => {
  /*
   * Holidays list
   */
  const holidays = [
    {
      date: '2026-01-26',
      name: 'Republic Day',
      restricted: false,
    },
    {
      date: '2026-03-08',
      name: 'Holi',
      restricted: false,
    },
    {
      date: '2026-08-11',
      name: 'Test',
      restricted: false,
    },
    {
      date: '2026-08-15',
      name: 'Independence Day',
      restricted: false,
    },
    {
      date: '2026-11-14',
      name: 'Diwali',
      restricted: false,
    },
    {
      date: '2026-12-25',
      name: 'Christmas',
      restricted: false,
    },
    {
      date: '2026-09-17',
      name: 'Vishwakarma Puja',
      restricted: true,
    },
  ];
  const [menuVisible, setMenuVisible] = useState(false);

  // Dates
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  // Date picker visibility
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // Duration
  const [duration, setDuration] = useState<LeaveDuration>('FULL_DAY');

  // Restricted Holiday
  const [restrictedHoliday, setRestrictedHoliday] = useState(false);

  // Restricted Holiday between from and todate
  const [restrictedHolidayTwoDate, setRestrictedHolidayTwoDate] =
    useState(false);

  // Reason
  const [reason, setReason] = useState('');

  const [selectedAuthorities, setSelectedAuthorities] = useState<number[]>([]);

  /*
   * Check whether From Date and To Date
   * are the same day.
   */
  const isSameDate = fromDate.toDateString() === toDate.toDateString();

  /*
   * Half Day and Quarterly Leave are
   * available only when:
   *
   * 1. From Date = To Date
   * 2. Balance Leave > 0
   */
  const canUsePartialLeave = isSameDate && leaveBalance.balanceLeave > 0;

  /*
   * If user selected Half Day / Quarterly
   * and then changes the date to multiple
   * days, automatically switch to Full Day.
   */
  useEffect(() => {
    if (!canUsePartialLeave && duration !== 'FULL_DAY') {
      setDuration('FULL_DAY');
    }
  }, [canUsePartialLeave, duration]);

  /*
   * Format date
   */
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const formatDateForCompare = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const isHoliday = (date: Date) => {
    return holidays.some(
      item => item.date === formatDateForCompare(date) && !item.restricted,
    );
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getMarkedDates = (restrictedEnabled: boolean) => {
    const marked: any = {};

    const years = holidays.map(item => Number(item.date.substring(0, 4)));

    const startYear = Math.min(...years);
    const endYear = Math.max(...years);

    const current = new Date(startYear, 0, 1);
    const last = new Date(endYear, 11, 31);

    // Today's date (remove time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (current <= last) {
      const dateKey = formatDateForCompare(current);

      // Disable previous dates
      if (current < today) {
        marked[dateKey] = {
          disabled: true,
          disableTouchEvent: true,
          customStyles: {
            container: {
              backgroundColor: '#F5F5F5',
            },
            text: {
              color: '#C0C0C0',
            },
          },
        };
      }

      // Disable weekends
      else if (isWeekend(current)) {
        marked[dateKey] = {
          disabled: true,
          disableTouchEvent: true,
          customStyles: {
            container: {
              backgroundColor: '#F5F5F5',
            },
            text: {
              color: '#BDBDBD',
            },
          },
        };
      }

      current.setDate(current.getDate() + 1);
    }

    // Holidays
    holidays.forEach(item => {
      const existing = marked[item.date] || {};

      if (!item.restricted) {
        // Public Holiday (Disabled)
        marked[item.date] = {
          ...existing,
          disabled: true,
          disableTouchEvent: true,
          customStyles: {
            container: {
              backgroundColor: '#FCEAEC',
            },
            text: {
              color: '#E31B2D',
              fontWeight: '700',
            },
          },
        };
      } else {
        // Restricted Holiday (Enabled)
        marked[item.date] = {
          ...existing,
          disabled: false,
          disableTouchEvent: false,
          customStyles: {
            container: {
              backgroundColor: '#FFF7E6',
            },
            text: {
              color: '#F59E0B',
              fontWeight: '700',
            },
          },
        };
      }
    });

    return marked;
  };

  const getToMarkedDates = (
  fromDate: Date,
  restrictedEnabled: boolean,
) => {
  const marked: any = {};

  const years = holidays.map(item =>
    Number(item.date.substring(0, 4)),
  );

  const startYear = Math.min(...years);
  const endYear = Math.max(...years);

  const current = new Date(startYear, 0, 1);
  const last = new Date(endYear, 11, 31);

  // Remove time part
  const minDate = new Date(fromDate);
  minDate.setHours(0, 0, 0, 0);

  while (current <= last) {
    const dateKey = formatDateForCompare(current);

    // Disable dates before From Date
    if (current < minDate) {
      marked[dateKey] = {
        disabled: true,
        disableTouchEvent: true,
        customStyles: {
          container: {
            backgroundColor: '#F5F5F5',
          },
          text: {
            color: '#C0C0C0',
          },
        },
      };
    }

    // Disable weekends
    else if (isWeekend(current)) {
      marked[dateKey] = {
        disabled: true,
        disableTouchEvent: true,
        customStyles: {
          container: {
            backgroundColor: '#F5F5F5',
          },
          text: {
            color: '#BDBDBD',
          },
        },
      };
    }

    current.setDate(current.getDate() + 1);
  }

  // Holidays
  holidays.forEach(item => {
    const existing = marked[item.date] || {};

    if (!item.restricted) {
      marked[item.date] = {
        ...existing,
        disabled: true,
        disableTouchEvent: true,
        customStyles: {
          container: {
            backgroundColor: '#FCEAEC',
          },
          text: {
            color: '#E31B2D',
            fontWeight: '700',
          },
        },
      };
    } else {
      marked[item.date] = {
        ...existing,
        disabled: false,
        disableTouchEvent: false,
        customStyles: {
          container: {
            backgroundColor: '#FFF7E6',
          },
          text: {
            color: '#F59E0B',
            fontWeight: '700',
          },
        },
      };
    }
  });

  return marked;
};

  const markedDates = useMemo(() => {
    return getMarkedDates(restrictedHoliday);
  }, [restrictedHoliday]);

  /*
   * From date change
   */
  const handleFromDateChange = (day: any) => {
    const pickedDate = new Date(day.dateString);

    const weekDay = pickedDate.getDay();

    // Weekend
    if (weekDay === 0 || weekDay === 6) {
      Alert.alert(
        'Invalid Date',
        'Weekend cannot be selected.',
      );
      return;
    }

    const holiday = holidays.find(
      item => item.date === day.dateString,
    );

    if (holiday && !holiday.restricted) {
      Alert.alert(
        'Holiday',
        `${holiday.name} is a public holiday.`,
      );
      return;
    }

    setFromDate(pickedDate);

    if (pickedDate > toDate) {
      setToDate(pickedDate);
    }

    // Close popup
    setShowFromPicker(false);
};

  /*
   * To date change
   */
 const handleToDateChange = (day: any) => {
  setShowToPicker(false);

  const selectedDate = new Date(day.timestamp);

  const weekDay = selectedDate.getDay();

  // Weekend
  if (weekDay === 0 || weekDay === 6) {
    Alert.alert(
      'Invalid Date',
      'Saturday and Sunday cannot be selected.',
    );
    return;
  }

  const holiday = holidays.find(
    item => item.date === day.dateString,
  );

  if (holiday && !holiday.restricted) {
    Alert.alert(
      'Holiday',
      `${holiday.name} is a public holiday.`,
    );
    return;
  }

  if (selectedDate < fromDate) {
    Alert.alert(
      'Invalid Date',
      'End date cannot be before start date.',
    );
    return;
  }

  setToDate(selectedDate);
};

  const authorities = [
    {
      id: 1,
      name: 'Subrata Mukherjee',
      designation: 'Project Manager',
    },
    {
      id: 2,
      name: 'Manas Mukherjee',
      designation: 'Project Manager',
    },
    {
      id: 3,
      name: 'Ujjwal Sinha',
      designation: 'Project Manager',
    },
    {
      id: 4,
      name: 'Pradip Ghosal',
      designation: 'Project Manager',
    },
  ];

  /*
   * Checkbox
   */
  const toggleAuthority = (id: number) => {
    setSelectedAuthorities(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }

      return [...prev, id];
    });
  };

  /*
   * Apply Leave
   */
  const handleApplyLeave = () => {
    const leaveRequest = {
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      duration,
      restrictedHoliday,
      reason,
    };

    console.log('Apply Leave Request:', leaveRequest);

    /*
     * Later:
     * API call can be added here.
     */
  };

  /*
   * Check if there is any restricted holiday between From Date and To Date
   */
  const hasRestrictedHoliday = () => {
    const current = new Date(fromDate);

    while (current <= toDate) {
      const formattedDate = current.toISOString().split('T')[0];

      const holiday = holidays.find(
        item => item.date === formattedDate && item.restricted,
      );

      if (holiday) {
        setRestrictedHolidayTwoDate(true);
        return true;
      }

      current.setDate(current.getDate() + 1);
    }

    return false;
  };

  useEffect(() => {
    if (!hasRestrictedHoliday()) {
      setRestrictedHolidayTwoDate(false);
      setRestrictedHoliday(false);
    }
  }, [fromDate, toDate]);

  /*
   * Calculate Net Leave Days
   */
  const calculateNetLeaveDays = () => {
    let count = 0;

    const current = new Date(fromDate);

    while (current <= toDate) {
      const day = current.getDay(); // 0 Sunday, 6 Saturday

      // Skip Saturday & Sunday
      if (day === 0 || day === 6) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      const formattedDate = current.toISOString().split('T')[0];

      const holiday = holidays.find(item => item.date === formattedDate);

      if (holiday) {
        // Restricted holiday
        if (holiday.restricted) {
          if (restrictedHoliday) {
            current.setDate(current.getDate() + 1);
            continue;
          }
        } else {
          // Normal Holiday
          current.setDate(current.getDate() + 1);
          continue;
        }
      }

      count++;

      current.setDate(current.getDate() + 1);
    }

    if (isSameDate) {
      if (duration === 'HALF_DAY') {
        return 0.5;
      }

      if (duration === 'QUARTERLY') {
        return 0;
      }
    }

    return count;
  };

  const getNextDate = (date: Date) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);

    return formatDateForCompare(next); // yyyy-MM-dd
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <TopBar
        title="Apply Leave"
        onMenuPress={() => setMenuVisible(prev => !prev)}
      />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ==============================
            Leave Balance
        ============================== */}

        <Text style={styles.sectionTitle}>Leave Balance</Text>

        <View style={styles.balanceRow}>
          {/* Total */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Leave</Text>

            <Text style={styles.totalValue}>{leaveBalance.totalLeave}</Text>
          </View>

          {/* Balance */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Balance Leave</Text>

            <Text style={styles.balanceValue}>{leaveBalance.balanceLeave}</Text>
          </View>

          {/* Restricted */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Restricted</Text>

            <Text style={styles.restrictedValue}>
              {leaveBalance.restrictedLeave}
            </Text>
          </View>
        </View>

        {/* ==============================
            From Date
        ============================== */}

        <Text style={styles.label}>From Date</Text>

        <TouchableOpacity
          style={styles.dateInput}
          activeOpacity={0.7}
          onPress={() => setShowFromPicker(!showFromPicker)}
        >
          {/* <Text style={styles.calendarIcon}>
            📅
          </Text> */}

          <Image
            source={require('../Assets/Icons/calendar.png')}
            style={styles.calendarIcon}
            resizeMode="contain"
          />

          <Text style={styles.dateText}>{formatDate(fromDate)}</Text>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        {/* 
        {showFromPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display={
              Platform.OS === 'ios'
                ? 'spinner'
                : 'default'
            }
            onChange={handleFromDateChange}
          />
        )} */}
        {showFromPicker && (
          <Calendar
            markingType="custom"
            markedDates={markedDates}
            onDayPress={handleFromDateChange}
          />
        )} 

        {/* ==============================
            To Date
        ============================== */}

        <Text style={styles.label}>To Date</Text>

        <TouchableOpacity
          style={styles.dateInput}
          activeOpacity={0.7}
          onPress={() => setShowToPicker(!showToPicker)}
        >
          {/* <Text style={styles.calendarIcon}>
            📅
          </Text> */}

          <Image
            source={require('../Assets/Icons/calendar.png')}
            style={styles.calendarIcon}
            resizeMode="contain"
          />

          <Text style={styles.dateText}>{formatDate(toDate)}</Text>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            minimumDate={fromDate}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleToDateChange}
          />
        )} */}
        {showToPicker && (
          <Calendar
            current={getNextDate(fromDate)}
            markingType="custom"
            markedDates={getToMarkedDates(fromDate, true)}
            onDayPress={handleToDateChange}
          />
        )} 
        {/* ==============================
            Duration
        ============================== */}

        <Text style={styles.label}>Duration</Text>

        <View style={styles.durationContainer}>
          {/* Full Day */}
          <TouchableOpacity
            style={[
              styles.durationOption,
              duration === 'FULL_DAY' && styles.durationOptionSelected,
            ]}
            activeOpacity={0.7}
            onPress={() => setDuration('FULL_DAY')}
          >
            <View
              style={[
                styles.radio,
                duration === 'FULL_DAY' && styles.radioSelected,
              ]}
            >
              {duration === 'FULL_DAY' && <View style={styles.radioDot} />}
            </View>

            <Text
              style={[
                styles.durationText,
                duration === 'FULL_DAY' && styles.durationTextSelected,
              ]}
            >
              Full Day
            </Text>
          </TouchableOpacity>

          {/* Half Day */}
          {canUsePartialLeave && (
            <TouchableOpacity
              style={[
                styles.durationOption,
                duration === 'HALF_DAY' && styles.durationOptionSelected,
              ]}
              activeOpacity={0.7}
              onPress={() => setDuration('HALF_DAY')}
            >
              <View
                style={[
                  styles.radio,
                  duration === 'HALF_DAY' && styles.radioSelected,
                ]}
              >
                {duration === 'HALF_DAY' && <View style={styles.radioDot} />}
              </View>

              <Text
                style={[
                  styles.durationText,
                  duration === 'HALF_DAY' && styles.durationTextSelected,
                ]}
              >
                Half Day
              </Text>
            </TouchableOpacity>
          )}

          {/* Quarterly Leave */}
          {canUsePartialLeave && (
            <TouchableOpacity
              style={[
                styles.durationOption,
                duration === 'QUARTERLY' && styles.durationOptionSelected,
              ]}
              activeOpacity={0.7}
              onPress={() => setDuration('QUARTERLY')}
            >
              <View
                style={[
                  styles.radio,
                  duration === 'QUARTERLY' && styles.radioSelected,
                ]}
              >
                {duration === 'QUARTERLY' && <View style={styles.radioDot} />}
              </View>

              <Text
                style={[
                  styles.durationText,
                  duration === 'QUARTERLY' && styles.durationTextSelected,
                ]}
              >
                Quarterly Leave
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ==============================
                  Duration
              ============================== */}

        <Text style={styles.label}>Net Leave Days</Text>

        <View style={styles.netLeaveCard}>
          <Text style={styles.netLeaveValue}>{calculateNetLeaveDays()}</Text>

          <Text style={styles.netLeaveLabel}>
            {calculateNetLeaveDays() === 1 ? 'Day' : 'Days'}
          </Text>
        </View>

        {/* ==============================
            Higher autority
        ============================== */}

        <Text style={styles.label}>Approval Authority</Text>

        <View style={styles.authorityCard}>
          {authorities.map(item => {
            const checked = selectedAuthorities.includes(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.authorityRow,
                  checked && styles.authorityRowSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => toggleAuthority(item.id)}
              >
                {/* Checkbox */}
                <View
                  style={[styles.checkbox, checked && styles.checkboxSelected]}
                >
                  {checked && <Text style={styles.checkMark}>✓</Text>}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.authorityName}>{item.name}</Text>

                  <Text style={styles.authorityDesignation}>
                    {item.designation}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ==============================
            Restricted Holiday
        ============================== */}

        {restrictedHolidayTwoDate && (
          <>
            <TouchableOpacity
              style={[
                styles.checkboxRow,
                restrictedHoliday && styles.checkboxRowSelected,
              ]}
              activeOpacity={0.7}
              onPress={() => setRestrictedHoliday(!restrictedHoliday)}
            >
              <View
                style={[
                  styles.checkbox,
                  restrictedHoliday && styles.checkboxSelected,
                ]}
              >
                {restrictedHoliday && <Text style={styles.checkmark}>✓</Text>}
              </View>

              <Text style={styles.checkboxLabel}>
                Want to add restricted holiday
              </Text>
            </TouchableOpacity>
          </>
        )}
        {/* ==============================
            Reason
        ============================== */}

        <Text style={styles.label}>Reason</Text>

        <TextInput
          style={styles.reasonInput}
          placeholder="Enter reason..."
          placeholderTextColor={Colors.textSecondary}
          value={reason}
          onChangeText={setReason}
          multiline
          textAlignVertical="top"
        />

        {/* ==============================
            Apply Button
        ============================== */}

        <TouchableOpacity
          style={styles.applyButton}
          activeOpacity={0.8}
          onPress={handleApplyLeave}
        >
          <Text style={styles.applyButtonText}>Apply Leave</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomBar selected={1} />

      {/* Side Menu */}
      <SideMenu
        visible={menuVisible}
        selected="Apply Leave"
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
};

export default ApplyLeave;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 25,
  },

  /* ==============================
     Balance
  ============================== */

  sectionTitle: {
    fontSize: 17,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
    marginBottom: 10,
  },

  balanceRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 8,
  },

  balanceCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 5,
    alignItems: 'center',
  },

  balanceLabel: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  totalValue: {
    marginTop: 5,
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },

  balanceValue: {
    marginTop: 5,
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: Colors.success,
  },

  restrictedValue: {
    marginTop: 5,
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: Colors.pending,
  },

  /* ==============================
     Form
  ============================== */

  label: {
    marginTop: 17,
    marginBottom: 7,
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },

  dateInput: {
    height: 52,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 14,
  },

  // calendarIcon: {
  //   fontSize: 18,
  //   marginRight: 10,
  // },

  calendarIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: Colors.primary,
  },

  dateText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.text,
    includeFontPadding: false, // Android
    textAlignVertical: 'center',
  },

  arrow: {
    fontSize: 27,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
    includeFontPadding: false, // Android
    textAlignVertical: 'center',
  },

  /* ==============================
     Duration
  ============================== */

  durationContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,

    padding: 8,

    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,
  },

  durationOption: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 13,

    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,

    backgroundColor: Colors.white,
  },

  durationOptionSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },

  radio: {
    width: 19,
    height: 19,

    borderRadius: 10,

    borderWidth: 1.5,
    borderColor: Colors.textSecondary,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 7,
  },

  radioSelected: {
    borderColor: Colors.primary,
  },

  radioDot: {
    width: 9,
    height: 9,

    borderRadius: 5,

    backgroundColor: Colors.primary,
  },

  durationText: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },

  durationTextSelected: {
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
  },

  /* ==============================
     Restricted Holiday
  ============================== */

  checkboxRow: {
    marginTop: 17,

    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 12,

    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: Colors.border,

    borderRadius: 10,
  },

  checkboxRowSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },

  checkbox: {
    width: 21,
    height: 21,

    borderRadius: 5,

    borderWidth: 1.5,
    borderColor: Colors.textSecondary,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 10,
  },

  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: FontFamily.bold,
  },

  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },

  /* ==============================
     Reason
  ============================== */

  reasonInput: {
    minHeight: 105,

    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: Colors.border,

    borderRadius: 10,

    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 13,

    fontSize: 14,
    fontFamily: FontFamily.regular,

    color: Colors.text,
  },

  /* ==============================
     Apply Button
  ============================== */

  applyButton: {
    height: 52,

    marginTop: 22,

    borderRadius: 10,

    backgroundColor: Colors.primary,

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 2,

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },

  applyButtonText: {
    color: Colors.white,

    fontSize: 16,

    fontFamily: FontFamily.semiBold,
  },

  /* ==============================
   Leave Summary
============================== */

  summaryCard: {
    backgroundColor: Colors.white,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: Colors.border,

    padding: 16,

    marginTop: 8,
  },

  summaryRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    paddingVertical: 7,
  },

  summaryLabel: {
    fontSize: 14,

    fontFamily: FontFamily.medium,

    color: Colors.textSecondary,
  },

  summaryValue: {
    fontSize: 15,

    fontFamily: FontFamily.semiBold,

    color: Colors.text,
  },

  summaryNegative: {
    fontSize: 15,

    fontFamily: FontFamily.semiBold,

    color: Colors.accent,
  },

  summaryDivider: {
    height: 1,

    backgroundColor: Colors.border,

    marginVertical: 10,
  },

  netLabel: {
    fontSize: 15,

    fontFamily: FontFamily.bold,

    color: Colors.text,
  },

  netValue: {
    fontSize: 17,

    fontFamily: FontFamily.bold,

    color: Colors.success,
  },

  netLeaveCard: {
    marginTop: 10,

    backgroundColor: Colors.primaryLight,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: Colors.primary,

    alignItems: 'center',

    paddingVertical: 20,

    marginBottom: 18,
  },

  netLeaveValue: {
    fontSize: 34,

    fontFamily: FontFamily.bold,

    color: Colors.primary,
  },

  netLeaveLabel: {
    marginTop: 4,

    fontSize: 15,

    fontFamily: FontFamily.medium,

    color: Colors.textSecondary,
  },

  /* ==============================
   Approval Authority
============================== */

  authorityCard: {
    backgroundColor: Colors.white,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: Colors.border,

    marginTop: 8,

    overflow: 'hidden',
  },

  authorityRow: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 16,

    paddingVertical: 15,

    borderBottomWidth: 1,

    borderBottomColor: '#F2F2F2',
  },

  authorityName: {
    fontSize: 15,

    fontFamily: FontFamily.semiBold,

    color: Colors.text,
  },

  authorityDesignation: {
    marginTop: 3,

    fontSize: 13,

    fontFamily: FontFamily.regular,

    color: Colors.textSecondary,
  },

  authorityRowSelected: {
    backgroundColor: Colors.primaryLight,
  },

  checkMark: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: FontFamily.bold,
  },
});
