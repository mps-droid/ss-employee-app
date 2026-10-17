import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { CalendarDays, Clock, LogIn, LogOut } from '../../components/icons';
import {
  apiGet,
  apiPost,
  apiUpload,
  extractList,
  isEmptyListError,
  isUnauthorizedError,
} from '../../api/client';
import { endpoints } from '../../api/endpoints';
import {
  AppText,
  Button,
  Card,
  DateField,
  EmptyState,
  Loader,
  ScreenTitle,
  Section,
  StatusPill,
  TAB_EDGES,
} from '../../components';
import { colors, layout, space } from '../../theme';
import {
  dayjs,
  formatDate,
  formatTime,
  formatWorkedTime,
  nowApiDateTime,
  toApiDate,
} from '../../utils/date';
import { errorMessage, logError, notify } from '../../utils/feedback';
import { choosePhotos, takePhoto, toUploadFile } from '../../utils/photos';
import ClockTimer from './ClockTimer';
import {
  clearSavedClockIn,
  getCoordinates,
  parseClockInMs,
  readSavedClockIn,
  saveClockIn,
} from './clockIn';

const attendanceDate = item =>
  item?.clock_in_est || item?.clock_in || item?.created_at;

const clockRange = item => {
  const start = formatTime(item?.clock_in_est || item?.clock_in);
  if (!start) {
    return 'Time not recorded';
  }
  const end = formatTime(item?.clock_out_est || item?.clock_out);
  return `${start} – ${end || 'still clocked in'}`;
};

