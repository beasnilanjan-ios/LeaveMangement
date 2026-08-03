/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Polyfill for document object in React Native
if (typeof document === 'undefined') {
  global.document = {};
}

AppRegistry.registerComponent(appName, () => App);
