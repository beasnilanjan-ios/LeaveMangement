import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './Src/Navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          translucent={false}
          barStyle="dark-content"
          backgroundColor="#F2F4F7"
        />

        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
