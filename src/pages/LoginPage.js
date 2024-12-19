// src/pages/LoginPage.js
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Alert,
  Image,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      startShake();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      startShake();
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      startShake();
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3500/auth/login', {
        email,
        password
      });
      const userdata = response.data
      await AsyncStorage.setItem('user', JSON.stringify(userdata));
    await AsyncStorage.setItem('userId', JSON.stringify(userdata.user.userId));
     await AsyncStorage.setItem('accessToken', userdata.accessToken);

      
      Alert.alert('Welcome Back!', 'Login successful!');
      navigation.replace('Home');
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
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
          {/* <Image 
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          /> */}
          
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue ordering</Text>

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

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')}
            style={styles.registerButton}
          >
            <Text style={styles.registerText}>
              New to Chicken Shop? <Text style={styles.registerHighlight}>Register</Text>
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
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
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
  inputContainer: {
    gap: 15,
    marginBottom: 25,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    fontSize: 16,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
  registerButton: {
    marginTop: 20,
    padding: 10,
  },
  registerText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
  },
  registerHighlight: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});

export default LoginPage;