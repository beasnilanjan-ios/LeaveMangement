import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../Screens/Splash';
import Login from '../Screens/Login';
import Dashboard from '../Screens/Dashboard';
import Holiday from '../Screens/Holiday';
import ApplyLeave from '../Screens/ApplyLeave';
import LeaveDetail from '../Screens/LeaveDetail';
import LeaveRequest from '../Screens/LeaveRequest';
import LeaveRequestDetail from '../Screens/LeaveRequestDetail';
import EmployeeList from '../Screens/EmployeeList';
import EmployeeLeaveHistory from '../Screens/EmployeeLeaveHistory';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
  Holiday: undefined;
  ApplyLeave: undefined;
  LeaveRequest: undefined;
  LeaveRequestDetail  :{
    id: number;
  };
  LeaveDetail: {
    id: string;
    type: string;
    applicationType: string;
    fromDate: string;
    toDate: string;
    status: string;
    reason: string;
  };
  EmployeeList: undefined;
  EmployeeLeaveHistory: {
    employeeId: string;
  }
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />

      <Stack.Screen name="Login" component={Login} />

      <Stack.Screen name="Dashboard" component={Dashboard} />

      <Stack.Screen name="Holiday" component={Holiday} />

      <Stack.Screen name="ApplyLeave" component={ApplyLeave} />

      <Stack.Screen name="LeaveDetail" component={LeaveDetail} />

      <Stack.Screen name="LeaveRequest" component={LeaveRequest} />

      <Stack.Screen name="LeaveRequestDetail" component={LeaveRequestDetail } />

      <Stack.Screen name="EmployeeList" component={EmployeeList} />

      <Stack.Screen name="EmployeeLeaveHistory" component={EmployeeLeaveHistory} />

    </Stack.Navigator>
  );
};

export default AppNavigator;
