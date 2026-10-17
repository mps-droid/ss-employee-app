import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Send } from '../../components/icons';
import { apiPost } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import {
  AppText,
  Button,
  DateField,
  Header,
  Screen,
  TextField,
} from '../../components';
import { space } from '../../theme';
import { dayjs, toApiDate } from '../../utils/date';
import { errorMessage, notify } from '../../utils/feedback';

export default function ApplyLeaveScreen({ navigation }) {
  const today = dayjs().startOf('day').toDate();
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  // The last day can never fall before the first day.
  const changeStart = date => {
    setStart(date);
    if (dayjs(date).isAfter(end, 'day')) {
      setEnd(date);
    }
  };

  const days = dayjs(end).diff(dayjs(start), 'day') + 1;

  const send = async () => {
    if (sending) {
      return;
    }
    if (!reason.trim()) {
      setError('Tell your supervisor why you need the leave.');
      return;
    }
    setSending(true);
    try {
      await apiPost(endpoints.applyLeave, {
        leave_reason: reason.trim(),
        start_date: toApiDate(start),
        end_date: toApiDate(end),
      });
      notify.success(
        'Leave request sent',
        'You’ll see its status under Leaves.',
      );
      navigation.goBack();
    } catch (e) {
      notify.error(errorMessage(e, 'Could not send the request. Try again.'));
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen
      keyboard
      header={<Header title="Apply for leave" />}
      footer={
        <Button
          title="Send request"
          icon={Send}
          onPress={send}
          loading={sending}
        />
      }
    >
      <View style={styles.form}>
        <View style={styles.dates}>
          <DateField
            label="First day"
            value={start}
            onChange={changeStart}
            minimumDate={today}
            style={styles.date}
          />
          <DateField
            label="Last day"
            value={end}
            onChange={setEnd}
            minimumDate={start}
            style={styles.date}
          />
        </View>
        <AppText variant="small">
          {days === 1 ? '1 day' : `${days} days`} of leave
        </AppText>
        <TextField
          label="Reason"
          value={reason}
          onChangeText={value => {
            setReason(value);
            setError('');
          }}
          error={error}
          multiline
          placeholder="For example: doctor’s appointment"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: space.lg },
  dates: { flexDirection: 'row', gap: space.sm },
  date: { flex: 1 },
});
