import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Check, ChevronDown } from '../../components/icons';
import { AppText } from '../../components';
import { ROLE_OPTIONS, roleLabel } from '../../constants/roles';
import { colors, radius, shadow, space } from '../../theme';

// Role field on the login form; opens a short list to choose from.
export default function RolePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.field}>
      <AppText variant="label">Role</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Role: ${
          roleLabel(value) || 'not chosen'
        }. Change role`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.box, pressed && styles.pressed]}
      >
        <AppText
          variant="bodyStrong"
          color={value ? colors.foreground : colors.placeholder}
          style={styles.value}
        >
          {roleLabel(value) || 'Choose your role'}
        </AppText>
        <ChevronDown size={20} color={colors.mutedForeground} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setOpen(false)}
          accessibilityLabel="Close role list"
        >
          <View style={[styles.sheet, shadow.card]}>
            <AppText variant="label" style={styles.sheetTitle}>
              Choose your role
            </AppText>
            {ROLE_OPTIONS.map(role => {
              const selected = role.id === value;
              return (
                <Pressable
                  key={role.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    onChange(role.id);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText variant="bodyStrong" style={styles.value}>
                    {role.label}
                  </AppText>
                  {selected ? (
                    <Check
                      size={20}
                      color={colors.foreground}
                      strokeWidth={2.5}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
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
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: space.xl,
    backgroundColor: colors.backdrop,
  },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: space.xs,
  },
  sheetTitle: { paddingHorizontal: space.md, paddingVertical: space.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
