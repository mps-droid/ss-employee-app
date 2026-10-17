import React from 'react';
import { StyleSheet, View } from 'react-native';
import { radius, space, tones } from '../theme';
import AppText from './AppText';

export default function StatusPill({ label, tone = 'neutral', style }) {
  const t = tones[tone] || tones.neutral;
  return (
    <View
      accessibilityLabel={`Status: ${label}`}
      style={[styles.pill, { backgroundColor: t.background }, style]}
    >
      <View style={[styles.dot, { backgroundColor: t.dot }]} />
      <AppText variant="eyebrow" color={t.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: space.xs,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
