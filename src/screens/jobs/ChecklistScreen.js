import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Circle, CircleCheck, ListChecks } from '../../components/icons';
import {
  apiGet,
  apiPost,
  extractList,
  isEmptyListError,
} from '../../api/client';
import { endpoints } from '../../api/endpoints';
import {
  AppText,
  Button,
  EmptyState,
  Header,
  Loader,
  Screen,
} from '../../components';
import { colors, radius, space } from '../../theme';
import { errorMessage, notify } from '../../utils/feedback';

/**
 * The quality inspector ticks items off as they check them. The API can only mark
 * an item completed, so a ticked item stays ticked.
 */
export default function ChecklistScreen({ navigation, route }) {
  const jobId = route.params?.jobId;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(null);

  const load = useCallback(async () => {
    try {
      const response = await apiGet(`${endpoints.checklist}/${jobId}`);
      setItems(extractList(response.data?.data));
      setError('');
    } catch (e) {
      if (isEmptyListError(e)) {
        setItems([]);
        setError('');
      } else {
        setError(errorMessage(e, 'Could not load the checklist.'));
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const markDone = async item => {
    if (item.is_completed || saving) {
      return;
    }
    setSaving(item.id);
    setItems(list =>
      list.map(i => (i.id === item.id ? { ...i, is_completed: true } : i)),
    );
    try {
      await apiPost(`${endpoints.completeChecklistItem}/${item.id}`, {
        booking_id: jobId,
      });
    } catch (e) {
      setItems(list =>
        list.map(i => (i.id === item.id ? { ...i, is_completed: false } : i)),
      );
      notify.error(errorMessage(e, 'Could not save that item. Try again.'));
    } finally {
      setSaving(null);
    }
  };

  const done = items.filter(item => item.is_completed).length;

  let body;
  if (loading) {
    body = <Loader fill label="Loading checklist…" />;
  } else if (error) {
    body = (
      <EmptyState
        icon={ListChecks}
        title="Couldn’t load the checklist"
        message={error}
        actionLabel="Try again"
        onAction={load}
      />
    );
  } else if (!items.length) {
    body = (
      <EmptyState
        icon={ListChecks}
        title="No checklist for this job"
        message="This job has no checklist items to check."
      />
    );
  } else {
    body = (
      <View style={styles.stack}>
        <View style={styles.progressHead}>
          <AppText variant="label">Progress</AppText>
          <AppText variant="small">
            {done} of {items.length} done
          </AppText>
        </View>
        <View style={styles.track}>
          <View
            style={[styles.fill, { width: `${(done / items.length) * 100}%` }]}
          />
        </View>
        <View style={styles.list}>
          {items.map((item, index) => {
            const complete = !!item.is_completed;
            return (
              <Pressable
                key={item.id ?? index}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: complete, disabled: complete }}
                accessibilityLabel={item.task}
                disabled={complete}
                onPress={() => markDone(item)}
                style={({ pressed }) => [
                  styles.item,
                  index > 0 && styles.itemBorder,
                  pressed && styles.pressed,
                ]}
              >
                {complete ? (
                  <CircleCheck
                    size={24}
                    color={colors.background}
                    fill={colors.success}
                  />
                ) : (
                  <Circle size={24} color={colors.mutedForeground} />
                )}
                <AppText
                  variant="body"
                  color={complete ? colors.mutedForeground : colors.foreground}
                  style={styles.task}
                >
                  {item.task}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        <AppText variant="caption">
          Ticked items are saved straight away and cannot be unticked.
        </AppText>
      </View>
    );
  }

  return (
    <Screen
      scroll={!loading}
      header={<Header title="Checklist" />}
      footer={
        items.length ? (
          <Button title="Done" onPress={() => navigation.goBack()} />
        ) : null
      }
    >
      {body}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: space.md },
  progressHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.muted,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.primary },
  list: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 56,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  pressed: { backgroundColor: colors.surface },
  task: { flex: 1 },
});
