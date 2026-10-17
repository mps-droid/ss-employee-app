import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from './icons';
import { colors, space } from '../theme';
import AppText from './AppText';
import IconButton from './IconButton';

/**
 * Header for screens opened on top of the tabs: back arrow, title, optional action.
 */
export default function Header({ title, onBack, right, style }) {
  const navigation = useNavigation();
  const goBack =
    onBack || (navigation.canGoBack() ? () => navigation.goBack() : null);

  return (
    <View style={[styles.row, style]}>
      {goBack ? (
        <IconButton icon={ArrowLeft} label="Go back" onPress={goBack} />
      ) : (
        <View style={styles.placeholder} />
      )}
      <AppText
        variant="heading"
        numberOfLines={1}
        accessibilityRole="header"
        style={styles.title}
      >
        {title}
      </AppText>
      {right || <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    paddingHorizontal: space.xs,
    paddingVertical: space.xxs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  title: { flex: 1 },
  placeholder: { width: 44, height: 44 },
});
