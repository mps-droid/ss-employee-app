import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  limitToLast,
  onValue,
  push,
  query,
  ref,
} from '@react-native-firebase/database';
import { MessagesSquare, SendHorizontal } from '../../components/icons';
import { chatDatabase } from '../../api/firebase';
import {
  AppText,
  EmptyState,
  Header,
  ImageViewer,
  Loader,
} from '../../components';
import useSession from '../../hooks/useSession';
import { colors, fonts, layout, radius, space } from '../../theme';
import { formatTime } from '../../utils/date';
import { logError, notify } from '../../utils/feedback';

// Enough history for the conversation without downloading all of it on every message.
const MESSAGE_LIMIT = 200;

const toMessages = snapshotValue =>
  Object.entries(snapshotValue || {})
    .map(([key, value]) => ({ key, ...value }))
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

export default function ChatThreadScreen({ route }) {
  const { groupId, groupName } = route.params || {};
  const session = useSession();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [viewing, setViewing] = useState(null);

  const path = `GroupChats/${groupId}/messages`;

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return undefined;
    }
    const messagesQuery = query(
      ref(chatDatabase(), path),
      limitToLast(MESSAGE_LIMIT),
    );
    const unsubscribe = onValue(
      messagesQuery,
      snapshot => {
        setMessages(toMessages(snapshot.val()));
        setLoading(false);
      },
      error => {
        logError('chat', error);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [groupId, path]);

  // Newest first, for the inverted list that starts at the bottom.
  const newestFirst = useMemo(() => [...messages].reverse(), [messages]);
  const myId = session?.userId ? `user_${session.userId}` : null;

  const send = async () => {
    const text = draft.trim();
    if (!text || sending || !session) {
      return;
    }
    setSending(true);
    try {
      await push(ref(chatDatabase(), path), {
        message: text,
        sender: myId,
        sender_name: session.userName || 'Employee',
        timestamp: new Date().toISOString(),
      });
      setDraft('');
    } catch (error) {
      logError('chat send', error);
      notify.error('Message not sent. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item, index }) => {
    const mine = item.sender === myId;
    // In a run of messages from one person, the name shows once, above the first.
    const older = newestFirst[index + 1];
    const showName = !mine && (!older || older.sender !== item.sender);
    return (
      <View style={[styles.messageRow, mine ? styles.mine : styles.theirs]}>
        {showName ? (
          <AppText variant="caption" style={styles.sender}>
            {item.sender_name || 'Team member'}
          </AppText>
        ) : null}
        {item.image_url ? (
          <Pressable
            accessibilityRole="imagebutton"
            accessibilityLabel="Open photo"
            onPress={() => setViewing(item.image_url)}
          >
            <Image source={{ uri: item.image_url }} style={styles.photo} />
          </Pressable>
        ) : null}
        {item.message ? (
          <View
            style={[
              styles.bubble,
              mine ? styles.bubbleMine : styles.bubbleTheirs,
            ]}
          >
            <AppText
              variant="body"
              color={mine ? colors.primaryForeground : colors.foreground}
            >
              {item.message}
            </AppText>
          </View>
        ) : null}
        <AppText variant="caption" style={styles.time}>
          {formatTime(item.timestamp)}
        </AppText>
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right', 'bottom']}
      style={styles.screen}
    >
      <Header title={groupName || 'Chat'} />
      <KeyboardAvoidingView behavior="padding" style={styles.fill}>
        {loading ? (
          <Loader fill label="Loading messages…" />
        ) : (
          <FlatList
            inverted={messages.length > 0}
            data={newestFirst}
            keyExtractor={item => item.key}
            renderItem={renderMessage}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <EmptyState
                icon={MessagesSquare}
                title="No messages yet"
                message="Say hello to your team."
              />
            }
          />
        )}
        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Write a message"
            placeholderTextColor={colors.placeholder}
            accessibilityLabel="Message"
            multiline
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send message"
            accessibilityState={{ disabled: !draft.trim() || sending }}
            disabled={!draft.trim() || sending}
            onPress={send}
            style={({ pressed }) => [
              styles.send,
              (!draft.trim() || sending) && styles.sendDisabled,
              pressed && styles.sendPressed,
            ]}
          >
            <SendHorizontal size={20} color={colors.primaryForeground} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <ImageViewer uri={viewing} onClose={() => setViewing(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1 },
  list: { flexGrow: 1, padding: layout.gutter, gap: space.xs },
  messageRow: { maxWidth: '82%', gap: 4, marginVertical: 2 },
  mine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  theirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  sender: { fontFamily: fonts.bold, color: colors.foreground },
  bubble: {
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.xl,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius.sm,
  },
  bubbleTheirs: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: radius.sm,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: radius.xl,
    backgroundColor: colors.muted,
  },
  time: { fontSize: 11 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space.xs,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: space.md,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.card,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.foreground,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.4 },
  sendPressed: { opacity: 0.8 },
});
