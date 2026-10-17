import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, space } from '../theme';
import AppText from './AppText';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  style,
}) {
  return (
    <View style={[styles.wrap, style]}>
      {Icon ? (
        <View style={styles.iconBox}>
          <Icon size={26} color={colors.foreground} strokeWidth={1.75} />
        </View>
      ) : null}
      <AppText variant="subtitle" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText variant="body" color={colors.mutedForeground} align="center">
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="sm"
          fullWidth={false}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: space.xs,
    paddingVertical: space.xxxl,
    paddingHorizontal: space.xl,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.brandWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xs,
  },
  action: { marginTop: space.sm, alignSelf: 'center' },
});
