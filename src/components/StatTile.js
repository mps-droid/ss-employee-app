import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, space } from '../theme';
import AppText from './AppText';

export default function StatTile({ label, value, style }) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.tile, style]}
    >
      <View style={styles.rule} />
      <AppText variant="number">{value}</AppText>
      <AppText variant="eyebrow">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    gap: space.xxs,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  rule: {
    width: 24,
    height: 2,
    backgroundColor: colors.primary,
    marginBottom: space.xs,
  },
});
