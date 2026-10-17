import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CircleCheck } from '../../components/icons';
import { AppText, Button, Eyebrow, Screen } from '../../components';
import { colors, radius, space } from '../../theme';

export default function JobCompletedScreen({ navigation }) {
  return (
    <Screen
      contentStyle={styles.content}
      footer={
        <Button
          title="Back to my work"
          onPress={() => navigation.popTo('Tabs', { screen: 'My Work' })}
        />
      }
    >
      <View style={styles.badge}>
        <CircleCheck size={44} color={colors.foreground} strokeWidth={1.75} />
      </View>
      <Eyebrow>Job completed</Eyebrow>
      <AppText variant="display" align="center">
        Nice work
      </AppText>
      <AppText variant="body" align="center" color={colors.mutedForeground}>
        The job is marked complete and now appears under Completed in My Work.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', justifyContent: 'center', gap: space.sm },
  badge: {
    width: 88,
    height: 88,
    borderRadius: radius.xxl,
    backgroundColor: colors.brandWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.md,
  },
});
