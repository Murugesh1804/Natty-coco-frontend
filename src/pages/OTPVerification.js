// src/pages/OTPVerification.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { authService } from '../Services/authServices';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const OTPVerification = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    if (route.params?.email) {
      setEmail(route.params.email);
    } else {
      navigation.replace('Login');
    }
  }, [route.params, navigation]);

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      await authService.sendOTP(email);
      Alert.alert('Success', 'New OTP sent to your email');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
      startShake();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter OTP');
      startShake();
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:3500/auth/verify-otp', {
        email,
        otp
      });

      if (response.status === 200) {
        Alert.alert('Success', 'OTP verified successfully');
        navigation.replace('Login');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'OTP Verification Failed';
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
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Enter the 4-digit OTP sent to {email}</Text>

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
          
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              setError('');
            }}
            maxLength={4}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            textAlign="center"
            placeholderTextColor="#666"
          />

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resendButton}
            onPress={handleResendOTP}
            disabled={isLoading}
          >
            <Text style={styles.resendText}>
              Didn't receive OTP? <Text style={styles.resendHighlight}>Resend</Text>
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
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 30,
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
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    fontSize: 20,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 25,
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
    fontSize: 16,
  },
  resendButton: {
    marginTop: 20,
    padding: 10,
  },
  resendText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
  },
  resendHighlight: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});

export default OTPVerification;