import React from 'react';
import { Text } from 'react-native';
import { colors, textVariants } from '../theme';

// Variants whose default colour is the muted grey rather than the foreground.
const MUTED_VARIANTS = new Set(['eyebrow', 'caption', 'small']);

export default function AppText({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...rest
}) {
  const defaultColor = MUTED_VARIANTS.has(variant)
    ? colors.mutedForeground
    : colors.foreground;
  return (
    <Text
      style={[
        textVariants[variant] || textVariants.body,
        { color: color || defaultColor },
        align ? { textAlign: align } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
