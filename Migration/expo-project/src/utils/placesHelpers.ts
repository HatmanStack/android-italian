import { GOOGLE_MAPS_API_KEY } from '../constants/config';

/**
 * Generate a Google Places Photo API URL
 *
 * Constructs URL for fetching place photos from Google Places API.
 * Matches Android implementation in MapFragmentActivity.java lines 96-98.
 *
 * @param photoReference - Photo reference from Places API
 * @param maxWidth - Maximum width of the photo in pixels (default: 400)
 * @returns Full URL string for the photo
 *
 * @example
 * const photoUrl = getPlacePhotoUrl('CmRaAAAA...', 400);
 * // Returns: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=CmRaAAAA...&key=YOUR_API_KEY'
 */
export function getPlacePhotoUrl(
  photoReference: string,
  maxWidth: number = 400
): string {
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/photo';
  const params = new URLSearchParams({
    maxwidth: maxWidth.toString(),
    photo_reference: photoReference,
    key: GOOGLE_MAPS_API_KEY,
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Format business hours array for display
 *
 * Joins array of weekday text strings with newlines for multi-line display.
 *
 * @param weekdayText - Array of formatted weekday hours from Places API
 * @returns Formatted string with newlines between days
 *
 * @example
 * const hours = ['Monday: 11:00 AM – 9:00 PM', 'Tuesday: 11:00 AM – 9:00 PM'];
 * const formatted = formatBusinessHours(hours);
 * // Returns: 'Monday: 11:00 AM – 9:00 PM\nTuesday: 11:00 AM – 9:00 PM'
 */
export function formatBusinessHours(weekdayText: string[]): string {
  return weekdayText.join('\n');
}
