import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Splash from './Src/Screens/Splash';
import Dashboard from './Src/Screens/Dashboard';

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent={false}
        barStyle="dark-content"
        backgroundColor="#F2F4F7"
      />

      {isSplashVisible ? (
        <Splash onFinish={() => setIsSplashVisible(false)} />
      ) : (
        <Dashboard />
      )}
    </SafeAreaProvider>
  );
};

export default App;