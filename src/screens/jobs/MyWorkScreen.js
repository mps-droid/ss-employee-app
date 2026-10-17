import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Bell, ClipboardList, SearchX } from '../../components/icons';
import images from '../../assets/images';
import {
  apiGet,
  apiPost,
  extractList,
  isEmptyListError,
  isUnauthorizedError,
} from '../../api/client';
import { endpoints } from '../../api/endpoints';
import {
  EmptyState,
  IconButton,
  Loader,
  ScreenTitle,
  SegmentedControl,
  StatTile,
  TAB_EDGES,
  TextField,
} from '../../components';
import { opensJobDetails } from '../../constants/statuses';
import { colors, layout, space } from '../../theme';
import { formatDate } from '../../utils/date';
import { errorMessage, logError } from '../../utils/feedback';
import JobCard from './JobCard';

const TABS = [
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'COMPLETED', label: 'Completed' },
];

const matches = (job, query) => {
  if (!query) {
    return true;
  }
  const q = query.toLowerCase();
  return [job?.service_booking?.name, job?.booking_name]
    .filter(Boolean)
    .some(name => name.toLowerCase().includes(q));
};

const countFrom = response => Number(response?.data?.data?.count) || 0;

export default function MyWorkScreen({ navigation }) {
  const [tab, setTab] = useState('UPCOMING');
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState({ today: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  // Only the newest request may update the list, so a slow answer for the other tab
  // cannot overwrite it.
  const requestId = useRef(0);

  const loadJobs = useCallback(async status => {
    const id = ++requestId.current;
    setError('');
    try {
      const response = await apiPost(endpoints.employeeBookings, {
        booking_status: status,
      });
      if (id === requestId.current) {
        setJobs(extractList(response.data?.data));
      }
    } catch (e) {
      if (id === requestId.current) {
        setJobs([]);
        if (!isEmptyListError(e)) {
          setError(
            isUnauthorizedError(e)
              ? 'Your session has expired. Please log in again.'
              : errorMessage(e, 'Could not load your jobs.'),
          );
        }
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  const loadCounts = useCallback(async () => {
    const [today, completed] = await Promise.allSettled([
      apiGet(endpoints.todaysBookings),
      apiGet(endpoints.completedBookings),
    ]);
    setCounts({
      today: today.status === 'fulfilled' ? countFrom(today.value) : 0,
      completed:
        completed.status === 'fulfilled' ? countFrom(completed.value) : 0,
    });
    [today, completed]
      .filter(result => result.status === 'rejected')
      .forEach(result => logError('job counts', result.reason));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadJobs(tab);
      loadCounts();
    }, [loadJobs, loadCounts, tab]),
  );

  const changeTab = value => {
    setTab(value);
    setLoading(true);
    setJobs([]);
  };

  const refresh = async () => {
    setRefreshing(true);
    await Promise.all([loadJobs(tab), loadCounts()]);
    setRefreshing(false);
  };

  const visibleJobs = useMemo(
    () => jobs.filter(job => matches(job, search.trim())),
    [jobs, search],
  );

  const openJob = job =>
    navigation.navigate(
      opensJobDetails(job?.booking_status) ? 'JobDetails' : 'JobDone',
      { jobId: job.id },
    );

  const header = (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Image
          source={images.logo}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Social Sanitation"
        />
        <IconButton
          icon={Bell}
          label="Notifications"
          onPress={() => navigation.navigate('Notification')}
        />
      </View>
      <ScreenTitle
        eyebrow={formatDate(new Date(), 'dddd D MMMM')}
        title="My work"
      />
      <View style={styles.stats}>
        <StatTile label="Today" value={counts.today} />
        <StatTile label="Completed" value={counts.completed} />
      </View>
      <SegmentedControl options={TABS} value={tab} onChange={changeTab} />
      <TextField
        value={search}
        onChangeText={setSearch}
        placeholder="Search jobs by name"
        accessibilityLabel="Search jobs"
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return <Loader label="Loading your jobs…" />;
    }
    if (error) {
      return (
        <EmptyState
          icon={ClipboardList}
          title="Couldn’t load your jobs"
          message={error}
          actionLabel="Try again"
          onAction={() => {
            setLoading(true);
            loadJobs(tab);
          }}
        />
      );
    }
    if (search.trim() && jobs.length) {
      return (
        <EmptyState
          icon={SearchX}
          title="No matching jobs"
          message={`Nothing matches “${search.trim()}”.`}
        />
      );
    }
    return (
      <EmptyState
        icon={ClipboardList}
        title={
          tab === 'UPCOMING' ? 'No upcoming jobs' : 'No completed jobs yet'
        }
        message={
          tab === 'UPCOMING'
            ? 'New jobs appear here when they are assigned to you.'
            : 'Jobs you complete are listed here.'
        }
      />
    );
  };

  return (
    <SafeAreaView edges={TAB_EDGES} style={styles.screen}>
      <FlatList
        data={visibleJobs}
        keyExtractor={(job, index) => String(job?.id ?? index)}
        renderItem={({ item }) => (
          <JobCard job={item} onPress={() => openJob(item)} />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmpty()}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.foreground}
            colors={[colors.foreground]}
          />
        }
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
  header: { gap: space.lg, paddingTop: space.xs, paddingBottom: space.lg },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { width: 120, aspectRatio: 960 / 558 },
  stats: { flexDirection: 'row', gap: space.sm },
  separator: { height: space.sm },
});
