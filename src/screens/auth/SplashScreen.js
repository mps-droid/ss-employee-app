import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import images from '../../assets/images';
import {
  clearSessionStorage,
  getSession,
  isTokenExpired,
} from '../../api/client';
import { colors } from '../../theme';
import { logError } from '../../utils/feedback';

// Shows the logo while the saved session is checked, then moves on straight away.
export default function SplashScreen({ navigation }) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let next = 'Login';
      try {
        const { token, tokenExpires } = await getSession();
        if (token && !isTokenExpired(token, tokenExpires)) {
          next = 'Tabs';
        } else if (token) {
          await clearSessionStorage();
        }
      } catch (error) {
        logError('splash', error);
      }
      if (!cancelled) {
        navigation.replace(next);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={images.logo}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Social Sanitation"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logo: { width: '64%', maxWidth: 320, aspectRatio: 960 / 558 },
});
