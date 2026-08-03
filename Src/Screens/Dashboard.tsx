// import React from 'react';
// import { View, StyleSheet } from 'react-native';

// import TopBar from '../GlobalContainer/TopBar';

// const Dashboard = () => {
//   return (
//     <View style={styles.container}>

//       <TopBar
//         title="Dashboard"
//         subtitle="Welcome back"
//       />

//       {/* Dashboard Content */}

//     </View>
//   );
// };

// export default Dashboard;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7F9FC',
//   },
// });

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';

const Dashboard = () => {

  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>

      {/* Top Bar */}
      <TopBar
        onMenuPress={() => setMenuVisible(prev => !prev)}
      />

      {/* Screen Content */}
      <View style={styles.content}>

        <Text style={styles.title}>
          Dashboard
        </Text>

      </View>

      {/* Bottom Navigation */}
      <BottomBar
        selected={0}
        onHomePress={() => console.log('Home')}
        onLeavePress={() => console.log('Leave')}
        onCalendarPress={() => console.log('Calendar')}
        onProfilePress={() => console.log('Profile')}
        onSettingsPress={() => console.log('Settings')}
      />

      {/* Side Menu */}
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />

    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111',
  },

});