import React, { useState } from 'react';
import { Play } from '../../components/icons';
import { apiPost } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { Button, EmptyState, Header, Loader, Screen } from '../../components';
import { ROLES } from '../../constants/roles';
import { JOB_STATUS } from '../../constants/statuses';
import useSession from '../../hooks/useSession';
import { errorMessage, notify } from '../../utils/feedback';
import JobSummary from './JobSummary';
import useJob from './useJob';

// Read-only view of an accepted or completed job. A supervisor starts the job from here.
export default function JobDetailsScreen({ navigation, route }) {
  const jobId = route.params?.jobId;
  const { job, loading, error, reload } = useJob(jobId);
  const session = useSession();
  const [starting, setStarting] = useState(false);

  const canStart =
    session?.roleId === ROLES.SUPERVISOR &&
    job?.booking_status === JOB_STATUS.ACCEPTED;

  const startService = async () => {
    setStarting(true);
    try {
      await apiPost(endpoints.updateBookingStatus, {
        booking_id: jobId,
        booking_status: JOB_STATUS.ONGOING,
      });
      // Replace this screen, so Back from the job in progress returns to My Work.
      navigation.replace('JobDone', { jobId });
    } catch (e) {
      notify.error(errorMessage(e, 'Could not start the job. Try again.'));
    } finally {
      setStarting(false);
    }
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

  return (
    <Screen
      scroll={!loading}
      header={<Header title="Job details" />}
      footer={
        canStart ? (
          <Button
            title="Start service"
            icon={Play}
            onPress={startService}
            loading={starting}
          />
        ) : null
      }
    >
      {body}
    </Screen>
  );
}
