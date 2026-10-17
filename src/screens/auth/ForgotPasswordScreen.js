import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { apiPost } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import {
  AppText,
  Button,
  Eyebrow,
  Header,
  Screen,
  TextField,
} from '../../components';
import { space } from '../../theme';
import { errorMessage, notify } from '../../utils/feedback';

const OTP_TYPE = 'forgot_password';

/**
 * Two steps: send a code to the email, then enter the code with a new password.
 * The final request's field names are not confirmed by the backend developer yet.
 */
export default function ForgotPasswordScreen({ navigation, route }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState(route.params?.email || '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setErrors({ email: 'Enter the email you log in with.' });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await apiPost(
        endpoints.sendOtp,
        { email: trimmed, type: OTP_TYPE },
        { auth: false },
      );
      notify.success('Code sent', `Check ${trimmed} for your reset code.`);
      setStep('reset');
    } catch (error) {
      notify.error(errorMessage(error, 'Could not send the code. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    const next = {};
    if (!code.trim()) {
      next.code = 'Enter the code from the email.';
    }
    if (!password) {
      next.password = 'Choose a new password.';
    }
    if (password && confirmPassword !== password) {
      next.confirmPassword = 'The passwords do not match.';
    }
    setErrors(next);
    if (Object.keys(next).length) {
      return;
    }
    setLoading(true);
    try {
      const trimmed = email.trim();
      await apiPost(
        endpoints.verifyOtp,
        { email: trimmed, otp: code.trim(), type: OTP_TYPE },
        { auth: false },
      );
      await apiPost(
        endpoints.forgotPassword,
        {
          email: trimmed,
          otp: code.trim(),
          new_password: password,
          confirm_password: confirmPassword,
        },
        { auth: false },
      );
      notify.success('Password changed', 'Log in with your new password.');
      navigation.goBack();
    } catch (error) {
      notify.error(
        errorMessage(error, 'Could not reset the password. Try again.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      keyboard
      header={<Header title="Reset password" />}
      footer={
        step === 'email' ? (
          <Button title="Send code" onPress={sendCode} loading={loading} />
        ) : (
          <>
            <Button
              title="Reset password"
              onPress={resetPassword}
              loading={loading}
            />
            <Button
              title="Send a new code"
              variant="ghost"
              onPress={sendCode}
              disabled={loading}
            />
          </>
        )
      }
    >
      <View style={styles.intro}>
        <Eyebrow>{step === 'email' ? 'Step 1 of 2' : 'Step 2 of 2'}</Eyebrow>
        <AppText variant="title">
          {step === 'email' ? 'Get a reset code' : 'Choose a new password'}
        </AppText>
        <AppText variant="body">
          {step === 'email'
            ? 'We’ll email you a code to reset your password.'
            : `Enter the code we sent to ${email.trim()}.`}
        </AppText>
      </View>

      <View style={styles.form}>
        {step === 'email' ? (
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            placeholder="name@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="send"
            onSubmitEditing={sendCode}
          />
        ) : (
          <>
            <TextField
              label="Code"
              value={code}
              onChangeText={setCode}
              error={errors.code}
              placeholder="6-digit code"
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
            />
            <TextField
              label="New password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secure
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
            />
            <TextField
              label="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              secure
              autoCapitalize="none"
              textContentType="newPassword"
            />
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space.xs, marginBottom: space.xl },
  form: { gap: space.lg },
});
