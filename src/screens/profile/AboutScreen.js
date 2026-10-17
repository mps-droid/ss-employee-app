import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import images from '../../assets/images';
import { AppText, Eyebrow, Header, Screen } from '../../components';
import { colors, radius, space } from '../../theme';

export default function AboutScreen() {
  return (
    <Screen scroll header={<Header title="About" />}>
      <View style={styles.stack}>
        <Image
          source={images.aboutTeam}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel="The Social Sanitation team"
        />
        <View style={styles.text}>
          <Eyebrow>Social Sanitation</Eyebrow>
          <AppText variant="title">
            Commercial cleaning in Central Florida
          </AppText>
          <AppText variant="body">
            Social Sanitation is Central Florida’s #1 rated commercial cleaning
            company. Our main office is in Tampa, and we serve Hillsborough,
            Pinellas, Polk and Pasco counties and more.
          </AppText>
          <AppText variant="body">
            We started at the beginning of the COVID-19 pandemic, with one aim:
            a clean, safe workplace for our clients’ staff and their customers.
            Careful sanitizing keeps people healthy and businesses running.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: space.xl },
  image: {
    width: '100%',
    // iOS sets a local image's pixel height by default, which overrides aspectRatio.
    height: undefined,
    aspectRatio: 16 / 10,
    borderRadius: radius.lg,
    backgroundColor: colors.muted,
  },
  text: { gap: space.sm },
});
