import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import {
  BriefcaseBusiness,
  Info,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Trash2,
  UserRound,
} from '../../components/icons';
import {
  apiDelete,
  apiGet,
  clearSessionStorage,
  getSession,
} from '../../api/client';
import { endpoints } from '../../api/endpoints';
import {
  AppText,
  Button,
  EmptyState,
  IconButton,
  ListRow,
  Loader,
  ScreenTitle,
  TAB_EDGES,
} from '../../components';
import { roleLabel } from '../../constants/roles';
import { colors, layout, radius, space } from '../../theme';
import { errorMessage, logError, notify } from '../../utils/feedback';

const DetailRow = ({ icon: Icon, label, value }) => (
  <View style={styles.detail}>
    <Icon size={18} color={colors.mutedForeground} />
    <View style={styles.detailText}>
      <AppText variant="caption">{label}</AppText>
      <AppText variant="bodyStrong">{value || 'Not set'}</AppText>
    </View>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [response, session] = await Promise.all([
        apiGet(endpoints.profile),
        getSession(),
      ]);
      if (response.data?.success === false) {
        throw new Error(response.data?.message);
      }
      setProfile(response.data?.data || {});
      setRole(roleLabel(session.roleId));
      setError('');
    } catch (e) {
      setError(errorMessage(e, 'Could not load your profile.'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Reloads after Edit Profile, so the new name shows straight away.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const goToLogin = async () => {
    await clearSessionStorage();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }),
    );
  };

  const logOut = () =>
    Alert.alert(
      'Log out?',
      'You’ll need your email and password to log back in.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiGet(endpoints.logout);
            } catch (e) {
              logError('logout', e);
            } finally {
              await goToLogin();
            }
          },
        },
      ],
    );

  const deleteAccount = () =>
    Alert.alert(
      'Delete your account?',
      'Your account will be deactivated and you will be logged out. You can’t undo this from the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiDelete(endpoints.deactivateAccount);
              await goToLogin();
            } catch (e) {
              notify.error(errorMessage(e, 'Could not delete the account.'));
            }
          },
        },
      ],
    );

  const name = profile?.user_profile?.name || profile?.name;
  const phone = profile?.user_profile?.mobile || profile?.mobile;

  let body;
  if (loading) {
    body = <Loader fill label="Loading your profile…" />;
  } else if (error) {
    body = (
      <View style={styles.fill}>
        <EmptyState
          icon={UserRound}
          title="Couldn’t load your profile"
          message={error}
          actionLabel="Try again"
          onAction={load}
        />
        <Button
          title="Log out"
          icon={LogOut}
          variant="outline"
          onPress={logOut}
        />
      </View>
    );
  } else {
    body = (
      <View style={styles.stack}>
        <View style={styles.card}>
          <DetailRow icon={Mail} label="Email" value={profile?.email} />
          <DetailRow icon={Phone} label="Phone" value={phone} />
          <DetailRow icon={BriefcaseBusiness} label="Role" value={role} />
        </View>

        <View style={styles.group}>
          <ListRow
            icon={Info}
            label="About Social Sanitation"
            onPress={() => navigation.navigate('About')}
          />
          <View style={styles.divider} />
          <ListRow
            icon={Lock}
            label="Change password"
            onPress={() => navigation.navigate('ChangePassword')}
          />
        </View>

        <View style={styles.group}>
          <ListRow
            icon={LogOut}
            label="Log out"
            onPress={logOut}
            showChevron={false}
          />
          <View style={styles.divider} />
          <ListRow
            icon={Trash2}
            label="Delete account"
            destructive
            onPress={deleteAccount}
            showChevron={false}
          />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView edges={TAB_EDGES} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle
          eyebrow="Profile"
          title={name || 'Your profile'}
          right={
            profile ? (
              <IconButton
                icon={Pencil}
                label="Edit profile"
                onPress={() => navigation.navigate('EditProfile')}
                style={styles.edit}
              />
            ) : null
          }
        />
        {body}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    gap: space.xl,
    paddingHorizontal: layout.gutter,
    paddingTop: space.lg,
    paddingBottom: space.xl,
  },
  fill: { flex: 1, justifyContent: 'center' },
  stack: { gap: space.lg },
  card: {
    gap: space.md,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  detail: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  detailText: { flex: 1, gap: 2 },
  group: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  divider: { height: 1, backgroundColor: colors.border },
  edit: { borderWidth: 1, borderColor: colors.border },
});
