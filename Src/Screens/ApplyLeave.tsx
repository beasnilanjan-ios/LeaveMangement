import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';


import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';
import BottomBar from '../GlobalContainer/BottomBar';
import {FontFamily} from '../GlobalFont/GlobalFont';



const ApplyLeave = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>

      <TopBar
        title="Apply Leave"
        onMenuPress={() => setMenuVisible(prev => !prev)}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          Apply Leave
        </Text>
      </View>

      <BottomBar selected={1} />

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
    backgroundColor: '#F5F5F5',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
    fontFamily: FontFamily.bold,
    color: '#111',
  },
});