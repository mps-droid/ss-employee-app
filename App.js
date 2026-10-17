import React, { useEffect } from 'react';
import { AppState, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { getAuthHeaders } from './src/api/client';
import { toastConfig } from './src/components';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/navigationRef';
import { colors } from './src/theme';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.foreground,
    background: colors.background,
    card: colors.card,
    text: colors.foreground,
    border: colors.border,
  },
};

function ToastHost() {
  const insets = useSafeAreaInsets();
  return <Toast config={toastConfig} topOffset={insets.top + 8} />;
}

export default function App() {
  useEffect(() => {
    // Unexpected errors show a plain message; the technical detail stays in development builds.
    const previousHandler = global.ErrorUtils?.getGlobalHandler?.();
    global.ErrorUtils?.setGlobalHandler?.((error, isFatal) => {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: __DEV__
          ? error?.message
          : 'Please try again. If it keeps happening, restart the app.',
      });
      previousHandler?.(error, isFatal);
    });

    // Coming back to the app checks the session, so an expired one goes to Login.
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        getAuthHeaders().catch(() => {});
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <StatusBar barStyle="dark-content" />
          <NavigationContainer ref={navigationRef} theme={navigationTheme}>
            <RootNavigator />
          </NavigationContainer>
          <ToastHost />
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});
