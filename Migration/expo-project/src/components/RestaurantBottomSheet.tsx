import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';
import { MaterialIcons } from '@expo/vector-icons';
import { PlaceDetails } from '../types/location.types';
import { getPlacePhotoUrl, formatBusinessHours } from '../utils/placesHelpers';

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
          <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
            {/* Photo */}
            {placeDetails.photoReference ? (
              <FastImage
                source={{ uri: getPlacePhotoUrl(placeDetails.photoReference) }}
                style={styles.photo}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={[styles.photo, styles.photoPlaceholder]}>
                <MaterialIcons name="restaurant" size={48} color="#ccc" />
              </View>
            )}

            {/* Name and Status */}
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{placeDetails.name}</Text>
              <View style={[styles.statusBadge, placeDetails.openNow ? styles.openBadge : styles.closedBadge]}>
                <Text style={styles.statusText}>{placeDetails.openNow ? 'OPEN' : 'CLOSED'}</Text>
              </View>
            </View>

            {/* Address */}
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={20} color="#c41e3a" style={styles.icon} />
              <Text style={styles.infoText}>{placeDetails.formattedAddress}</Text>
            </View>

            {/* Phone */}
            {placeDetails.formattedPhoneNumber && (
              <View style={styles.infoRow}>
                <MaterialIcons name="phone" size={20} color="#c41e3a" style={styles.icon} />
                <Text style={styles.infoText}>{placeDetails.formattedPhoneNumber}</Text>
              </View>
            )}

            {/* Hours */}
            {placeDetails.weekdayText && placeDetails.weekdayText.length > 0 && (
              <View style={styles.hoursContainer}>
                <View style={styles.hoursHeader}>
                  <MaterialIcons name="schedule" size={20} color="#c41e3a" style={styles.icon} />
                  <Text style={styles.hoursTitle}>Business Hours</Text>
                </View>
                <View style={styles.hoursScroll}>
                  <Text style={styles.hoursText}>{formatBusinessHours(placeDetails.weekdayText)}</Text>
                </View>
              </View>
            )}
          </ScrollView>
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
    marginBottom: 8,
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
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  photoPlaceholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  openBadge: {
    backgroundColor: '#4caf50',
  },
  closedBadge: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  hoursContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  hoursScroll: {
    maxHeight: 150,
  },
  hoursText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
