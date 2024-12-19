import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get user's current location
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Simulate delivery person location updates
      // In a real app, this would come from your backend
      const fetchDeliveryLocation = async () => {
        try {
          const response = await axios.get('http://localhost:3500/api/orders');
          const latestOrder = response.data[response.data.length - 1];
          if (latestOrder && latestOrder.location) {
            setDeliveryLocation({
              latitude: latestOrder.location.latitude,
              longitude: latestOrder.location.longitude
            });
          }
        } catch (error) {
          console.error('Error fetching delivery location:', error);
        }
      };

      // Update delivery location every 10 seconds
      const intervalId = setInterval(fetchDeliveryLocation, 10000);

      return () => clearInterval(intervalId);
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* User Marker */}
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />

          {/* Delivery Person Marker */}
          {deliveryLocation && (
            <>
              <Marker
                coordinate={deliveryLocation}
                title="Delivery Person"
                pinColor="green"
              />
              {/* Draw line between user and delivery person */}
              <Polyline
                coordinates={[userLocation, deliveryLocation]}
                strokeColor="#000"
                strokeWidth={2}
              />
            </>
          )}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  }
});

export default Map;
