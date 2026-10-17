import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { colors, layout, space } from '../theme';

const ALL_EDGES = ['top', 'right', 'bottom', 'left'];
// Tab screens leave the bottom inset to the tab bar.
export const TAB_EDGES = ['top', 'right', 'left'];

/**
 * Page container: safe-area insets (the app draws edge to edge), the brand background,
 * optional scrolling or keyboard-aware scrolling, and an optional pinned footer.
 */
export default function Screen({
  children,
  header,
  footer,
  scroll = false,
  keyboard = false,
  padded = true,
  edges = ALL_EDGES,
  refreshControl,
  contentStyle,
  style,
}) {
  const padding = padded ? styles.padded : null;
  let body;
  if (keyboard) {
    body = (
      <KeyboardAwareScrollView
        bottomOffset={space.xl}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.grow, padding, contentStyle]}
      >
        {children}
      </KeyboardAwareScrollView>
    );
  } else if (scroll) {
    body = (
      <ScrollView
        refreshControl={refreshControl}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.grow, padding, contentStyle]}
      >
        {children}
      </ScrollView>
    );
  } else {
    body = <View style={[styles.fill, padding, contentStyle]}>{children}</View>;
  }

  return (
    <SafeAreaView edges={edges} style={[styles.fill, styles.screen, style]}>
      {header}
      {body}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  fill: { flex: 1 },
  grow: { flexGrow: 1 },
  padded: { paddingHorizontal: layout.gutter, paddingVertical: space.lg },
  footer: {
    paddingHorizontal: layout.gutter,
    paddingTop: space.sm,
    paddingBottom: space.md,
    gap: space.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
