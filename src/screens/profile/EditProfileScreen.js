import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { apiGet, apiPut } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import {
  Button,
  EmptyState,
  Header,
  Loader,
  Screen,
  TextField,
} from '../../components';
import { space } from '../../theme';
import { errorMessage, notify } from '../../utils/feedback';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await apiGet(endpoints.profile);
      const profile = response.data?.data || {};
      setName(profile?.user_profile?.name || profile?.name || '');
      setEmail(profile?.email || '');
      setPhone(profile?.user_profile?.mobile || profile?.mobile || '');
      setLoadError('');
    } catch (e) {
      setLoadError(errorMessage(e, 'Could not load your details.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    const next = {};
    if (!name.trim()) {
      next.name = 'Enter your name.';
    }
    if (!phone.trim()) {
      next.phone = 'Enter your phone number.';
    }
    setErrors(next);
    if (Object.keys(next).length || saving) {
      return;
    }
    setSaving(true);
    try {
      await apiPut(endpoints.updateProfile, {
        name: name.trim(),
        mobile: phone.trim(),
      });
      notify.success('Profile saved');
      navigation.goBack();
    } catch (e) {
      notify.error(errorMessage(e, 'Could not save your profile. Try again.'));
    } finally {
      setSaving(false);
    }
  };

  let body;
  if (loading) {
    body = <Loader fill label="Loading your details…" />;
  } else if (loadError) {
    body = (
      <EmptyState
        title="Couldn’t load your details"
        message={loadError}
        actionLabel="Try again"
        onAction={load}
      />
    );
  } else {
    body = (
      <View style={styles.form}>
        <TextField
          label="Name"
          value={name}
          onChangeText={value => {
            setName(value);
            setErrors(e => ({ ...e, name: undefined }));
          }}
          error={errors.name}
          autoComplete="name"
          textContentType="name"
          autoCapitalize="words"
        />
        <TextField
          label="Email"
          value={email}
          editable={false}
          hint="Ask your supervisor if your email needs to change."
        />
        <TextField
          label="Phone number"
          value={phone}
          onChangeText={value => {
            setPhone(value);
            setErrors(e => ({ ...e, phone: undefined }));
          }}
          error={errors.phone}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
        />
      </View>
    );
  }

  return (
    <Screen
      keyboard={!loading && !loadError}
      header={<Header title="Edit profile" />}
      footer={
        !loading && !loadError ? (
          <Button title="Save changes" onPress={save} loading={saving} />
        ) : null
      }
    >
      {body}
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: space.lg },
});
