import React from 'react';
import { StyleSheet, View } from 'react-native';
import { space } from '../theme';
import AppText from './AppText';

// A labelled block of content, with the label in the site's form-label style.
export default function Section({ label, right, children, style }) {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.head}>
        <AppText
          variant="label"
          accessibilityRole="header"
          style={styles.label}
        >
          {label}
        </AppText>
        {right}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.sm },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  label: { flex: 1 },
});
