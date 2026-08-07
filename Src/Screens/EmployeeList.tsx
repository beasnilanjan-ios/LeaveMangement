import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import TopBar from '../GlobalContainer/TopBar';
import SideMenu from '../GlobalContainer/SideMenu';

import Colors from '../Assets/Colors/Colors';
import { FontFamily } from '../GlobalFont/GlobalFont';
import { RootStackParamList } from '../Navigation/AppNavigator';
import EmployeeCard from '../GlobalContainer/EmployeeCard';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EmployeeList'
>;

const employeeData = [
  {
    id: 'EMP1001',
    name: 'Rahul Sharma',
    designation: 'Software Engineer',
  },
  {
    id: 'EMP1002',
    name: 'Priya Das',
    designation: 'UI/UX Designer',
  },
  {
    id: 'EMP1003',
    name: 'Amit Roy',
    designation: 'HR Executive',
  },
  {
    id: 'EMP1004',
    name: 'Sneha Paul',
    designation: 'QA Engineer',
  },
  {
    id: 'EMP1005',
    name: 'Rohit Gupta',
    designation: 'Business Analyst',
  },
];

const EmployeeList = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [search, setSearch] = useState('');

  const navigation = useNavigation<NavigationProp>();
  const filteredEmployees = employeeData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );


  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <TopBar
        title="Employee List"
        backVisible={false}
        onMenuPress={() => setMenuVisible(true)}
      />

      {/* Content */}
      <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>

          {/* Search */}

          <TextInput
            style={styles.searchInput}
            placeholder="Search employee..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />

          {/* Employee List */}

          <FlatList
            data={filteredEmployees}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({item}) => (
              <EmployeeCard
                item={item}
                onPress={() =>
                  navigation.navigate('EmployeeLeaveHistory', {
                    employeeId: item.id,
                  })
                }
              />
            )}
          />
        </ScrollView>

        {/* ------------------------------------------------
          Side Menu
      ------------------------------------------------ */}

      <SideMenu
        visible={menuVisible}
        selected="Employee Leave History"
        onClose={() => setMenuVisible(false)}
      />
      
    </View>
  );
};

export default EmployeeList;

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

  searchInput: {
  height: 48,

  backgroundColor: Colors.white,

  borderRadius: 10,

  borderWidth: 1,
  borderColor: Colors.border,

  paddingHorizontal: 16,

  fontSize: 14,
  fontFamily: FontFamily.regular,
  color: Colors.text,

  marginBottom: 18,
},
 
});