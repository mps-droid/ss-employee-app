import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, shadow, space } from '../theme';

export default function Card({
  children,
  onPress,
  elevated = false,
  padded = true,
  style,
  accessibilityLabel,
}) {
  const base = [
    styles.card,
    padded && styles.padded,
    elevated && shadow.card,
    style,
  ];
  if (!onPress) {
    return <View style={base}>{children}</View>;
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [base, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  padded: { padding: space.md },
  pressed: { backgroundColor: colors.surface },
});
