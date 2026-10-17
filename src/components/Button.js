import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, space } from '../theme';
import AppText from './AppText';

const VARIANTS = {
  // The site's primary: brand green with near-black text.
  primary: {
    background: colors.primary,
    pressed: colors.primaryPressed,
    border: colors.primary,
    text: colors.primaryForeground,
  },
  dark: {
    background: colors.foreground,
    pressed: colors.foregroundPressed,
    border: colors.foreground,
    text: colors.white,
  },
  outline: {
    background: colors.card,
    pressed: colors.muted,
    border: colors.border,
    text: colors.foreground,
  },
  ghost: {
    background: 'transparent',
    pressed: colors.muted,
    border: 'transparent',
    text: colors.foreground,
  },
  danger: {
    background: colors.card,
    pressed: colors.dangerWash,
    border: colors.dangerBorder,
    text: colors.destructive,
  },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = true,
  accessibilityLabel,
  style,
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.small : styles.medium,
        fullWidth ? styles.fullWidth : styles.inline,
        {
          backgroundColor: pressed ? v.pressed : v.background,
          borderColor: v.border,
        },
        inactive && !loading && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <View style={styles.content}>
          {Icon ? <Icon size={18} color={v.text} strokeWidth={2.25} /> : null}
          <AppText variant="button" color={v.text} numberOfLines={1}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  medium: { minHeight: 52 },
  small: { minHeight: 44, paddingHorizontal: space.md },
  fullWidth: { alignSelf: 'stretch' },
  inline: { alignSelf: 'flex-start' },
  disabled: { opacity: 0.45 },
  content: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
});
