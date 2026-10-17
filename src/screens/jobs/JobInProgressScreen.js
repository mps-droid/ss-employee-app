import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Camera, CircleCheck, ListChecks } from '../../components/icons';
import { apiPost } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { Button, EmptyState, Header, Loader, Screen } from '../../components';
import { ROLES } from '../../constants/roles';
import { JOB_STATUS } from '../../constants/statuses';
import useSession from '../../hooks/useSession';
import { errorMessage, notify } from '../../utils/feedback';
import { bookingAttachments } from './jobPhotos';
import JobSummary from './JobSummary';
import useJob from './useJob';

/**
 * A job that is under way. The quality inspector works through the checklist;
 * the supervisor adds photos and marks the job complete.
 */
export default function JobInProgressScreen({ navigation, route }) {
  const jobId = route.params?.jobId;
  const { job, loading, error, reload } = useJob(jobId);
  const session = useSession();
  const [completing, setCompleting] = useState(false);

  const isSupervisor = session?.roleId === ROLES.SUPERVISOR;
  const isInspector = session?.roleId === ROLES.QUALITY_INSPECTOR;

  const completeJob = async () => {
    setCompleting(true);
    try {
      await apiPost(endpoints.updateBookingStatus, {
        booking_id: job?.id ?? jobId,
        booking_status: JOB_STATUS.SUCCESS,
      });
      navigation.replace('CompleteJob');
    } catch (e) {
      notify.error(errorMessage(e, 'Could not complete the job. Try again.'));
    } finally {
      setCompleting(false);
    }
  };

  const confirmComplete = () => {
    const hasPhotos = bookingAttachments(job).length > 0;
    Alert.alert(
      'Mark this job complete?',
      hasPhotos
        ? 'The job will show as completed for everyone on it.'
        : 'No photos have been added to this job yet. Mark it complete anyway?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark complete', onPress: completeJob },
      ],
    );
  };

  let body;
  if (loading) {
    body = <Loader fill label="Loading job…" />;
  } else if (error || !job) {
    body = (
      <EmptyState
        title="Couldn’t load this job"
        message={error}
        actionLabel="Try again"
        onAction={reload}
      />
    );
  } else {
    body = <JobSummary job={job} />;
  }

  const ready = !loading && !!job;
  let footer = null;
  if (ready && isInspector) {
    footer = (
      <Button
        title="Open checklist"
        icon={ListChecks}
        onPress={() => navigation.navigate('CheckList', { jobId })}
      />
    );
  } else if (ready && isSupervisor) {
    footer = (
      <>
        <Button
          title="Add photos"
          icon={Camera}
          variant="outline"
          onPress={() => navigation.navigate('AddImages', { jobId })}
        />
        <Button
          title="Mark job complete"
          icon={CircleCheck}
          onPress={confirmComplete}
          loading={completing}
        />
      </>
    );
  }

  return (
    <Screen
      scroll={!loading}
      header={<Header title="Job in progress" />}
      footer={footer}
    >
      {body}
    </Screen>
  );
}
