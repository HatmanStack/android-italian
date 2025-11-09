import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export const Skeleton: React.FC<Props> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  // eslint-disable-next-line react-hooks/refs
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Create pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
  },
});
