// // src/services/authService.js
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://localhost:3500/auth';

// export const authService = {
//   async login(email, password) {
//     try {
//       const response = await axios.post(`${API_URL}/login`, { email, password });
      
//       if (response.data.accessToken) {
//         await AsyncStorage.setItem('accessToken', response.data.accessToken);
//         await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
//       }
      
//       return response;
//     } catch (error) {
//       throw error.response?.data || new Error('Login failed');
//     }
//   },

//   async register(name, email, password, mobileno) {
//     try {
//       const response = await axios.post(`${API_URL}/Register`, { 
//         name, 
//         email, 
//         password, 
//         mobileno 
//       });
//       return response;
//     } catch (error) {
//       throw error.response?.data || new Error('Registration failed');
//     }
//   },

//   async sendOTP(email) {
//     try {
//       const response = await axios.post(`${API_URL}/generate-otp`, { email });
//       return response;
//     } catch (error) {
//       throw error.response?.data || new Error('Failed to send OTP');
//     }
//   },

//   async verifyOTP(email, otp) {
//     try {
//       const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
//       return response;
//     } catch (error) {
//       throw error.response?.data || new Error('OTP verification failed');
//     }
//   },

//   async resetPassword(email) {
//     try {
//       const response = await axios.post(`${API_URL}/reset-password`, { email });
//       return response;
//     } catch (error) {
//       throw error.response?.data || new Error('Failed to send reset password email');
//     }
//   },

//   async resetPasswordWithOTP(token, pwd) {
//     try {
//       const response = await axios.patch(`${API_URL}/resetpass-otp`, { token, pwd });
//       return response;
//     } catch (error) {
//       throw error.response?.data || new Error('Failed to reset password');
//     }
//   },

//   async logout() {
//     await AsyncStorage.removeItem('accessToken');
//     await AsyncStorage.removeItem('user');
//   }
// };