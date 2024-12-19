// src/pages/PaymentPage.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const PaymentPage = ({ navigation, route }) => {
  const [product] = useState(route.params?.product || {
    name: 'Chicken Product', 
    price: 499,
    description: 'Delicious farm-fresh chicken'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  const shakeAnimation = new Animated.Value(0);

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Get userId when component mounts
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          const parsedUserId = JSON.parse(storedUserId);
          setUserId(parsedUserId);
          console.log('UserId loaded:', parsedUserId);
        } else {
          console.log('No userId found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error getting userId:', error);
      }
    };

    getUserId();
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createOrder = async () => {
    if (!userId) {
      console.error('UserId is not available');
      setError('User not authenticated');
      startShake();
      return;
    }
    
    try {
      const orderData = {
        userId: userId,
        items: [product.name],
        amount: product.price,
        orderId: "ORD#123",
        paymentStatus: "Completed",
        location: {
          latitude: null,
          longitude: null
        }
      };
      console.log('Creating order with data:', orderData);
      const response = await axios.post('http://localhost:3500/api/orders', orderData);

      if (response.data.message === 'Order created successfully') {
        console.log('Order created successfully');
        navigation.navigate('Map', {
          userLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        });
      } else {
        setError('Failed to create order');
        startShake();
      }

    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order');
      startShake();
    }
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      // Create order on backend
      const orderResponse = await axios.post('http://localhost:3500/Payment/orders', {
        amount: product.price * 100 // Convert to paise
      });

      const order = orderResponse.data.data;

      // Get user details
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      console.log('User details:', user);

      const options = {
        key: 'rzp_test_epPmzNozAIcJcC', 
        amount: product.price * 100,
        currency: 'INR',
        name: 'Natty-coco',
        description: product.name,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post('http://localhost:3500/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.message === 'Payment verified successfully') {
              console.log('Success', 'Payment Successful!');
              createOrder();
            } else {
              setError('Payment verification failed');
              startShake();
            }
          } catch (error) {
            console.error('Verification Error:', error);
            setError('Payment verification failed');
            startShake();
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: '#FF8C00'
        },
        modal: {
          ondismiss: function() {
            setError('Payment was cancelled');
            startShake();
          }
        }
      };

      // Initialize and open Razorpay
      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function(response) {
          setError(response.error.description);
          startShake();
        });
        razorpay.open();
      } else {
        setError('Razorpay SDK not loaded');
        startShake();
      }

    } catch (error) {
      console.error('Payment Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to process payment';
      setError(errorMessage);
      startShake();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF8C00', '#FFA500', '#FFD700']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <Text style={styles.title}>Product Checkout</Text>

          {error ? (
            <Animated.View
              style={[
                styles.errorContainer,
                {transform: [{translateX: shakeAnimation}]}
              ]}
            >
              <Text style={styles.error}>{error}</Text>
            </Animated.View>
          ) : null}

          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.description}>{product.description}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price:</Text>
              <Text style={styles.price}>₹{product.price}</Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handlePayment}
            style={[styles.button, isLoading && styles.buttonDisabled]}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Processing...' : 'Pay Now'}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 24
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: '600',
  },
  productInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000'
  },
  description: {
    color: '#666',
    marginBottom: 16
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000'
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00'
  },
  button: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FF8C00',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default PaymentPage;