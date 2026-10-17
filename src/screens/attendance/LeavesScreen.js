import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CalendarDays, CalendarPlus } from '../../components/icons';
import { apiGet, extractList, isEmptyListError } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import {
  AppText,
  Button,
  Card,
  EmptyState,
  Header,
  Loader,
  Screen,
  StatusPill,
} from '../../components';
import { leaveStatusDisplay } from '../../constants/statuses';
import { colors, space } from '../../theme';
import { formatDate } from '../../utils/date';
import { errorMessage } from '../../utils/feedback';

const leaveDates = leave => {
  const start = leave?.start_date || leave?.leave_date;
  const end = leave?.end_date;
  const first = formatDate(start, 'D MMM YYYY');
  const last = formatDate(end, 'D MMM YYYY');
  return last && last !== first ? `${first} – ${last}` : first;
};

export default function LeavesScreen({ navigation }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await apiGet(endpoints.leaves);
      setLeaves(extractList(response.data?.data));
      setError('');
    } catch (e) {
      if (isEmptyListError(e)) {
        setLeaves([]);
        setError('');
      } else {
        setError(errorMessage(e, 'Could not load your leave requests.'));
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

  const apply = () => navigation.navigate('ApplyLeave');

  let empty;
  if (loading) {
    empty = <Loader label="Loading leave requests…" />;
  } else if (error) {
    empty = (
      <EmptyState
        icon={CalendarDays}
        title="Couldn’t load your leave"
        message={error}
        actionLabel="Try again"
        onAction={load}
      />
    );
  } else {
    empty = (
      <EmptyState
        icon={CalendarDays}
        title="No leave requests"
        message="Requests you send appear here with their status."
      />
    );
  }

  return (
    <Screen
      padded={false}
      header={<Header title="Leaves" />}
      footer={
        <Button title="Apply for leave" icon={CalendarPlus} onPress={apply} />
      }
    >
      <FlatList
        data={loading ? [] : leaves}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        ListEmptyComponent={empty}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => {
          const status = leaveStatusDisplay(item?.leave_status);
          return (
            <Card style={styles.card}>
              <StatusPill label={status.label} tone={status.tone} />
              <AppText variant="subtitle">
                {item?.leave_reason || 'No reason given'}
              </AppText>
              <View style={styles.inline}>
                <CalendarDays size={15} color={colors.mutedForeground} />
                <AppText variant="small">{leaveDates(item)}</AppText>
              </View>
            </Card>
          );
        }}
      />
    </Screen>
  );
}

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: space.lg },
  card: { gap: space.xs },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  separator: { height: space.sm },
});
