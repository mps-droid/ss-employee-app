import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from './icons';
import { colors, radius, space } from '../theme';
import AppText from './AppText';

export default function ListRow({
  icon: Icon,
  label,
  description,
  onPress,
  destructive = false,
  showChevron = true,
  style,
}) {
  const tint = destructive ? colors.destructive : colors.foreground;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}
    >
      {Icon ? (
        <View style={[styles.iconBox, destructive && styles.iconBoxDanger]}>
          <Icon size={20} color={tint} strokeWidth={2} />
        </View>
      ) : null}
      <View style={styles.text}>
        <AppText variant="bodyStrong" color={tint}>
          {label}
        </AppText>
        {description ? (
          <AppText variant="small" numberOfLines={1}>
            {description}
          </AppText>
        ) : null}
      </View>
      {showChevron ? (
        <ChevronRight size={20} color={colors.mutedForeground} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 60,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: colors.card,
  },
  pressed: { backgroundColor: colors.surface },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxDanger: { backgroundColor: colors.dangerWash },
  text: { flex: 1, gap: 2 },
});
