import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

import {FontFamily} from '../GlobalFont/GlobalFont';
import Colors from '../Assets/Colors/Colors';

type LeaveDuration =
  | 'FULL_DAY'
  | 'HALF_DAY'
  | 'QUARTERLY';

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
  const [menuVisible, setMenuVisible] = useState(false);

  // Dates
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  // Date picker visibility
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // Duration
  const [duration, setDuration] =
    useState<LeaveDuration>('FULL_DAY');

  // Restricted Holiday
  const [restrictedHoliday, setRestrictedHoliday] =
    useState(false);

  // Reason
  const [reason, setReason] = useState('');

  /*
   * Check whether From Date and To Date
   * are the same day.
   */
  const isSameDate =
    fromDate.toDateString() === toDate.toDateString();

  /*
   * Half Day and Quarterly Leave are
   * available only when:
   *
   * 1. From Date = To Date
   * 2. Balance Leave > 0
   */
  const canUsePartialLeave =
    isSameDate &&
    leaveBalance.balanceLeave > 0;

  /*
   * If user selected Half Day / Quarterly
   * and then changes the date to multiple
   * days, automatically switch to Full Day.
   */
  useEffect(() => {
    if (
      !canUsePartialLeave &&
      duration !== 'FULL_DAY'
    ) {
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

  /*
   * From date change
   */
  const handleFromDateChange = (
    event: any,
    selectedDate?: Date,
  ) => {
    setShowFromPicker(false);

    if (!selectedDate) {
      return;
    }

    setFromDate(selectedDate);

    /*
     * If selected From Date is after
     * current To Date, update To Date.
     */
    if (selectedDate > toDate) {
      setToDate(selectedDate);
    }
  };

  /*
   * To date change
   */
  const handleToDateChange = (
    event: any,
    selectedDate?: Date,
  ) => {
    setShowToPicker(false);

    if (!selectedDate) {
      return;
    }

    /*
     * Don't allow To Date before From Date.
     */
    if (selectedDate < fromDate) {
      setToDate(fromDate);
      return;
    }

    setToDate(selectedDate);
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

    console.log(
      'Apply Leave Request:',
      leaveRequest,
    );

    /*
     * Later:
     * API call can be added here.
     */
  };

  return (
    <View style={styles.container}>

      {/* Top Bar */}
      <TopBar
        title="Apply Leave"
        onMenuPress={() =>
          setMenuVisible(prev => !prev)
        }
      />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ==============================
            Leave Balance
        ============================== */}

        <Text style={styles.sectionTitle}>
          Leave Balance
        </Text>

        <View style={styles.balanceRow}>

          {/* Total */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>
              Total Leave
            </Text>

            <Text style={styles.totalValue}>
              {leaveBalance.totalLeave}
            </Text>
          </View>

          {/* Balance */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>
              Balance Leave
            </Text>

            <Text style={styles.balanceValue}>
              {leaveBalance.balanceLeave}
            </Text>
          </View>

          {/* Restricted */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>
              Restricted
            </Text>

            <Text style={styles.restrictedValue}>
              {leaveBalance.restrictedLeave}
            </Text>
          </View>

        </View>

        {/* ==============================
            From Date
        ============================== */}

        <Text style={styles.label}>
          From Date
        </Text>

        <TouchableOpacity
          style={styles.dateInput}
          activeOpacity={0.7}
          onPress={() => setShowFromPicker(true)}>

          <Text style={styles.calendarIcon}>
            📅
          </Text>

          <Text style={styles.dateText}>
            {formatDate(fromDate)}
          </Text>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>

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
        )}

        {/* ==============================
            To Date
        ============================== */}

        <Text style={styles.label}>
          To Date
        </Text>

        <TouchableOpacity
          style={styles.dateInput}
          activeOpacity={0.7}
          onPress={() => setShowToPicker(true)}>

          <Text style={styles.calendarIcon}>
            📅
          </Text>

          <Text style={styles.dateText}>
            {formatDate(toDate)}
          </Text>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>

        {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            minimumDate={fromDate}
            display={
              Platform.OS === 'ios'
                ? 'spinner'
                : 'default'
            }
            onChange={handleToDateChange}
          />
        )}

        {/* ==============================
            Duration
        ============================== */}

        <Text style={styles.label}>
          Duration
        </Text>

        <View style={styles.durationContainer}>

          {/* Full Day */}
          <TouchableOpacity
            style={[
              styles.durationOption,
              duration === 'FULL_DAY' &&
                styles.durationOptionSelected,
            ]}
            activeOpacity={0.7}
            onPress={() =>
              setDuration('FULL_DAY')
            }>

            <View
              style={[
                styles.radio,
                duration === 'FULL_DAY' &&
                  styles.radioSelected,
              ]}>
              {duration === 'FULL_DAY' && (
                <View style={styles.radioDot} />
              )}
            </View>

            <Text
              style={[
                styles.durationText,
                duration === 'FULL_DAY' &&
                  styles.durationTextSelected,
              ]}>
              Full Day
            </Text>

          </TouchableOpacity>

          {/* Half Day */}
          {canUsePartialLeave && (
            <TouchableOpacity
              style={[
                styles.durationOption,
                duration === 'HALF_DAY' &&
                  styles.durationOptionSelected,
              ]}
              activeOpacity={0.7}
              onPress={() =>
                setDuration('HALF_DAY')
              }>

              <View
                style={[
                  styles.radio,
                  duration === 'HALF_DAY' &&
                    styles.radioSelected,
                ]}>
                {duration === 'HALF_DAY' && (
                  <View style={styles.radioDot} />
                )}
              </View>

              <Text
                style={[
                  styles.durationText,
                  duration === 'HALF_DAY' &&
                    styles.durationTextSelected,
                ]}>
                Half Day
              </Text>

            </TouchableOpacity>
          )}

          {/* Quarterly Leave */}
          {canUsePartialLeave && (
            <TouchableOpacity
              style={[
                styles.durationOption,
                duration === 'QUARTERLY' &&
                  styles.durationOptionSelected,
              ]}
              activeOpacity={0.7}
              onPress={() =>
                setDuration('QUARTERLY')
              }>

              <View
                style={[
                  styles.radio,
                  duration === 'QUARTERLY' &&
                    styles.radioSelected,
                ]}>
                {duration === 'QUARTERLY' && (
                  <View style={styles.radioDot} />
                )}
              </View>

              <Text
                style={[
                  styles.durationText,
                  duration === 'QUARTERLY' &&
                    styles.durationTextSelected,
                ]}>
                Quarterly Leave
              </Text>

            </TouchableOpacity>
          )}

        </View>

        {/* ==============================
            Restricted Holiday
        ============================== */}

        <TouchableOpacity
          style={[
            styles.checkboxRow,
            restrictedHoliday &&
              styles.checkboxRowSelected,
          ]}
          activeOpacity={0.7}
          onPress={() =>
            setRestrictedHoliday(
              !restrictedHoliday,
            )
          }>

          <View
            style={[
              styles.checkbox,
              restrictedHoliday &&
                styles.checkboxSelected,
            ]}>

            {restrictedHoliday && (
              <Text style={styles.checkmark}>
                ✓
              </Text>
            )}

          </View>

          <Text style={styles.checkboxLabel}>
            Want to add restricted holiday
          </Text>

        </TouchableOpacity>

        {/* ==============================
            Reason
        ============================== */}

        <Text style={styles.label}>
          Reason
        </Text>

        <TextInput
          style={styles.reasonInput}
          placeholder="Enter reason..."
          placeholderTextColor={
            Colors.textSecondary
          }
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
          onPress={handleApplyLeave}>

          <Text style={styles.applyButtonText}>
            Apply Leave
          </Text>

        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navigation */}
      <BottomBar selected={1} />

      {/* Side Menu */}
      <SideMenu
        visible={menuVisible}
        selected="Apply Leave"
        onClose={() =>
          setMenuVisible(false)
        }
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

  calendarIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  dateText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.text,
  },

  arrow: {
    fontSize: 27,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
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
});