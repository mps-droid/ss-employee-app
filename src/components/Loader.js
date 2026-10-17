import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, space } from '../theme';
import AppText from './AppText';

export default function Loader({ label, fill = false, style }) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label || 'Loading'}
      style={[styles.wrap, fill && styles.fill, style]}
    >
      <ActivityIndicator size="large" color={colors.foreground} />
      {label ? <AppText variant="small">{label}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    paddingVertical: space.xxxl,
  },
  fill: { flex: 1 },
});
