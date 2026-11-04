import * as React from 'react';
import { Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native';

interface BadgeProps {
  value?: number | string;
  backgroundColor: string;
  color: string;
  /** Same shape as React Navigation's `tabBarBadgeStyle`. */
  style?: StyleProp<TextStyle>;
}

export function Badge({ value, backgroundColor, color, style }: BadgeProps) {
  if (value === undefined || value === null || value === '') return null;

  return (
    <Text
      numberOfLines={1}
      style={[styles.badge, { backgroundColor, color }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {typeof value === 'number' && value > 99 ? '99+' : value}
    </Text>
  );
}

const SIZE = 18;

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    minWidth: SIZE,
    height: SIZE,
    lineHeight: SIZE,
    borderRadius: SIZE / 2,
    paddingHorizontal: 4,
    overflow: 'hidden',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
