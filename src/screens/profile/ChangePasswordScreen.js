import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { apiPost } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { Button, Header, Screen, TextField } from '../../components';
import { space } from '../../theme';
import { errorMessage, notify } from '../../utils/feedback';

export default function ChangePasswordScreen({ navigation }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const found = {};
    if (!current) {
      found.current = 'Enter your current password.';
    }
    if (!next) {
      found.next = 'Choose a new password.';
    }
    if (next && confirm !== next) {
      found.confirm = 'The new passwords do not match.';
    }
    setErrors(found);
    if (Object.keys(found).length || saving) {
      return;
    }
    setSaving(true);
    try {
      const response = await apiPost(endpoints.changePassword, {
        old_password: current,
        new_password: next,
        confirm_password: confirm,
      });
      if (response.data?.success === false) {
        throw new Error(response.data?.message);
      }
      notify.success('Password changed');
      navigation.goBack();
    } catch (e) {
      notify.error(
        errorMessage(e, 'Could not change your password. Try again.'),
      );
    } finally {
      setSaving(false);
    }
  };

  const clear = key => setErrors(e => ({ ...e, [key]: undefined }));

  return (
    <Screen
      keyboard
      header={<Header title="Change password" />}
      footer={
        <Button title="Update password" onPress={save} loading={saving} />
      }
    >
      <View style={styles.form}>
        <TextField
          label="Current password"
          value={current}
          onChangeText={value => {
            setCurrent(value);
            clear('current');
          }}
          error={errors.current}
          secure
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
        />
        <TextField
          label="New password"
          value={next}
          onChangeText={value => {
            setNext(value);
            clear('next');
          }}
          error={errors.next}
          secure
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <TextField
          label="Confirm new password"
          value={confirm}
          onChangeText={value => {
            setConfirm(value);
            clear('confirm');
          }}
          error={errors.confirm}
          secure
          autoCapitalize="none"
          textContentType="newPassword"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: space.lg },
});
