import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation.types';
import { UserLocation } from '../types/location.types';
import { MAP_CONFIG } from '../constants/config';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

interface Props {
  navigation: MapScreenNavigationProp;
}

export const MapScreen: React.FC<Props> = () => {
  const [_userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(MAP_CONFIG.initialRegion);
  const [loading, setLoading] = useState<boolean>(true);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const requestLocationPermission = useCallback(async () => {
    try {
      // Request foreground location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissionDenied(true);
        setLoading(false);
        Alert.alert(
          'Permission Denied',
          'Location permission is required to find nearby restaurants. Using default location.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLoc: UserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
      };

      setUserLocation(userLoc);

      // Update map region to center on user location
      setMapRegion({
        latitude: userLoc.latitude,
        longitude: userLoc.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setLoading(false);
      Alert.alert(
        'Location Error',
        'Failed to get your location. Using default location.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  useEffect(() => {
    // Initialize location on mount - this is a legitimate use case for setState in effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    requestLocationPermission();
  }, [requestLocationPermission]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c41e3a" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={!permissionDenied}
        showsMyLocationButton={!permissionDenied}
        showsCompass={true}
        showsScale={true}
        onRegionChangeComplete={setMapRegion}
      >
        {/* Markers for nearby restaurants will be added in Phase 3 */}
      </MapView>
      {permissionDenied && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            Location permission denied. Showing default location.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  warningBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff9800',
    padding: 15,
  },
  warningText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});
