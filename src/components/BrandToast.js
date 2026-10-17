import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadow, space } from '../theme';
import AppText from './AppText';

const DOT = {
  success: colors.primary,
  error: colors.toastError,
  info: colors.secondary,
};

function BrandToast({ text1, text2, type }) {
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.toast, shadow.card]}
    >
      <View style={[styles.dot, { backgroundColor: DOT[type] || DOT.info }]} />
      <View style={styles.text}>
        {text1 ? (
          <AppText variant="bodyStrong" color={colors.white}>
            {text1}
          </AppText>
        ) : null}
        {text2 ? (
          <AppText variant="small" color={colors.toastSubtext}>
            {text2}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

// Dark toasts with a coloured status dot, used for every message in the app.
export const toastConfig = {
  success: props => <BrandToast {...props} type="success" />,
  error: props => <BrandToast {...props} type="error" />,
  info: props => <BrandToast {...props} type="info" />,
};

const styles = StyleSheet.create({
  toast: {
    width: '92%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.foreground,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 7 },
  text: { flex: 1, gap: 2 },
});
