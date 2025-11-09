import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import MapView, { Region, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation.types';
import { UserLocation } from '../types/location.types';
import { MAP_CONFIG } from '../constants/config';
import { useLocationStore } from '../stores/locationStore';
import { RestaurantBottomSheet } from '../components/RestaurantBottomSheet';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

interface Props {
  navigation: MapScreenNavigationProp;
}

export const MapScreen: React.FC<Props> = () => {
  // Refs
  const mapRef = useRef<MapView>(null);

  // Zustand store
  const {
    setUserLocation,
    fetchNearbyPlaces,
    nearbyPlaces,
    selectedPlace,
    selectPlace,
    clearSelectedPlace,
    loading: placesLoading,
    error: placesError,
    clearError,
    userLocation,
  } = useLocationStore();

  // Local UI state
  const [mapRegion, setMapRegion] = useState<Region>(MAP_CONFIG.initialRegion);
  const [loading, setLoading] = useState<boolean>(true);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [isLoadingPlaceDetails, setIsLoadingPlaceDetails] = useState<boolean>(false);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const requestLocationPermission = useCallback(async () => {
    try {
      // Request foreground location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissionDenied(true);
        // Use default location
        setMapRegion(MAP_CONFIG.initialRegion);
        await fetchNearbyPlaces(
          MAP_CONFIG.initialRegion.latitude,
          MAP_CONFIG.initialRegion.longitude
        );
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

      // Update store with user location
      setUserLocation(userLoc);

      // Update map region to center on user location
      setMapRegion({
        latitude: userLoc.latitude,
        longitude: userLoc.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Fetch nearby restaurants
      await fetchNearbyPlaces(userLoc.latitude, userLoc.longitude);

      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      // Use default location on error
      setMapRegion(MAP_CONFIG.initialRegion);
      await fetchNearbyPlaces(
        MAP_CONFIG.initialRegion.latitude,
        MAP_CONFIG.initialRegion.longitude
      );
      setLoading(false);
      Alert.alert(
        'Location Error',
        'Failed to get your location. Using default location.',
        [{ text: 'OK' }]
      );
    }
  }, [setUserLocation, fetchNearbyPlaces]);

  // Marker press handler
  const handleMarkerPress = useCallback((placeId: string) => {
    // Set loading state for bottom sheet
    setIsLoadingPlaceDetails(true);
    // Track selected marker for highlighting
    setSelectedMarker(placeId);
    // Fetch place details and open bottom sheet
    selectPlace(placeId);
  }, [selectPlace]);

  // Handle close bottom sheet
  const handleCloseBottomSheet = useCallback(() => {
    setIsLoadingPlaceDetails(false);
    setSelectedMarker(null);
    clearSelectedPlace();
  }, [clearSelectedPlace]);

  // Update loading state when selectedPlace changes
  useEffect(() => {
    if (selectedPlace !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoadingPlaceDetails(false);
    }
  }, [selectedPlace]);

  // Retry handler for error state
  const handleRetry = useCallback(async () => {
    clearError();
    const state = useLocationStore.getState();
    const userLocation = state.userLocation;
    if (userLocation) {
      await fetchNearbyPlaces(userLocation.latitude, userLocation.longitude);
    }
  }, [clearError, fetchNearbyPlaces]);

  // Re-center map on user location
  const handleRecenterMap = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }, [userLocation]);

  useEffect(() => {
    // Initialize location on mount - this is a legitimate use case for setState in effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    requestLocationPermission();
  }, [requestLocationPermission]);

  // Memoize markers to prevent re-rendering on every state change
  const markers = useMemo(() => {
    return nearbyPlaces.map((place) => (
      <Marker
        key={place.placeId}
        coordinate={{
          latitude: place.lat,
          longitude: place.lng,
        }}
        title={place.name}
        description={place.openNow ? 'Open Now' : 'Closed'}
        pinColor={selectedMarker === place.placeId ? '#c41e3a' : undefined}
        onPress={() => handleMarkerPress(place.placeId)}
      />
    ));
  }, [nearbyPlaces, selectedMarker, handleMarkerPress]);

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
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
        showsUserLocation={!permissionDenied}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        onRegionChangeComplete={setMapRegion}
      >
        {/* Markers for nearby restaurants */}
        {markers}
      </MapView>

      {/* Loading overlay for nearby places */}
      {placesLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#c41e3a" />
          <Text style={styles.loadingText}>Loading nearby restaurants...</Text>
        </View>
      )}

      {/* Error banner */}
      {placesError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{placesError}</Text>
          <Button title="Retry" onPress={handleRetry} color="#c41e3a" />
        </View>
      )}

      {/* Permission denied banner */}
      {permissionDenied && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            Location permission denied. Showing default location.
          </Text>
        </View>
      )}

      {/* No results message */}
      {!placesLoading && nearbyPlaces.length === 0 && !permissionDenied && (
        <View style={styles.noResultsBanner}>
          <MaterialIcons name="info-outline" size={24} color="#666" />
          <Text style={styles.noResultsText}>No restaurants found nearby</Text>
        </View>
      )}

      {/* Floating action button - Re-center map */}
      {userLocation && !permissionDenied && (
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleRecenterMap}
          activeOpacity={0.8}
        >
          <MaterialIcons name="my-location" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Restaurant details bottom sheet */}
      <RestaurantBottomSheet
        placeDetails={selectedPlace}
        isLoading={isLoadingPlaceDetails}
        onClose={handleCloseBottomSheet}
      />
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
  loadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -50 }],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  errorBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f44336',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  noResultsBanner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -30 }],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
  fabButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#c41e3a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
