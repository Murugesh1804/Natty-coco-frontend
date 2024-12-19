// App.js
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
 
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#3b82f6" 
      />
      <AppNavigator />
    </>
  );
}