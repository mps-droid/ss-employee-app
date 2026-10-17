import React from 'react';
import { StyleSheet, View } from 'react-native';
import { space } from '../theme';
import AppText from './AppText';
import Eyebrow from './Eyebrow';

/**
 * Title block for the tab screens, in the website's eyebrow-and-title style.
 */
export default function ScreenTitle({ eyebrow, title, right, style }) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.text}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <AppText variant="display" accessibilityRole="header">
          {title}
        </AppText>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  text: { flex: 1, gap: space.xs },
});
