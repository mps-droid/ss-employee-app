import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { apiGet } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { errorMessage } from '../../utils/feedback';

// Loads a job and reloads it whenever its screen comes back into view.
export default function useJob(jobId) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!jobId) {
      setError('This job could not be found.');
      setLoading(false);
      return;
    }
    try {
      const response = await apiGet(`${endpoints.bookingById}/${jobId}`);
      setJob(response.data?.data || response.data || null);
      setError('');
    } catch (e) {
      setError(errorMessage(e, 'Could not load this job.'));
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { job, loading, error, reload: load };
}
