import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, layout, radius } from '../theme';

/**
 * A 44-point square tap target around an icon. `label` is what screen readers say.
 */
export default function IconButton({
  icon: Icon,
  label,
  onPress,
  color = colors.foreground,
  size = 22,
  badge = false,
  disabled = false,
  style,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={layout.hitSlop}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Icon size={size} color={color} strokeWidth={2} />
      {badge ? <View style={styles.badge} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: layout.minTouch,
    height: layout.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
  },
  pressed: { backgroundColor: colors.muted },
  disabled: { opacity: 0.4 },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
});
