import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

import {FontFamily} from '../GlobalFont/GlobalFont';
import Colors from '../Assets/Colors/Colors';

import Calendar from 'react-native-calendars/src/calendar';

import {
  getApplyLeaveMeta,
  ApplyLeaveDataModel,
  ApplyLeaveHolidayModel,
  ExistingLeaveModel,
  LeaveAuthorityModel,
} from '../Services/ApplyLeaveGetDataService';

import {getCurrentUser} from '../Services/AuthSession';

type LeaveDuration =
  | 'FULL_DAY'
  | 'HALF_DAY'
  | 'QUARTERLY';

const ApplyLeave = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
  isMountedRef.current = true;

  return () => {
    isMountedRef.current = false;
  };
}, []);

const showAlert = useCallback(
  (title: string, message: string, onPress?: () => void) => {
    if (!isMountedRef.current) {
      return;
    }

    setTimeout(() => {
      if (!isMountedRef.current) {
        return;
      }

      Alert.alert(
        title,
        message,
        [
          {
            text: 'OK',
            onPress,
          },
        ],
        {
          cancelable: true,
        },
      );
    }, 100);
  },
  [],
);
  /* ============================================================
     MENU
  ============================================================ */

  const [menuVisible, setMenuVisible] =
    useState(false);

  /* ============================================================
     API DATA
  ============================================================ */

  const [metaData, setMetaData] =
    useState<ApplyLeaveDataModel | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  /* ============================================================
     API DATA SHORTCUTS
  ============================================================ */

  const leaveBalance = metaData?.leaveBalance ?? {
    totalLeave: 0,
    balanceLeave: 0,
    restrictedLeave: 0,
    quarterlyLeave: 0,
  };

  const holidays: ApplyLeaveHolidayModel[] =
    metaData?.holidays ?? [];

  const leave: ExistingLeaveModel[] =
    metaData?.leave ?? [];

  const authorities: LeaveAuthorityModel[] =
    metaData?.authorities ?? [];

  /* ============================================================
     FETCH APPLY LEAVE META
  ============================================================ */

  const fetchApplyLeaveMeta = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response =
        await getApplyLeaveMeta();

      setMetaData(response);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load leave details',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplyLeaveMeta();
  }, []);

  /* ============================================================
     DATES
  ============================================================ */

  const [fromDate, setFromDate] =
    useState(new Date());

  const [toDate, setToDate] =
    useState(new Date());

  /* ============================================================
     DATE PICKER
  ============================================================ */

  const [showFromPicker, setShowFromPicker] =
    useState(false);

  const [showToPicker, setShowToPicker] =
    useState(false);

  /* ============================================================
     DURATION
  ============================================================ */

  const [duration, setDuration] =
    useState<LeaveDuration>('FULL_DAY');

  /* ============================================================
     RESTRICTED HOLIDAY
  ============================================================ */

  const [restrictedHoliday, setRestrictedHoliday] =
    useState(false);

  const [
    restrictedHolidayTwoDate,
    setRestrictedHolidayTwoDate,
  ] = useState(false);

  /* ============================================================
     REASON
  ============================================================ */

  const [reason, setReason] =
    useState('');

  /* ============================================================
     AUTHORITIES
  ============================================================ */

  const [
    selectedAuthorities,
    setSelectedAuthorities,
  ] = useState<number[]>([]);

  /* ============================================================
     SAME DATE
  ============================================================ */

  const isSameDate =
    fromDate.toDateString() ===
    toDate.toDateString();

  /* ============================================================
     PARTIAL LEAVE
  ============================================================ */

  const canUsePartialLeave =
    isSameDate &&
    leaveBalance.balanceLeave > 0;

  useEffect(() => {
    if (
      !canUsePartialLeave &&
      duration !== 'FULL_DAY'
    ) {
      setDuration('FULL_DAY');
    }
  }, [
    canUsePartialLeave,
    duration,
  ]);

  /* ============================================================
     FORMAT DATE
  ============================================================ */

  const formatDate = (date: Date) => {
    const day = String(
      date.getDate(),
    ).padStart(2, '0');

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

    const month =
      monthNames[date.getMonth()];

    const year =
      date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  /* ============================================================
     FORMAT DATE FOR COMPARISON
  ============================================================ */

  const formatDateForCompare = (
    date: Date,
  ) => {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
      date.getDate(),
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  /* ============================================================
     MINIMUM FROM DATE
     
     Previous behavior:
     allow dates from one month before today.
  ============================================================ */

  const getFromDateMinDate = () => {
    const minDate = new Date();

    minDate.setHours(
      0,
      0,
      0,
      0,
    );

    minDate.setMonth(
      minDate.getMonth() - 1,
    );

    return minDate;
  };

  /* ============================================================
     WEEKEND
  ============================================================ */

  const isWeekend = (date: Date) => {
    const day =
      date.getDay();

    return (
      day === 0 ||
      day === 6
    );
  };

  /* ============================================================
     HOLIDAY
  ============================================================ */

  const isHoliday = (date: Date) => {
    const dateString =
      formatDateForCompare(date);

    return holidays.some(
      item =>
        item.date === dateString &&
        !item.restricted,
    );
  };

  /* ============================================================
     EXISTING LEAVE
  ============================================================ */

  const isDateInLeaveRange = (
    date: Date,
  ) => {
    const dateString =
      formatDateForCompare(date);

    return leave.some(item => {
      return (
        dateString >=
          item.from_date &&
        dateString <=
          item.to_date
      );
    });
  };

  /* ============================================================
     GET LEAVE FOR DATE
  ============================================================ */

  const getLeaveForDate = (
    date: Date,
  ) => {
    const dateString =
      formatDateForCompare(date);

    return leave.find(item => {
      return (
        dateString >=
          item.from_date &&
        dateString <=
          item.to_date
      );
    });
  };

  /* ============================================================
     FORMAT LEAVE RANGE
  ============================================================ */

  const formatLeaveDateRange = (
    fromDateString: string,
    toDateString: string,
  ) => {
    const from = new Date(
      `${fromDateString}T00:00:00`,
    );

    const to = new Date(
      `${toDateString}T00:00:00`,
    );

    if (
      fromDateString ===
      toDateString
    ) {
      return formatDate(from);
    }

    return `${formatDate(
      from,
    )} - ${formatDate(to)}`;
  };

  /* ============================================================
     GET MARKED DATES
  ============================================================ */

  const getMarkedDates = (
    restrictedEnabled: boolean,
  ) => {
    const marked: any = {};

    const years: number[] =
      holidays.map(item =>
        Number(
          item.date.substring(0, 4),
        ),
      );

    leave.forEach(item => {
      years.push(
        Number(
          item.from_date.substring(
            0,
            4,
          ),
        ),
      );

      years.push(
        Number(
          item.to_date.substring(
            0,
            4,
          ),
        ),
      );
    });

    if (years.length === 0) {
      return marked;
    }

    const startYear =
      Math.min(...years);

    const endYear =
      Math.max(...years);

    const current =
      new Date(
        startYear,
        0,
        1,
      );

    const last =
      new Date(
        endYear,
        11,
        31,
      );

    const minFromDate =
      getFromDateMinDate();

    /* ----------------------------------------------------------
       Base disabled dates
    ---------------------------------------------------------- */

    while (current <= last) {
      const dateKey =
        formatDateForCompare(
          current,
        );

      if (
        current <
        minFromDate
      ) {
        marked[dateKey] = {
          disabled: true,
          disableTouchEvent: true,

          customStyles: {
            container: {
              backgroundColor:
                '#F5F5F5',
            },

            text: {
              color:
                '#C0C0C0',
            },
          },
        };
      } else if (
        isWeekend(current)
      ) {
        marked[dateKey] = {
          disabled: true,
          disableTouchEvent: true,

          customStyles: {
            container: {
              backgroundColor:
                '#F5F5F5',
            },

            text: {
              color:
                '#BDBDBD',
            },
          },
        };
      }

      current.setDate(
        current.getDate() + 1,
      );
    }

    /* ----------------------------------------------------------
       Existing Leave
    ---------------------------------------------------------- */

    leave.forEach(item => {
      const leaveStart =
        new Date(
          `${item.from_date}T00:00:00`,
        );

      const leaveEnd =
        new Date(
          `${item.to_date}T00:00:00`,
        );

      const currentLeaveDate =
        new Date(leaveStart);

      while (
        currentLeaveDate <=
        leaveEnd
      ) {
        const dateKey =
          formatDateForCompare(
            currentLeaveDate,
          );

        marked[dateKey] = {
          ...(marked[dateKey] || {}),

          disabled: true,
          disableTouchEvent: true,

          customStyles: {
            container: {
              backgroundColor:
                '#E8F7EE',
            },

            text: {
              color:
                '#22A05A',
              fontWeight:
                '700',
            },
          },
        };

        currentLeaveDate.setDate(
          currentLeaveDate.getDate() +
            1,
        );
      }
    });

    /* ----------------------------------------------------------
       Holidays
    ---------------------------------------------------------- */

    holidays.forEach(item => {
      const existing =
        marked[item.date] || {};

      if (!item.restricted) {
        marked[item.date] = {
          ...existing,

          disabled: true,
          disableTouchEvent: true,

          customStyles: {
            container: {
              backgroundColor:
                '#FCEAEC',
            },

            text: {
              color:
                '#E31B2D',
              fontWeight:
                '700',
            },
          },
        };
      } else {
        const holidayDate =
          new Date(
            `${item.date}T00:00:00`,
          );

        if (
          holidayDate >=
          minFromDate
        ) {
          marked[item.date] = {
            ...existing,

            disabled: false,
            disableTouchEvent:
              false,

            customStyles: {
              container: {
                backgroundColor:
                  '#FFF7E6',
              },

              text: {
                color:
                  '#F59E0B',
                fontWeight:
                  '700',
              },
            },
          };
        }
      }
    });

    return marked;
  };

  /* ============================================================
     GET TO-DATE MARKED DATES
  ============================================================ */

  const getToMarkedDates = (
    selectedFromDate: Date,
    restrictedEnabled: boolean,
  ) => {
    const marked: any = {};

    const years: number[] =
      holidays.map(item =>
        Number(
          item.date.substring(0, 4),
        ),
      );

    leave.forEach(item => {
      years.push(
        Number(
          item.from_date.substring(
            0,
            4,
          ),
        ),
      );

      years.push(
        Number(
          item.to_date.substring(
            0,
            4,
          ),
        ),
      );
    });

    if (years.length === 0) {
      return marked;
    }

    const startYear =
      Math.min(...years);

    const endYear =
      Math.max(...years);

    const current =
      new Date(
        startYear,
        0,
        1,
      );

    const last =
      new Date(
        endYear,
        11,
        31,
      );

    const minDate =
      new Date(
        selectedFromDate,
      );

    minDate.setHours(
      0,
      0,
      0,
      0,
    );

    /* ----------------------------------------------------------
       Base dates
    ---------------------------------------------------------- */

    while (current <= last) {
      const dateKey =
        formatDateForCompare(
          current,
        );

      if (
        current <
        minDate
      ) {
        marked[dateKey] = {
          disabled: true,
          disableTouchEvent: true,

          customStyles: {
            container: {
              backgroundColor:
                '#F5F5F5',
            },

            text: {
              color:
                '#C0C0C0',
            },
          },
        };
      } else if (
        isWeekend(current)
      ) {
        marked[dateKey] = {
          disabled: true,
          disableTouchEvent: true,

          customStyles: {
            container: {
              backgroundColor:
                '#F5F5F5',
            },

            text: {
              color:
                '#BDBDBD',
            },
          },
        };
      }

      current.setDate(
        current.getDate() + 1,
      );
    }

    /* ----------------------------------------------------------
       Existing Leave
    ---------------------------------------------------------- */

    leave.forEach(item => {
      const leaveStart =
        new Date(
          `${item.from_date}T00:00:00`,
        );

      const leaveEnd =
        new Date(
          `${item.to_date}T00:00:00`,
        );

      const currentLeaveDate =
        new Date(leaveStart);

      while (
        currentLeaveDate <=
        leaveEnd
      ) {
        const dateKey =
          formatDateForCompare(
            currentLeaveDate,
          );

        marked[dateKey] = {
          ...(marked[dateKey] || {}),

          disabled: true,
          disableTouchEvent: true,

          customStyles: {
            container: {
              backgroundColor:
                '#E8F7EE',
            },

            text: {
              color:
                '#22A05A',
              fontWeight:
                '700',
            },
          },
        };

        currentLeaveDate.setDate(
          currentLeaveDate.getDate() +
            1,
        );
      }
    });

    /* ----------------------------------------------------------
       Holidays
    ---------------------------------------------------------- */

    holidays.forEach(item => {
      const existing =
        marked[item.date] || {};

      if (!item.restricted) {
        marked[item.date] = {
          ...existing,

          disabled: true,
          disableTouchEvent: true,

          customStyles: {
            container: {
              backgroundColor:
                '#FCEAEC',
            },

            text: {
              color:
                '#E31B2D',
              fontWeight:
                '700',
            },
          },
        };
      } else {
        const holidayDate =
          new Date(
            `${item.date}T00:00:00`,
          );

        if (
          holidayDate >=
          minDate
        ) {
          marked[item.date] = {
            ...existing,

            disabled: false,
            disableTouchEvent:
              false,

            customStyles: {
              container: {
                backgroundColor:
                  '#FFF7E6',
              },

              text: {
                color:
                  '#F59E0B',
                fontWeight:
                  '700',
              },
            },
          };
        }
      }
    });

    return marked;
  };

  /* ============================================================
     MEMOIZED MARKED DATES
  ============================================================ */

  const markedDates = useMemo(() => {
    return getMarkedDates(
      restrictedHoliday,
    );
  }, [
    restrictedHoliday,
    metaData,
  ]);

  /* ============================================================
     EXISTING LEAVE ALERT
  ============================================================ */

  const showExistingLeaveAlert = (
    date: Date,
  ) => {
    const existingLeave =
      getLeaveForDate(date);

    if (!existingLeave) {
      return false;
    }

    const leaveDateText =
      formatLeaveDateRange(
        existingLeave.from_date,
        existingLeave.to_date,
      );

    Alert.alert(
      'Leave Already Taken',
      `You already have leave on ${leaveDateText}.`,
    );

    return true;
  };

  /* ============================================================
     FROM DATE CHANGE
  ============================================================ */

  const handleFromDateChange = (
    day: any,
  ) => {
    const pickedDate =
      new Date(
        `${day.dateString}T00:00:00`,
      );

    if (
      showExistingLeaveAlert(
        pickedDate,
      )
    ) {
      return;
    }

    const weekDay =
      pickedDate.getDay();

    if (
      weekDay === 0 ||
      weekDay === 6
    ) {
      Alert.alert(
        'Invalid Date',
        'Weekend cannot be selected.',
      );

      return;
    }

    const holiday =
      holidays.find(
        item =>
          item.date ===
          day.dateString,
      );

    if (
      holiday &&
      !holiday.restricted
    ) {
      Alert.alert(
        'Holiday',
        `${holiday.name} is a public holiday.`,
      );

      return;
    }

    setFromDate(
      pickedDate,
    );

    if (
      pickedDate >
      toDate
    ) {
      setToDate(
        pickedDate,
      );
    }

    setShowFromPicker(
      false,
    );
  };

  /* ============================================================
     TO DATE CHANGE
  ============================================================ */

  const handleToDateChange = (
    day: any,
  ) => {
    const selectedDate =
      new Date(
        `${day.dateString}T00:00:00`,
      );

    const weekDay =
      selectedDate.getDay();

    if (
      weekDay === 0 ||
      weekDay === 6
    ) {
      Alert.alert(
        'Invalid Date',
        'Saturday and Sunday cannot be selected.',
      );

      return;
    }

    const holiday =
      holidays.find(
        item =>
          item.date ===
          day.dateString,
      );

    if (
      holiday &&
      !holiday.restricted
    ) {
      Alert.alert(
        'Holiday',
        `${holiday.name} is a public holiday.`,
      );

      return;
    }

    if (
      selectedDate <
      fromDate
    ) {
      Alert.alert(
        'Invalid Date',
        'End date cannot be before start date.',
      );

      return;
    }

    const overlappingLeave =
      getOverlappingLeave(
        fromDate,
        selectedDate,
      );

    if (overlappingLeave) {
      const leaveDateText =
        formatLeaveDateRange(
          overlappingLeave.from_date,
          overlappingLeave.to_date,
        );

      Alert.alert(
        'Leave Already Taken',
        `You already have leave on ${leaveDateText}.`,
      );

      return;
    }

    setToDate(
      selectedDate,
    );

    setShowToPicker(
      false,
    );
  };

  /* ============================================================
     OVERLAPPING LEAVE
  ============================================================ */

  const getOverlappingLeave = (
    startDate: Date,
    endDate: Date,
  ) => {
    const start =
      formatDateForCompare(
        startDate,
      );

    const end =
      formatDateForCompare(
        endDate,
      );

    return leave.find(item => {
      return (
        item.from_date <=
          end &&
        item.to_date >=
          start
      );
    });
  };

  /* ============================================================
     AUTHORITY CHECKBOX
  ============================================================ */

  const toggleAuthority = (
    employee_id: number,
  ) => {
    setSelectedAuthorities(
      previous => {
        if (
          previous.includes(employee_id)
        ) {
          return previous.filter(
            item => item !== employee_id,
          );
        }

        return [
          ...previous,
          employee_id,
        ];
      },
    );
  };

  /* ============================================================
     APPLY LEAVE
  ============================================================ */

 
const handleApplyLeave = () => {
  console.log('Apply Leave button clicked');

  // ============================================================
  // GET CURRENT USER
  // ============================================================

  const currentUser = getCurrentUser();

  console.log('Current User:', currentUser);

  const employeeId = currentUser?.employeeId;

  // ============================================================
  // EMPLOYEE ID VALIDATION
  // ============================================================

  if (
    employeeId === undefined ||
    employeeId === null ||
    String(employeeId).trim() === ''
  ) {
    showAlert('Validation', 'Employee ID is required.');
    return;
  }

  // ============================================================
  // FROM DATE VALIDATION
  // ============================================================

  if (!(fromDate instanceof Date) || isNaN(fromDate.getTime())) {
    showAlert('Validation', 'Please select From Date.');
    return;
  }

  // ============================================================
  const fromDateOnly = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate(),
  );

  const toDateOnly = new Date(
    toDate.getFullYear(),
    toDate.getMonth(),
    toDate.getDate(),
  );

  if (fromDateOnly > toDateOnly) {
    showAlert('Validation', 'To Date cannot be earlier than From Date.');
    return;
  }

  // ============================================================
  // DURATION VALIDATION
  // ============================================================

  if (
    duration !== 'FULL_DAY' &&
    duration !== 'HALF_DAY' &&
    duration !== 'QUARTERLY'
  ) {
    showAlert('Validation', 'Please select Duration.');
    return;
  }

  // ============================================================
  // PARTIAL LEAVE VALIDATION
  // ============================================================

  if (
    (duration === 'HALF_DAY' ||
      duration === 'QUARTERLY') &&
    !isSameDate
  ) {
    showAlert('Validation', 'Half Day or Quarterly Leave can only be applied for a single day.');
    return;
  }

  // ============================================================
  // HALF DAY BALANCE VALIDATION
  // ============================================================

  if (
    duration === 'HALF_DAY' &&
    leaveBalance.balanceLeave <= 0
  ) {
    showAlert('Validation', 'You do not have sufficient leave balance for Half Day Leave.');
    return;
  }

  // ============================================================
  // QUARTERLY BALANCE VALIDATION
  // ============================================================

  if (
    duration === 'QUARTERLY' &&
    leaveBalance.quarterlyLeave <= 0
  ) {
    showAlert('Validation', 'You do not have sufficient Quarterly Leave balance.');
    return;
  }

  // ============================================================
  // AUTHORITY VALIDATION
  // ============================================================

  if (
    !Array.isArray(selectedAuthorities) ||
    selectedAuthorities.length === 0
  ) {
    showAlert('Validation', 'Please select at least one approval authority.');
    return;
  }

  // ============================================================
  // REASON VALIDATION
  // ============================================================

  const trimmedReason = reason.trim();

  if (trimmedReason.length === 0) {
    showAlert('Validation', 'Please enter a reason.');
    return;
  }

  // ============================================================
  // CALCULATE NUMBER OF DAYS
  // ============================================================

  let noOfDays = 0;

  const currentDate = new Date(fromDateOnly);

  while (currentDate <= toDateOnly) {
    const day = currentDate.getDay();

    // Skip Saturday and Sunday
    if (day !== 0 && day !== 6) {
      const dateString =
        formatDateForCompare(currentDate);

      const holiday = holidays.find(
        item => item.date === dateString,
      );

      // Skip public holiday
      if (holiday && !holiday.restricted) {
        currentDate.setDate(
          currentDate.getDate() + 1,
        );
        continue;
      }

      // Skip restricted holiday when not selected
      if (
        holiday &&
        holiday.restricted &&
        !restrictedHoliday
      ) {
        currentDate.setDate(
          currentDate.getDate() + 1,
        );
        continue;
      }

      noOfDays++;
    }

    currentDate.setDate(
      currentDate.getDate() + 1,
    );
  }

  // ============================================================
  // PARTIAL LEAVE DAYS
  // ============================================================

  if (isSameDate) {
    if (duration === 'HALF_DAY') {
      noOfDays = 0.5;
    } else if (duration === 'QUARTERLY') {
      noOfDays = 0.25;
    }
  }

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatApiDate = (date: Date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
      date.getDate(),
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // ============================================================
  // FORMAT DURATION
  // ============================================================

  let formattedDuration = 'Full Day';

  if (duration === 'HALF_DAY') {
    formattedDuration = 'HALF DAY';
  } else if (duration === 'QUARTERLY') {
    formattedDuration = 'QUARTERLY';
  }

  // ============================================================
  // MANAGER IDs
  // ============================================================

  const managerId =
    selectedAuthorities.join(',');

  // ============================================================
  // API REQUEST
  // ============================================================

  const leaveRequest = {
    employee_id: employeeId,
    start_date: formatApiDate(fromDate),
    end_date: formatApiDate(toDate),
    duration: formattedDuration,
    is_restricted: restrictedHoliday,
    no_of_days: noOfDays,
    reason: trimmedReason,
    manager_id: managerId,
    leave_type: formattedDuration,
  };

  console.log(
    'Apply Leave Request:',
    JSON.stringify(
      leaveRequest,
      null,
      2,
    ),
  );

  // ============================================================
  // API CALL
  // ============================================================

  // Example:
  //
  // try {
  //   setApplyingLeave(true);
  //
  //   const response = await applyLeave(leaveRequest);
  //
  //   showAlert('Success', response.message || 'Leave applied successfully.');
  // } catch (error) {
  //   showAlert('Error', error instanceof Error ? error.message : 'Unable to apply leave.');
  //     'Error',
  //     error instanceof Error
  //       ? error.message
  //       : 'Unable to apply leave.',
  //   );
  // } finally {
  //   setApplyingLeave(false);
  // }
};






  /* ============================================================
     CHECK RESTRICTED HOLIDAY
  ============================================================ */

  const hasRestrictedHoliday = () => {
    const current =
      new Date(fromDate);

    current.setHours(
      0,
      0,
      0,
      0,
    );

    const endDate =
      new Date(toDate);

    endDate.setHours(
      0,
      0,
      0,
      0,
    );

    while (
      current <=
      endDate
    ) {
      const formattedDate =
        formatDateForCompare(
          current,
        );

      const holiday =
        holidays.find(
          item =>
            item.date ===
              formattedDate &&
            item.restricted,
        );

      if (holiday) {
        setRestrictedHolidayTwoDate(
          true,
        );

        return true;
      }

      current.setDate(
        current.getDate() + 1,
      );
    }

    return false;
  };

  useEffect(() => {
    if (
      !hasRestrictedHoliday()
    ) {
      setRestrictedHolidayTwoDate(
        false,
      );

      setRestrictedHoliday(
        false,
      );
    }
  }, [
    fromDate,
    toDate,
    metaData,
  ]);

  /* ============================================================
     CALCULATE NET LEAVE DAYS

     Weekends and public holidays are excluded.

     Restricted holiday is excluded only when the user
     chooses to include it.
  ============================================================ */

  const calculateNetLeaveDays = () => {
    let count = 0;

    const current =
      new Date(fromDate);

    current.setHours(
      0,
      0,
      0,
      0,
    );

    const endDate =
      new Date(toDate);

    endDate.setHours(
      0,
      0,
      0,
      0,
    );

    while (
      current <=
      endDate
    ) {
      const day =
        current.getDay();

      /* Skip Saturday and Sunday */

      if (
        day === 0 ||
        day === 6
      ) {
        current.setDate(
          current.getDate() + 1,
        );

        continue;
      }

      const formattedDate =
        formatDateForCompare(
          current,
        );

      const holiday =
        holidays.find(
          item =>
            item.date ===
            formattedDate,
        );

      if (holiday) {
        /* Public holiday */

        if (
          !holiday.restricted
        ) {
          current.setDate(
            current.getDate() + 1,
          );

          continue;
        }

        /* Restricted holiday */

        if (
          holiday.restricted &&
          restrictedHoliday
        ) {
          current.setDate(
            current.getDate() + 1,
          );

          continue;
        }
      }

      count++;

      current.setDate(
        current.getDate() + 1,
      );
    }

    /* Same day partial leave */

    if (isSameDate) {
      if (
        duration ===
        'HALF_DAY'
      ) {
        return 0.5;
      }

      if (
        duration ===
        'QUARTERLY'
      ) {
        return 0;
      }
    }

    return count;
  };

  /* ============================================================
     NEXT DATE
  ============================================================ */

  const getNextDate = (
    date: Date,
  ) => {
    const next =
      new Date(date);

    next.setDate(
      next.getDate() + 1,
    );

    return formatDateForCompare(
      next,
    );
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <View
      style={styles.container}
    >
      {/* ======================================================
          TOP BAR
      ====================================================== */}

      <TopBar
        title="Apply Leave"
        onMenuPress={() =>
          setMenuVisible(
            previous =>
              !previous,
          )
        }
      />

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <View
            style={
              styles.loadingContainer
            }
          >
            <ActivityIndicator
              size="large"
              color={
                Colors.primary
              }
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading leave details...
            </Text>
          </View>
        )}

        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading &&
          errorMessage !== '' && (
            <View
              style={
                styles.errorContainer
              }
            >
              <Text
                style={
                  styles.errorText
                }
              >
                {errorMessage}
              </Text>

              <TouchableOpacity
                style={
                  styles.retryButton
                }
                activeOpacity={0.8}
                onPress={
                  fetchApplyLeaveMeta
                }
              >
                <Text
                  style={
                    styles.retryButtonText
                  }
                >
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          )}

        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}

        {!loading &&
          errorMessage === '' && (
            <>
              {/* ==============================================
                  LEAVE BALANCE
              ============================================== */}

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Leave Balance
              </Text>

              <View
                style={
                  styles.balanceRow
                }
              >
                {/* Total */}

                <View
                  style={
                    styles.balanceCard
                  }
                >
                  <Text
                    style={
                      styles.balanceLabel
                    }
                  >
                    Total Leave
                  </Text>

                  <Text
                    style={
                      styles.totalValue
                    }
                  >
                    {
                      leaveBalance.totalLeave
                    }
                  </Text>
                </View>

                {/* Balance */}

                <View
                  style={
                    styles.balanceCard
                  }
                >
                  <Text
                    style={
                      styles.balanceLabel
                    }
                  >
                    Balance Leave
                  </Text>

                  <Text
                    style={
                      styles.balanceValue
                    }
                  >
                    {
                      leaveBalance.balanceLeave
                    }
                  </Text>
                </View>

                {/* Restricted */}

                <View
                  style={
                    styles.balanceCard
                  }
                >
                  <Text
                    style={
                      styles.balanceLabel
                    }
                  >
                    Restricted
                  </Text>

                  <Text
                    style={
                      styles.restrictedValue
                    }
                  >
                    {
                      leaveBalance.restrictedLeave
                    }
                  </Text>
                </View>
              </View>

              {/* ==============================================
                  FROM DATE
              ============================================== */}

              <Text
                style={
                  styles.label
                }
              >
                From Date
              </Text>

              <TouchableOpacity
                style={
                  styles.dateInput
                }
                activeOpacity={0.7}
                onPress={() => {
                  setShowToPicker(
                    false,
                  );

                  setShowFromPicker(
                    previous =>
                      !previous,
                  );
                }}
              >
                <Image
                  source={require('../Assets/Icons/calendar.png')}
                  style={
                    styles.calendarIcon
                  }
                  resizeMode="contain"
                />

                <Text
                  style={
                    styles.dateText
                  }
                >
                  {formatDate(
                    fromDate,
                  )}
                </Text>

                <Text
                  style={
                    styles.arrow
                  }
                >
                  ›
                </Text>
              </TouchableOpacity>

              {showFromPicker && (
                <Calendar
                  markingType="custom"
                  markedDates={
                    markedDates
                  }
                  onDayPress={
                    handleFromDateChange
                  }
                />
              )}

              {/* ==============================================
                  TO DATE
              ============================================== */}

              <Text
                style={
                  styles.label
                }
              >
                To Date
              </Text>

              <TouchableOpacity
                style={
                  styles.dateInput
                }
                activeOpacity={0.7}
                onPress={() => {
                  setShowFromPicker(
                    false,
                  );

                  setShowToPicker(
                    previous =>
                      !previous,
                  );
                }}
              >
                <Image
                  source={require('../Assets/Icons/calendar.png')}
                  style={
                    styles.calendarIcon
                  }
                  resizeMode="contain"
                />

                <Text
                  style={
                    styles.dateText
                  }
                >
                  {formatDate(
                    toDate,
                  )}
                </Text>

                <Text
                  style={
                    styles.arrow
                  }
                >
                  ›
                </Text>
              </TouchableOpacity>

              {showToPicker && (
                <Calendar
                  current={getNextDate(
                    fromDate,
                  )}
                  markingType="custom"
                  markedDates={getToMarkedDates(
                    fromDate,
                    restrictedHoliday,
                  )}
                  onDayPress={
                    handleToDateChange
                  }
                />
              )}

              {/* ==============================================
                  DURATION
              ============================================== */}

              <Text
                style={
                  styles.label
                }
              >
                Duration
              </Text>

              <View
                style={
                  styles.durationContainer
                }
              >
                {/* Full Day */}

                <TouchableOpacity
                  style={[
                    styles.durationOption,
                    duration ===
                      'FULL_DAY' &&
                      styles.durationOptionSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() =>
                    setDuration(
                      'FULL_DAY',
                    )
                  }
                >
                  <View
                    style={[
                      styles.radio,
                      duration ===
                        'FULL_DAY' &&
                        styles.radioSelected,
                    ]}
                  >
                    {duration ===
                      'FULL_DAY' && (
                      <View
                        style={
                          styles.radioDot
                        }
                      />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.durationText,
                      duration ===
                        'FULL_DAY' &&
                        styles.durationTextSelected,
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
                      duration ===
                        'HALF_DAY' &&
                        styles.durationOptionSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() =>
                      setDuration(
                        'HALF_DAY',
                      )
                    }
                  >
                    <View
                      style={[
                        styles.radio,
                        duration ===
                          'HALF_DAY' &&
                          styles.radioSelected,
                      ]}
                    >
                      {duration ===
                        'HALF_DAY' && (
                        <View
                          style={
                            styles.radioDot
                          }
                        />
                      )}
                    </View>

                    <Text
                      style={[
                        styles.durationText,
                        duration ===
                          'HALF_DAY' &&
                          styles.durationTextSelected,
                      ]}
                    >
                      Half Day
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Quarterly */}

                {canUsePartialLeave &&
                  leaveBalance.quarterlyLeave >
                    0 && (
                    <TouchableOpacity
                      style={[
                        styles.durationOption,
                        duration ===
                          'QUARTERLY' &&
                          styles.durationOptionSelected,
                      ]}
                      activeOpacity={
                        0.7
                      }
                      onPress={() =>
                        setDuration(
                          'QUARTERLY',
                        )
                      }
                    >
                      <View
                        style={[
                          styles.radio,
                          duration ===
                            'QUARTERLY' &&
                            styles.radioSelected,
                        ]}
                      >
                        {duration ===
                          'QUARTERLY' && (
                          <View
                            style={
                              styles.radioDot
                            }
                          />
                        )}
                      </View>

                      <Text
                        style={[
                          styles.durationText,
                          duration ===
                            'QUARTERLY' &&
                            styles.durationTextSelected,
                        ]}
                      >
                        Quarterly
                        Leave
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>

              {/* ==============================================
                  NET LEAVE DAYS
              ============================================== */}

              <Text
                style={
                  styles.label
                }
              >
                Net Leave Days
              </Text>

              <View
                style={
                  styles.netLeaveCard
                }
              >
                <Text
                  style={
                    styles.netLeaveValue
                  }
                >
                  {
                    calculateNetLeaveDays()
                  }
                </Text>

                <Text
                  style={
                    styles.netLeaveLabel
                  }
                >
                  {calculateNetLeaveDays() ===
                  1
                    ? 'Day'
                    : 'Days'}
                </Text>
              </View>

              {/* ==============================================
                  APPROVAL AUTHORITY
              ============================================== */}

              <Text
                style={
                  styles.label
                }
              >
                Approval Authority
              </Text>

              <View
                style={
                  styles.authorityCard
                }
              >
                {authorities.map(
                  item => {
                    const checked =
                      selectedAuthorities.includes(
                        item.employee_id,
                      );

                    return (
                      <TouchableOpacity
                        key={
                          item.employee_id
                        }
                        style={[
                          styles.authorityRow,
                          checked &&
                            styles.authorityRowSelected,
                        ]}
                        activeOpacity={
                          0.7
                        }
                        onPress={() =>
                          toggleAuthority(
                            item.employee_id,
                          )
                        }
                      >
                        <View
                          style={[
                            styles.checkbox,
                            checked &&
                              styles.checkboxSelected,
                          ]}
                        >
                          {checked && (
                            <Text
                              style={
                                styles.checkMark
                              }
                            >
                              ✓
                            </Text>
                          )}
                        </View>

                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <Text
                            style={
                              styles.authorityName
                            }
                          >
                            {
                              item.name
                            }
                          </Text>

                          <Text
                            style={
                              styles.authorityDesignation
                            }
                          >
                            {
                              item.designation
                            }
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>

              {/* ==============================================
                  RESTRICTED HOLIDAY
              ============================================== */}

              {restrictedHolidayTwoDate &&
                leaveBalance.restrictedLeave >
                  0 && (
                  <TouchableOpacity
                    style={[
                      styles.checkboxRow,
                      restrictedHoliday &&
                        styles.checkboxRowSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() =>
                      setRestrictedHoliday(
                        previous =>
                          !previous,
                      )
                    }
                  >
                    <View
                      style={[
                        styles.checkbox,
                        restrictedHoliday &&
                          styles.checkboxSelected,
                      ]}
                    >
                      {restrictedHoliday && (
                        <Text
                          style={
                            styles.checkmark
                          }
                        >
                          ✓
                        </Text>
                      )}
                    </View>

                    <Text
                      style={
                        styles.checkboxLabel
                      }
                    >
                      Want to add
                      restricted
                      holiday
                    </Text>
                  </TouchableOpacity>
                )}

              {/* ==============================================
                  REASON
              ============================================== */}

              <Text
                style={
                  styles.label
                }
              >
                Reason
              </Text>

              <TextInput
                style={
                  styles.reasonInput
                }
                placeholder="Enter reason..."
                placeholderTextColor={
                  Colors.textSecondary
                }
                value={reason}
                onChangeText={
                  setReason
                }
                multiline
                textAlignVertical="top"
              />

              {/* ==============================================
                  APPLY
              ============================================== */}

              <TouchableOpacity
                style={
                  styles.applyButton
                }
                activeOpacity={0.8}
                onPress={
                  handleApplyLeave
                }
              >
                <Text
                  style={
                    styles.applyButtonText
                  }
                >
                  Apply Leave
                </Text>
              </TouchableOpacity>
            </>
          )}
      </ScrollView>

      {/* ======================================================
          BOTTOM BAR
      ====================================================== */}

      <BottomBar selected={1} />

      {/* ======================================================
          SIDE MENU
      ====================================================== */}

      <SideMenu
        visible={
          menuVisible
        }
        selected="Apply Leave"
        onClose={() =>
          setMenuVisible(false)
        }
      />
    </View>
  );
};

export default ApplyLeave;

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.background,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 25,
  },

  /* ==========================================================
     LOADING
  ========================================================== */

  loadingContainer: {
    minHeight: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily:
      FontFamily.medium,
    color:
      Colors.textSecondary,
  },

  errorContainer: {
    minHeight: 350,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  errorText: {
    fontSize: 14,
    fontFamily:
      FontFamily.medium,
    color: Colors.accent,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 28,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor:
      Colors.primary,
  },

  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily:
      FontFamily.semiBold,
  },

  /* ==========================================================
     BALANCE
  ========================================================== */

  sectionTitle: {
    fontSize: 17,
    fontFamily:
      FontFamily.semiBold,
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
    backgroundColor:
      Colors.white,
    borderWidth: 1,
    borderColor:
      Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 5,
    alignItems: 'center',
  },

  balanceLabel: {
    fontSize: 11,
    fontFamily:
      FontFamily.medium,
    color:
      Colors.textSecondary,
    textAlign: 'center',
  },

  totalValue: {
    marginTop: 5,
    fontSize: 22,
    fontFamily:
      FontFamily.bold,
    color:
      Colors.primary,
  },

  balanceValue: {
    marginTop: 5,
    fontSize: 22,
    fontFamily:
      FontFamily.bold,
    color:
      Colors.success,
  },

  restrictedValue: {
    marginTop: 5,
    fontSize: 22,
    fontFamily:
      FontFamily.bold,
    color:
      Colors.pending,
  },

  /* ==========================================================
     FORM
  ========================================================== */

  label: {
    marginTop: 17,
    marginBottom: 7,
    fontSize: 14,
    fontFamily:
      FontFamily.medium,
    color: Colors.text,
  },

  dateInput: {
    height: 52,
    backgroundColor:
      Colors.white,
    borderWidth: 1,
    borderColor:
      Colors.border,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  calendarIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor:
      Colors.primary,
  },

  dateText: {
    flex: 1,
    fontSize: 14,
    fontFamily:
      FontFamily.regular,
    color: Colors.text,
    includeFontPadding: false,
    textAlignVertical:
      'center',
  },

  arrow: {
    fontSize: 27,
    color:
      Colors.textSecondary,
    fontFamily:
      FontFamily.regular,
    includeFontPadding: false,
    textAlignVertical:
      'center',
  },

  /* ==========================================================
     DURATION
  ========================================================== */

  durationContainer: {
    backgroundColor:
      Colors.white,
    borderWidth: 1,
    borderColor:
      Colors.border,
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
    borderColor:
      Colors.border,
    backgroundColor:
      Colors.white,
  },

  durationOptionSelected: {
    backgroundColor:
      Colors.primaryLight,
    borderColor:
      Colors.primary,
  },

  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor:
      Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },

  radioSelected: {
    borderColor:
      Colors.primary,
  },

  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor:
      Colors.primary,
  },

  durationText: {
    fontSize: 13,
    fontFamily:
      FontFamily.medium,
    color:
      Colors.textSecondary,
  },

  durationTextSelected: {
    color:
      Colors.primary,
    fontFamily:
      FontFamily.semiBold,
  },

  /* ==========================================================
     RESTRICTED HOLIDAY
  ========================================================== */

  checkboxRow: {
    marginTop: 17,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor:
      Colors.white,
    borderWidth: 1,
    borderColor:
      Colors.border,
    borderRadius: 10,
  },

  checkboxRowSelected: {
    backgroundColor:
      Colors.primaryLight,
    borderColor:
      Colors.primary,
  },

  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor:
      Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  checkboxSelected: {
    backgroundColor:
      Colors.primary,
    borderColor:
      Colors.primary,
  },

  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontFamily:
      FontFamily.bold,
  },

  checkMark: {
    color: Colors.white,
    fontSize: 14,
    fontFamily:
      FontFamily.bold,
  },

  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily:
      FontFamily.medium,
    color: Colors.text,
  },

  /* ==========================================================
     REASON
  ========================================================== */

  reasonInput: {
    minHeight: 105,
    backgroundColor:
      Colors.white,
    borderWidth: 1,
    borderColor:
      Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 13,
    fontSize: 14,
    fontFamily:
      FontFamily.regular,
    color: Colors.text,
  },

  /* ==========================================================
     APPLY BUTTON
  ========================================================== */

  applyButton: {
    height: 52,
    marginTop: 22,
    borderRadius: 10,
    backgroundColor:
      Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor:
      Colors.primary,
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
    fontFamily:
      FontFamily.semiBold,
  },

  /* ==========================================================
     NET LEAVE
  ========================================================== */

  netLeaveCard: {
    marginTop: 10,
    backgroundColor:
      Colors.primaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor:
      Colors.primary,
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 18,
  },

  netLeaveValue: {
    fontSize: 34,
    fontFamily:
      FontFamily.bold,
    color:
      Colors.primary,
  },

  netLeaveLabel: {
    marginTop: 4,
    fontSize: 15,
    fontFamily:
      FontFamily.medium,
    color:
      Colors.textSecondary,
  },

  /* ==========================================================
     AUTHORITY
  ========================================================== */

  authorityCard: {
    backgroundColor:
      Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor:
      Colors.border,
    marginTop: 8,
    overflow: 'hidden',
  },

  authorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor:
      '#F2F2F2',
  },

  authorityRowSelected: {
    backgroundColor:
      Colors.primaryLight,
  },

  authorityName: {
    fontSize: 15,
    fontFamily:
      FontFamily.semiBold,
    color: Colors.text,
  },

  authorityDesignation: {
    marginTop: 3,
    fontSize: 13,
    fontFamily:
      FontFamily.regular,
    color:
      Colors.textSecondary,
  },
});