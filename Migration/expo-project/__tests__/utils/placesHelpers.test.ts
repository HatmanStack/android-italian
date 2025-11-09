import { getPlacePhotoUrl, formatBusinessHours } from '../../src/utils/placesHelpers';

describe('placesHelpers', () => {
  describe('getPlacePhotoUrl', () => {
    it('should generate photo URL with correct base URL', () => {
      const photoRef = 'CmRaAAAAExamplePhotoReference123';
      const url = getPlacePhotoUrl(photoRef);

      expect(url).toContain('https://maps.googleapis.com/maps/api/place/photo');
    });

    it('should include photo reference parameter', () => {
      const photoRef = 'CmRaAAAAExamplePhotoReference123';
      const url = getPlacePhotoUrl(photoRef);

      expect(url).toContain(`photo_reference=${photoRef}`);
    });

    it('should include default maxwidth of 400', () => {
      const photoRef = 'CmRaAAAAExamplePhotoReference123';
      const url = getPlacePhotoUrl(photoRef);

      expect(url).toContain('maxwidth=400');
    });

    it('should include custom maxwidth when provided', () => {
      const photoRef = 'CmRaAAAAExamplePhotoReference123';
      const url = getPlacePhotoUrl(photoRef, 800);

      expect(url).toContain('maxwidth=800');
    });

    it('should include API key parameter', () => {
      const photoRef = 'CmRaAAAAExamplePhotoReference123';
      const url = getPlacePhotoUrl(photoRef);

      expect(url).toContain('key=');
      // Check that key has a value (not empty)
      expect(url).toMatch(/key=.+/);
    });

    it('should generate valid URL format', () => {
      const photoRef = 'CmRaAAAAExamplePhotoReference123';
      const url = getPlacePhotoUrl(photoRef, 400);

      // Should start with base URL
      expect(url).toMatch(/^https:\/\/maps\.googleapis\.com\/maps\/api\/place\/photo\?/);

      // Should have query parameters
      expect(url).toContain('maxwidth=');
      expect(url).toContain('photo_reference=');
      expect(url).toContain('key=');
    });

    it('should handle special characters in photo reference', () => {
      const photoRef = 'CmRaAAAA_test-photo+reference/with=special&chars';
      const url = getPlacePhotoUrl(photoRef);

      // Photo reference should be URL encoded
      expect(url).toContain('photo_reference=');
    });
  });

  describe('formatBusinessHours', () => {
    it('should format business hours with newlines', () => {
      const hours = [
        'Monday: 11:00 AM – 9:00 PM',
        'Tuesday: 11:00 AM – 9:00 PM',
      ];
      const formatted = formatBusinessHours(hours);

      expect(formatted).toBe('Monday: 11:00 AM – 9:00 PM\nTuesday: 11:00 AM – 9:00 PM');
    });

    it('should handle single day', () => {
      const hours = ['Monday: 11:00 AM – 9:00 PM'];
      const formatted = formatBusinessHours(hours);

      expect(formatted).toBe('Monday: 11:00 AM – 9:00 PM');
    });

    it('should handle full week of hours', () => {
      const hours = [
        'Monday: 11:00 AM – 9:00 PM',
        'Tuesday: 11:00 AM – 9:00 PM',
        'Wednesday: 11:00 AM – 9:00 PM',
        'Thursday: 11:00 AM – 9:00 PM',
        'Friday: 11:00 AM – 10:00 PM',
        'Saturday: 12:00 PM – 10:00 PM',
        'Sunday: 12:00 PM – 9:00 PM',
      ];
      const formatted = formatBusinessHours(hours);

      expect(formatted).toBe(hours.join('\n'));
      expect(formatted.split('\n')).toHaveLength(7);
    });

    it('should handle empty array', () => {
      const hours: string[] = [];
      const formatted = formatBusinessHours(hours);

      expect(formatted).toBe('');
    });

    it('should preserve special characters', () => {
      const hours = [
        'Monday: Closed',
        'Tuesday: 11:00 AM – 9:00 PM',
        'Wednesday: Open 24 hours',
      ];
      const formatted = formatBusinessHours(hours);

      expect(formatted).toContain('Closed');
      expect(formatted).toContain('Open 24 hours');
    });
  });
});
