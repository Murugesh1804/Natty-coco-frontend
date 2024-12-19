// // src/services/paymentService.js
// import axiosInstance from '../Utils/axiosConfig';

// export const paymentService = {
//   createOrder: async (amount) => {
//     try {
//       const response = await axiosInstance.post('/Payment/orders', { amount });
//       return response.data.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   },

//   verifyPayment: async (paymentData) => {
//     try {
//       const response = await axiosInstance.post('/Payment/verify', paymentData);
//       return response.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   }
// };