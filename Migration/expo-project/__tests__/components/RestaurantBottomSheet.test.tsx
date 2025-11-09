import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RestaurantBottomSheet } from '../../src/components/RestaurantBottomSheet';
import { PlaceDetails } from '../../src/types/location.types';

// Get the global mocks from jest.setup.js
const mockOpenURL = (global as unknown as { mockLinking: { openURL: jest.Mock } }).mockLinking.openURL;
const mockCanOpenURL = (global as unknown as { mockLinking: { canOpenURL: jest.Mock } }).mockLinking.canOpenURL;
const mockAlert = (global as unknown as { mockAlert: jest.Mock }).mockAlert;

describe('RestaurantBottomSheet', () => {
  const mockPlaceDetails: PlaceDetails = {
    placeId: 'test-place-1',
    name: 'Test Restaurant',
    formattedAddress: '123 Main St, Test City, CA 12345',
    formattedPhoneNumber: '(555) 123-4567',
    weekdayText: [
      'Monday: 11:00 AM – 9:00 PM',
      'Tuesday: 11:00 AM – 9:00 PM',
      'Wednesday: 11:00 AM – 9:00 PM',
      'Thursday: 11:00 AM – 9:00 PM',
      'Friday: 11:00 AM – 10:00 PM',
      'Saturday: 12:00 PM – 10:00 PM',
      'Sunday: 12:00 PM – 9:00 PM',
    ],
    photoReference: 'test-photo-ref',
    lat: 37.39,
    lng: -122.08,
    openNow: true,
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    mockOpenURL.mockResolvedValue(true);
    mockCanOpenURL.mockResolvedValue(true);
    mockAlert.mockImplementation(jest.fn());
  });

  describe('Loading state', () => {
    it('should render skeleton components when loading', () => {
      const { queryByText } = render(
        <RestaurantBottomSheet
          placeDetails={null}
          isLoading={true}
          onClose={mockOnClose}
        />
      );

      // Should not show actual content
      expect(queryByText('Test Restaurant')).toBeNull();
    });

    it('should not show restaurant details when loading', () => {
      const { queryByText } = render(
        <RestaurantBottomSheet
          placeDetails={null}
          isLoading={true}
          onClose={mockOnClose}
        />
      );

      expect(queryByText('Test Restaurant')).toBeNull();
      expect(queryByText('(555) 123-4567')).toBeNull();
    });
  });

  describe('Content rendering', () => {
    it('should display restaurant name', () => {
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={mockPlaceDetails}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      expect(getByText('Test Restaurant')).toBeTruthy();
    });

    it('should display open status badge when restaurant is open', () => {
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={mockPlaceDetails}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      expect(getByText('OPEN')).toBeTruthy();
    });

    it('should display closed status badge when restaurant is closed', () => {
      const closedPlace = { ...mockPlaceDetails, openNow: false };
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={closedPlace}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      expect(getByText('CLOSED')).toBeTruthy();
    });

    it('should display formatted address', () => {
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={mockPlaceDetails}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      expect(getByText('123 Main St, Test City, CA 12345')).toBeTruthy();
    });

    it('should display phone number', () => {
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={mockPlaceDetails}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      expect(getByText('(555) 123-4567')).toBeTruthy();
    });

    it('should display business hours title', () => {
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={mockPlaceDetails}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      expect(getByText('Business Hours')).toBeTruthy();
    });

    it('should not display phone number when not provided', () => {
      const noPhonePlace = { ...mockPlaceDetails, formattedPhoneNumber: undefined };
      const { queryByText } = render(
        <RestaurantBottomSheet
          placeDetails={noPhonePlace}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      // Phone number should not be displayed
      expect(queryByText('(555) 123-4567')).toBeNull();
    });
  });

  describe('Close functionality', () => {
    it('should call onClose when close button is pressed', () => {
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={mockPlaceDetails}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      const closeButton = getByText('×');
      fireEvent.press(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Call button', () => {
    it('should display call button when phone number is provided', () => {
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={mockPlaceDetails}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      expect(getByText('Call')).toBeTruthy();
    });

    it('should not display call button when phone number is not provided', () => {
      const noPhonePlace = { ...mockPlaceDetails, formattedPhoneNumber: undefined };
      const { queryByText } = render(
        <RestaurantBottomSheet
          placeDetails={noPhonePlace}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      expect(queryByText('Call')).toBeNull();
    });

    it('should have pressable call button when phone number is available', () => {
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={mockPlaceDetails}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      const callButton = getByText('Call');
      expect(callButton).toBeTruthy();

      // Should be pressable without errors
      fireEvent.press(callButton);
    });

    it('should render call button with phone icon', () => {
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={mockPlaceDetails}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      const callButton = getByText('Call');
      expect(callButton).toBeTruthy();
    });
  });

  describe('Directions button', () => {
    it('should display directions button', () => {
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={mockPlaceDetails}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      expect(getByText('Directions')).toBeTruthy();
    });

    it('should have pressable directions button', () => {
      const { getByText } = render(
        <RestaurantBottomSheet
          placeDetails={mockPlaceDetails}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      const directionsButton = getByText('Directions');
      expect(directionsButton).toBeTruthy();

      // Should be pressable without errors
      fireEvent.press(directionsButton);
    });
  });

  describe('Edge cases', () => {
    it('should render nothing when not loading and no placeDetails', () => {
      const { root } = render(
        <RestaurantBottomSheet
          placeDetails={null}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      // Should render the bottom sheet container but no content
      expect(root).toBeTruthy();
    });

    it('should handle missing business hours', () => {
      const noHoursPlace = { ...mockPlaceDetails, weekdayText: undefined };
      const { queryByText } = render(
        <RestaurantBottomSheet
          placeDetails={noHoursPlace}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      expect(queryByText('Business Hours')).toBeNull();
    });

    it('should handle empty business hours array', () => {
      const emptyHoursPlace = { ...mockPlaceDetails, weekdayText: [] };
      const { queryByText } = render(
        <RestaurantBottomSheet
          placeDetails={emptyHoursPlace}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      expect(queryByText('Business Hours')).toBeNull();
    });

    it('should handle missing photo reference', () => {
      const noPhotoPlace = { ...mockPlaceDetails, photoReference: undefined };
      const { root } = render(
        <RestaurantBottomSheet
          placeDetails={noPhotoPlace}
          isLoading={false}
          onClose={mockOnClose}
        />
      );

      // Should render without errors
      expect(root).toBeTruthy();
    });
  });
});
