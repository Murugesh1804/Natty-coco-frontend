import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../pages/LoginPage';
import RegisterScreen from '../pages/RegisterPage';
import OTPVerificationScreen from '../pages/OTPVerification';
import HomeScreen from '../pages/HomePage';
import PaymentScreen from '../pages/PaymentPage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Create Account' }}
        />
        <Stack.Screen 
          name="OTPVerification" 
          component={OTPVerificationScreen} 
          options={{ title: 'Verify OTP' }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Chicken Shop' }}
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen} 
          options={{ title: 'Checkout' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;