import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Eye, EyeOff } from './icons';
import { colors, fonts, layout, radius, space } from '../theme';
import AppText from './AppText';

/**
 * The website's form field: an uppercase label above a square-cornered input whose
 * border turns green on focus, with a soft green ring around it.
 */
export default function TextField({
  ref,
  label,
  error,
  hint,
  secure = false,
  multiline = false,
  editable = true,
  style,
  inputStyle,
  onFocus,
  onBlur,
  ...inputProps
}) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={[styles.field, style]}>
      {label ? <AppText variant="label">{label}</AppText> : null}
      <View>
        <View
          style={[
            styles.box,
            multiline && styles.multilineBox,
            focused && styles.boxFocused,
            !!error && styles.boxError,
            !editable && styles.boxDisabled,
          ]}
        >
          <TextInput
            ref={ref}
            editable={editable}
            multiline={multiline}
            secureTextEntry={secure && hidden}
            placeholderTextColor={colors.placeholder}
            selectionColor={colors.foreground}
            cursorColor={colors.foreground}
            accessibilityLabel={label}
            style={[
              styles.input,
              multiline && styles.multilineInput,
              !editable && styles.inputDisabled,
              inputStyle,
            ]}
            onFocus={event => {
              setFocused(true);
              onFocus?.(event);
            }}
            onBlur={event => {
              setFocused(false);
              onBlur?.(event);
            }}
            {...inputProps}
          />
          {secure ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
              onPress={() => setHidden(h => !h)}
              hitSlop={layout.hitSlop}
              style={styles.toggle}
            >
              {hidden ? (
                <Eye size={20} color={colors.mutedForeground} />
              ) : (
                <EyeOff size={20} color={colors.mutedForeground} />
              )}
            </Pressable>
          ) : null}
        </View>
        {focused ? <View pointerEvents="none" style={styles.ring} /> : null}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.destructive}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption">{hint}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 9 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  multilineBox: { alignItems: 'flex-start', minHeight: 120 },
  boxFocused: { borderColor: colors.primary },
  boxError: { borderColor: colors.destructive },
  boxDisabled: { backgroundColor: colors.muted },
  ring: {
    position: 'absolute',
    top: -3,
    bottom: -3,
    left: -3,
    right: -3,
    borderRadius: radius.md + 3,
    borderWidth: 2,
    borderColor: colors.focusRing,
  },
  input: {
    flex: 1,
    paddingHorizontal: space.md,
    paddingVertical: 14,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.foreground,
  },
  multilineInput: { minHeight: 118, textAlignVertical: 'top' },
  inputDisabled: { color: colors.mutedForeground },
  toggle: {
    width: layout.minTouch,
    height: layout.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.xxs,
  },
});
