import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { PlaceDetails } from '../types/location.types';

interface Props {
  placeDetails: PlaceDetails | null;
  isLoading: boolean;
  onClose: () => void;
}

export const RestaurantBottomSheet: React.FC<Props> = ({
  placeDetails,
  isLoading,
  onClose,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['25%', '50%', '90%'];

  // Open bottom sheet when placeDetails is provided
  useEffect(() => {
    if (placeDetails || isLoading) {
      bottomSheetRef.current?.expand();
    }
  }, [placeDetails, isLoading]);

  // Close bottom sheet when placeDetails is null and not loading
  useEffect(() => {
    if (!placeDetails && !isLoading) {
      bottomSheetRef.current?.close();
    }
  }, [placeDetails, isLoading]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
    >
      <View style={styles.contentContainer}>
        {/* Close button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading details...</Text>
          </View>
        ) : placeDetails ? (
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>{placeDetails.name}</Text>
            <Text style={styles.address}>{placeDetails.formattedAddress}</Text>
          </View>
        ) : null}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  address: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});
