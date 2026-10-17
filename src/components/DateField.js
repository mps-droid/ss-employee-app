import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { CalendarDays } from './icons';
import { colors, radius, space } from '../theme';
import { formatDate } from '../utils/date';
import AppText from './AppText';

/**
 * A labelled field that opens the date picker; the whole field is the tap target.
 */
export default function DateField({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  format = 'DD MMM YYYY',
  style,
}) {
  const [open, setOpen] = useState(false);
  const text = formatDate(value, format);

  return (
    <View style={[styles.field, style]}>
      {label ? <AppText variant="label">{label}</AppText> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label || 'Date'}: ${
          text || 'not set'
        }. Change date`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.box, pressed && styles.pressed]}
      >
        <AppText variant="bodyStrong" style={styles.value}>
          {text || 'Choose a date'}
        </AppText>
        <CalendarDays size={20} color={colors.mutedForeground} />
      </Pressable>
      <DateTimePickerModal
        isVisible={open}
        mode="date"
        date={value || new Date()}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        isDarkModeEnabled={false}
        onConfirm={date => {
          setOpen(false);
          onChange?.(date);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 9 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 52,
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  pressed: { backgroundColor: colors.surface },
  value: { flex: 1 },
});