export default function AttendanceScreen({ navigation }) {
  const [clockInAt, setClockInAt] = useState(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [from, setFrom] = useState(() => dayjs().subtract(6, 'month').toDate());
  const [to, setTo] = useState(() => new Date());
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const inFlight = useRef(false);

  const startTimer = useCallback(epoch => {
    setClockInAt(epoch);
    setClockedIn(true);
  }, []);

  const stopTimer = useCallback(async () => {
    setClockInAt(null);
    setClockedIn(false);
    await clearSavedClockIn();
  }, []);

  // The saved clock-in shows straight away; the server's answer then confirms or clears it.
  const loadClockInStatus = useCallback(async () => {
    const saved = await readSavedClockIn().catch(() => null);
    if (saved) {
      startTimer(saved);
    }
    try {
      const response = await apiGet(endpoints.clockInStatus);
      const status = response.data?.data || {};
      const isClockedIn = Boolean(status.isClockedIn ?? status.is_clocked_in);
      if (response.data?.success && isClockedIn) {
        const fromApi = parseClockInMs(
          status.clock_in_time ||
            status.clockInTime ||
            status.clock_in ||
            status.clockIn,
        );
        const epochs = [saved, fromApi].filter(
          ms => Number.isFinite(ms) && ms <= Date.now() + 2000,
        );
        if (epochs.length) {
          const epoch = Math.min(...epochs);
          await saveClockIn(epoch);
          startTimer(epoch);
        } else {
          setClockedIn(true);
        }
        return;
      }
      await stopTimer();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        await stopTimer();
        return;
      }
      logError('clock-in status', error);
    }
  }, [startTimer, stopTimer]);

  const loadHistory = useCallback(async (start, end) => {
    setHistoryLoading(true);
    try {
      const response = await apiPost(endpoints.attendance, {
        start_date: toApiDate(start),
        end_date: toApiDate(end),
      });
      setHistory(extractList(response.data?.data));
      setHistoryError('');
    } catch (error) {
      setHistory([]);
      setHistoryError(
        isEmptyListError(error)
          ? ''
          : errorMessage(error, 'Could not load your attendance.'),
      );
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadClockInStatus();
      loadHistory(from, to);
    }, [loadClockInStatus, loadHistory, from, to]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        loadClockInStatus();
      }
    });
    return () => subscription.remove();
  }, [loadClockInStatus]);

  const hasAssignedTaskToday = async () => {
    try {
      const response = await apiGet(endpoints.todaysBookings);
      const payload = response.data?.data;
      const count = Number(payload?.count);
      return (Number.isFinite(count) ? count : extractList(payload).length) > 0;
    } catch (error) {
      // "No bookings found" means no job today, which is not a failed check.
      if (isEmptyListError(error)) {
        return false;
      }
      throw error;
    }
  };

  const submit = async (type, asset) => {
    const isIn = type === 'in';
    const image = toUploadFile(asset, 'attendance');
    if (!image || inFlight.current) {
      return;
    }
    inFlight.current = true;
    setBusy(true);
    try {
      const timeKey = isIn ? 'clock_in_time' : 'clock_out_time';
      const formData = new FormData();
      formData.append(timeKey, nowApiDateTime());
      formData.append('images', image);
      const coords = await getCoordinates();
      if (coords?.lat && coords?.lng) {
        formData.append(isIn ? 'clock_in_lat' : 'clock_out_lat', coords.lat);
        formData.append(isIn ? 'clock_in_lng' : 'clock_out_lng', coords.lng);
      }
      const response = await apiUpload(
        isIn ? endpoints.clockIn : endpoints.clockOut,
        formData,
      );
      if (response.data?.success === false) {
        throw new Error(response.data?.message);
      }
      if (isIn) {
        const epoch = Date.now();
        await saveClockIn(epoch);
        startTimer(epoch);
      } else {
        await stopTimer();
      }
      loadHistory(from, to);
      notify.success(isIn ? 'You’re clocked in' : 'You’re clocked out');
    } catch (error) {
      if (isUnauthorizedError(error)) {
        if (!isIn) {
          await stopTimer();
        }
        return;
      }
      Alert.alert(
        isIn ? 'Clock in failed' : 'Clock out failed',
        errorMessage(error, 'Something went wrong. Please try again.'),
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  const pickPhoto = async (type, source) => {
    try {
      const [asset] =
        source === 'camera' ? await takePhoto() : await choosePhotos();
      if (asset) {
        await submit(type, asset);
      }
    } catch (error) {
      if (error?.code === 'camera_unavailable') {
        Alert.alert(
          'No camera available',
          'Choose a photo from your library instead.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Choose photo', onPress: () => pickPhoto(type, 'library') },
          ],
        );
        return;
      }
      notify.error(errorMessage(error, 'Could not get a photo.'));
    }
  };

  const startClock = async type => {
    if (busy) {
      return;
    }
    const isIn = type === 'in';
    if (isIn) {
      try {
        if (!(await hasAssignedTaskToday())) {
          Alert.alert(
            'No job today',
            'You can clock in on days you have a job assigned.',
          );
          return;
        }
      } catch (error) {
        if (!isUnauthorizedError(error)) {
          Alert.alert(
            'Couldn’t check today’s jobs',
            'Check your connection and try again.',
          );
        }
        return;
      }
    }
    Alert.alert(
      isIn ? 'Clock in' : 'Clock out',
      `Take a photo to ${isIn ? 'clock in' : 'clock out'}.`,
      [
        { text: 'Take photo', onPress: () => pickPhoto(type, 'camera') },
        {
          text: 'Choose from library',
          onPress: () => pickPhoto(type, 'library'),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  const changeFrom = date => {
    setFrom(date);
    if (dayjs(date).isAfter(to, 'day')) {
      setTo(date);
    }
  };

  const header = (
    <View style={styles.header}>
      <ScreenTitle
        eyebrow={formatDate(new Date(), 'dddd D MMMM')}
        title="My attendance"
      />

      <Card elevated style={styles.statusCard}>
        {clockedIn ? (
          <>
            <StatusPill label="Clocked in" tone="success" />
            {clockInAt ? (
              <>
                <ClockTimer since={clockInAt} />
                <AppText variant="small">
                  Since {formatTime(clockInAt)} today
                </AppText>
              </>
            ) : (
              <AppText variant="body">You are clocked in.</AppText>
            )}
          </>
        ) : (
          <>
            <StatusPill label="Not clocked in" tone="neutral" />
            <AppText variant="title">Ready to start?</AppText>
            <AppText variant="small">
              Clock in with a photo when you arrive at the site.
            </AppText>
          </>
        )}
        <View style={styles.actions}>
          {clockedIn ? (
            <Button
              title="Clock out"
              icon={LogOut}
              variant="dark"
              onPress={() => startClock('out')}
              loading={busy}
              style={styles.action}
            />
          ) : (
            <Button
              title="Clock in"
              icon={LogIn}
              onPress={() => startClock('in')}
              loading={busy}
              style={styles.action}
            />
          )}
          <Button
            title="Leaves"
            icon={CalendarDays}
            variant="outline"
            onPress={() => navigation.navigate('Leaves')}
            style={styles.action}
          />
        </View>
      </Card>

      <Section label="Attendance history">
        <View style={styles.range}>
          <DateField
            label="From"
            value={from}
            onChange={changeFrom}
            maximumDate={new Date()}
            style={styles.rangeField}
          />
          <DateField
            label="To"
            value={to}
            onChange={setTo}
            minimumDate={from}
            maximumDate={new Date()}
            style={styles.rangeField}
          />
        </View>
      </Section>
    </View>
  );

  let empty = null;
  if (historyLoading) {
    empty = <Loader label="Loading attendance…" />;
  } else if (historyError) {
    empty = (
      <EmptyState
        icon={Clock}
        title="Couldn’t load attendance"
        message={historyError}
        actionLabel="Try again"
        onAction={() => loadHistory(from, to)}
      />
    );
  } else {
    empty = (
      <EmptyState
        icon={Clock}
        title="No attendance in these dates"
        message="Days you clock in and out appear here."
      />
    );
  }

  return (
    <SafeAreaView edges={TAB_EDGES} style={styles.screen}>
      <FlatList
        data={historyLoading ? [] : history}
        keyExtractor={(item, index) =>
          String(item?.id ?? `${item?.clock_in}-${index}`)
        }
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <Card style={styles.entry}>
            <View style={styles.entryText}>
              <AppText variant="bodyStrong">
                {formatDate(
                  attendanceDate(item),
                  'ddd D MMM YYYY',
                  'Date not recorded',
                )}
              </AppText>
              <AppText variant="small">{clockRange(item)}</AppText>
            </View>
            <View style={styles.hours}>
              <AppText variant="subtitle">
                {formatWorkedTime(item?.total_hours) || '–'}
              </AppText>
              <AppText variant="caption">Worked</AppText>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: layout.gutter,
    paddingBottom: space.xl,
  },
  header: { gap: space.xl, paddingTop: space.lg, paddingBottom: space.lg },
  statusCard: { gap: space.sm },
  actions: { flexDirection: 'row', gap: space.sm, marginTop: space.xs },
  action: { flex: 1 },
  range: { flexDirection: 'row', gap: space.sm },
  rangeField: { flex: 1 },
  entry: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  entryText: { flex: 1, gap: 2 },
  hours: { alignItems: 'flex-end' },
  separator: { height: space.sm },
});
