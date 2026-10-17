import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, space } from '../theme';
import AppText from './AppText';

// The website's eyebrow: a short green rule before an uppercase label.
export default function Eyebrow({ children, style }) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.rule} />
      <AppText variant="eyebrow">{children}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  rule: { width: 32, height: 2, backgroundColor: colors.primary },
});
