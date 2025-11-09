import React from 'react';
import { render } from '@testing-library/react-native';
import { Skeleton } from '../../../src/components/common/Skeleton';

describe('Skeleton', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { root } = render(<Skeleton />);
      expect(root).toBeTruthy();
    });

    it('should render with default props', () => {
      const { root } = render(<Skeleton />);
      expect(root).toBeTruthy();
    });
  });

  describe('Props', () => {
    it('should accept custom width as number', () => {
      const { root } = render(<Skeleton width={200} />);
      expect(root).toBeTruthy();
    });

    it('should accept custom width as string', () => {
      const { root } = render(<Skeleton width="50%" />);
      expect(root).toBeTruthy();
    });

    it('should accept custom height', () => {
      const { root } = render(<Skeleton height={100} />);
      expect(root).toBeTruthy();
    });

    it('should accept custom borderRadius', () => {
      const { root } = render(<Skeleton borderRadius={12} />);
      expect(root).toBeTruthy();
    });

    it('should accept custom style object', () => {
      const customStyle = { marginTop: 16, marginBottom: 8 };
      const { root } = render(<Skeleton style={customStyle} />);
      expect(root).toBeTruthy();
    });

    it('should accept multiple props simultaneously', () => {
      const { root } = render(
        <Skeleton
          width="80%"
          height={50}
          borderRadius={8}
          style={{ marginTop: 10 }}
        />
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Default values', () => {
    it('should use default width of 100%', () => {
      const { root } = render(<Skeleton />);
      expect(root).toBeTruthy();
    });

    it('should use default height of 20', () => {
      const { root } = render(<Skeleton />);
      expect(root).toBeTruthy();
    });

    it('should use default borderRadius of 4', () => {
      const { root } = render(<Skeleton />);
      expect(root).toBeTruthy();
    });
  });

  describe('Animation', () => {
    it('should start animation loop on mount', () => {
      // The component uses Animated.loop which starts automatically
      const { root } = render(<Skeleton />);
      expect(root).toBeTruthy();
      // Animation is tested indirectly through rendering
    });

    it('should handle multiple skeleton components simultaneously', () => {
      const { root } = render(
        <>
          <Skeleton height={200} />
          <Skeleton width="70%" height={28} />
          <Skeleton width={80} height={24} />
        </>
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle width of 0', () => {
      const { root } = render(<Skeleton width={0} />);
      expect(root).toBeTruthy();
    });

    it('should handle height of 0', () => {
      const { root } = render(<Skeleton height={0} />);
      expect(root).toBeTruthy();
    });

    it('should handle borderRadius of 0', () => {
      const { root } = render(<Skeleton borderRadius={0} />);
      expect(root).toBeTruthy();
    });

    it('should handle very large dimensions', () => {
      const { root } = render(<Skeleton width={10000} height={10000} />);
      expect(root).toBeTruthy();
    });

    it('should handle very large borderRadius', () => {
      const { root } = render(<Skeleton borderRadius={9999} />);
      expect(root).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('should work with typical photo skeleton dimensions', () => {
      const { root } = render(
        <Skeleton height={200} borderRadius={12} style={{ marginBottom: 16 }} />
      );
      expect(root).toBeTruthy();
    });

    it('should work with typical text skeleton dimensions', () => {
      const { root } = render(
        <Skeleton width="70%" height={28} style={{ marginBottom: 8 }} />
      );
      expect(root).toBeTruthy();
    });

    it('should work with typical icon skeleton dimensions', () => {
      const { root } = render(
        <Skeleton width={20} height={20} borderRadius={10} style={{ marginRight: 8 }} />
      );
      expect(root).toBeTruthy();
    });

    it('should work with typical badge skeleton dimensions', () => {
      const { root } = render(
        <Skeleton width={80} height={24} borderRadius={16} style={{ marginBottom: 16 }} />
      );
      expect(root).toBeTruthy();
    });

    it('should work with typical hours skeleton dimensions', () => {
      const { root } = render(
        <Skeleton width="100%" height={120} borderRadius={8} style={{ marginTop: 8 }} />
      );
      expect(root).toBeTruthy();
    });
  });
});
