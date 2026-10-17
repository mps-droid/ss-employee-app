import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MessagesSquare, Users } from '../../components/icons';
import { apiGet, extractList, isEmptyListError } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import {
  AppText,
  EmptyState,
  Loader,
  ScreenTitle,
  TAB_EDGES,
} from '../../components';
import { colors, layout, radius, space } from '../../theme';
import { formatTime } from '../../utils/date';
import { errorMessage } from '../../utils/feedback';

export default function ChatListScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await apiGet(endpoints.chatGroups);
      setGroups(extractList(response.data?.data));
      setError('');
    } catch (e) {
      if (isEmptyListError(e)) {
        setGroups([]);
        setError('');
      } else {
        setError(errorMessage(e, 'Could not load your group chats.'));
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

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  let empty;
  if (loading) {
    empty = <Loader label="Loading chats…" />;
  } else if (error) {
    empty = (
      <EmptyState
        icon={MessagesSquare}
        title="Couldn’t load chats"
        message={error}
        actionLabel="Try again"
        onAction={load}
      />
    );
  } else {
    empty = (
      <EmptyState
        icon={MessagesSquare}
        title="No group chats yet"
        message="Groups your supervisor adds you to appear here."
      />
    );
  }

  return (
    <SafeAreaView edges={TAB_EDGES} style={styles.screen}>
      <FlatList
        data={loading ? [] : groups}
        keyExtractor={(item, index) =>
          String(item?.groupId ?? item?.id ?? index)
        }
        ListHeaderComponent={
          <ScreenTitle
            eyebrow="Chat"
            title="Group chats"
            style={styles.title}
          />
        }
        ListEmptyComponent={empty}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.foreground}
            colors={[colors.foreground]}
          />
        }
        renderItem={({ item, index }) => {
          const lastAt = item?.last_message_time || item?.lastMessageTime;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open ${item?.name} chat`}
              onPress={() =>
                navigation.navigate('ChatDetail', {
                  groupId: item?.groupId ?? item?.id,
                  groupName: item?.name,
                })
              }
              style={({ pressed }) => [
                styles.row,
                index > 0 && styles.rowBorder,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.avatar}>
                <Users size={22} color={colors.foreground} />
              </View>
              <View style={styles.text}>
                <AppText variant="subtitle" numberOfLines={1}>
                  {item?.name || 'Group'}
                </AppText>
                <AppText variant="small" numberOfLines={1}>
                  {item?.last_message ||
                    item?.displayMessage ||
                    'No messages yet'}
                </AppText>
              </View>
              {lastAt ? (
                <AppText variant="caption">{formatTime(lastAt)}</AppText>
              ) : null}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingBottom: space.xl },
  title: {
    paddingHorizontal: layout.gutter,
    paddingTop: space.lg,
    paddingBottom: space.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 72,
    paddingHorizontal: layout.gutter,
    paddingVertical: space.sm,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  pressed: { backgroundColor: colors.surface },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.brandWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
});
