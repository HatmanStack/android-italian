import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, typography } from '../../constants/theme';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
  overlay?: boolean;
  color?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message,
  size = 'large',
  overlay = false,
  color = colors.primary,
}) => {
  const containerStyle = overlay
    ? [styles.container, styles.overlay]
    : styles.container;

  const accessibilityLabel = message || 'Loading';

  return (
    <View
      style={containerStyle}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size={size} color={color} accessible={false} />
      {message && (
        <Text style={styles.message} accessibilityLabel={message}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 999,
  },
  message: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
