import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { BellOff, Check, CheckCheck } from '../../components/icons';
import {
  apiGet,
  apiPost,
  extractList,
  isEmptyListError,
} from '../../api/client';
import { endpoints } from '../../api/endpoints';
import {
  AppText,
  EmptyState,
  Header,
  IconButton,
  Loader,
  Screen,
} from '../../components';
import { colors, radius, space } from '../../theme';
import { formatDate } from '../../utils/date';
import { errorMessage, notify } from '../../utils/feedback';

const ACTION_WIDTH = 96;

/**
 * Notifications are marked as read (the API has no delete). Swipe a notification left
 * to mark it read, or use the header button to mark them all.
 */
export default function NotificationsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await apiGet(endpoints.notifications);
      setItems(extractList(response.data?.data?.notifications));
      setError('');
    } catch (e) {
      if (isEmptyListError(e)) {
        setItems([]);
        setError('');
      } else {
        setError(errorMessage(e, 'Could not load notifications.'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const markRead = async id => {
    try {
      await apiPost(endpoints.markNotificationRead, { notification_id: id });
      setItems(list => list.filter(item => item?.id !== id));
    } catch (e) {
      notify.error(errorMessage(e, 'Could not mark it as read.'));
    }
  };

  const markAllRead = () =>
    Alert.alert('Mark all as read?', 'This clears your notification list.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Mark all read',
        onPress: async () => {
          try {
            await apiPost(endpoints.markAllNotificationsRead);
            setItems([]);
            notify.success('All notifications marked as read');
          } catch (e) {
            notify.error(errorMessage(e, 'Could not mark them as read.'));
          }
        },
      },
    ]);

  let body;
  if (loading) {
    body = <Loader fill label="Loading notifications…" />;
  } else if (error) {
    body = (
      <EmptyState
        icon={BellOff}
        title="Couldn’t load notifications"
        message={error}
        actionLabel="Try again"
        onAction={load}
      />
    );
  } else if (!items.length) {
    body = (
      <EmptyState
        icon={BellOff}
        title="You’re all caught up"
        message="New notifications about jobs and leave appear here."
      />
    );
  } else {
    body = (
      <SwipeListView
        data={items}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        contentContainerStyle={styles.list}
        disableRightSwipe
        rightOpenValue={-ACTION_WIDTH}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <AppText variant="body">{item?.notification}</AppText>
            <AppText variant="caption">
              {formatDate(item?.created_at, 'D MMM YYYY · h:mm A')}
            </AppText>
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.hidden}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mark as read"
              onPress={() => markRead(item?.id)}
              style={styles.action}
            >
              <Check size={20} color={colors.primaryForeground} />
              <AppText variant="caption" color={colors.primaryForeground}>
                Mark read
              </AppText>
            </Pressable>
          </View>
        )}
      />
    );
  }

  return (
    <Screen
      padded={false}
      header={
        <Header
          title="Notifications"
          right={
            items.length ? (
              <IconButton
                icon={CheckCheck}
                label="Mark all as read"
                onPress={markAllRead}
              />
            ) : null
          }
        />
      }
    >
      {body}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: space.lg, gap: space.sm },
  item: {
    gap: space.xxs,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  hidden: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  action: {
    width: ACTION_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
});
