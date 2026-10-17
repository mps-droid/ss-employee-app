import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import images from '../../assets/images';
import { apiPost, persistSession, toRoleId } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { AppText, Button, Eyebrow, Screen, TextField } from '../../components';
import { colors, space } from '../../theme';
import { errorMessage, notify } from '../../utils/feedback';
import RolePicker from './RolePicker';

// Remembered between logins so staff don't pick their role every time.
const LAST_ROLE_KEY = 'lastRoleId';

export default function LoginScreen({ navigation }) {
  const [roleId, setRoleId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem(LAST_ROLE_KEY)
      .then(saved => saved && setRoleId(saved))
      .catch(() => {});
  }, []);

  const validate = () => {
    const next = {};
    if (!roleId) {
      next.role = 'Choose your role.';
    }
    if (!email.trim()) {
      next.email = 'Enter your email.';
    }
    if (!password) {
      next.password = 'Enter your password.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (loading || !validate()) {
      return;
    }
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const response = await apiPost(
        endpoints.login,
        { email: trimmedEmail, password },
        { auth: false, headers: { role_id: String(toRoleId(roleId)) } },
      );
      const json = response?.data || {};
      const user = json?.data && typeof json.data === 'object' ? json.data : {};
      const token = user?.tokens?.access?.token;

      if (json?.success === false || !token) {
        notify.error(
          json?.message || 'Login failed. Check your details and try again.',
        );
        return;
      }

      await persistSession({
        token,
        expires: user?.tokens?.access?.expires,
        // The server's role wins over the one picked on this screen.
        roleId: user?.role_id ?? roleId,
        userId: user?.id,
        userName:
          user?.name ||
          user?.user_profile?.name ||
          user?.user_name ||
          trimmedEmail,
      });
      await AsyncStorage.setItem(LAST_ROLE_KEY, String(roleId));
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'Tabs' }] }),
      );
    } catch (error) {
      notify.error(errorMessage(error, 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen keyboard contentStyle={styles.content}>
      <Image
        source={images.logo}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Social Sanitation"
      />

      <View style={styles.intro}>
        <Eyebrow>Employee app</Eyebrow>
        <AppText variant="display" accessibilityRole="header">
          Log in
        </AppText>
        <AppText variant="body">
          Use the work email and password your supervisor set up for you.
        </AppText>
      </View>

      <View style={styles.form}>
        <View>
          <RolePicker
            value={roleId}
            onChange={id => {
              setRoleId(id);
              setErrors(e => ({ ...e, role: undefined }));
            }}
          />
          {errors.role ? (
            <AppText
              variant="caption"
              color={colors.destructive}
              style={styles.roleError}
            >
              {errors.role}
            </AppText>
          ) : null}
        </View>
        <TextField
          label="Email"
          value={email}
          onChangeText={value => {
            setEmail(value);
            setErrors(e => ({ ...e, email: undefined }));
          }}
          error={errors.email}
          placeholder="name@company.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="username"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          submitBehavior="submit"
        />
        <TextField
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={value => {
            setPassword(value);
            setErrors(e => ({ ...e, password: undefined }));
          }}
          error={errors.password}
          placeholder="Your password"
          secure
          autoCapitalize="none"
          autoComplete="password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleLogin}
        />
      </View>

      <View style={styles.actions}>
        <Button title="Log in" onPress={handleLogin} loading={loading} />
        <Button
          title="Forgot password?"
          variant="ghost"
          onPress={() =>
            navigation.navigate('ForgotPassword', { email: email.trim() })
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', gap: space.xl },
  logo: {
    width: 180,
    aspectRatio: 960 / 558,
    alignSelf: 'flex-start',
  },
  intro: { gap: space.xs },
  form: { gap: space.lg },
  roleError: { marginTop: space.xs },
  actions: { gap: space.xs },
});
