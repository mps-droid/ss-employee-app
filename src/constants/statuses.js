/**
 * One place for how job and leave statuses read and look, so every screen agrees.
 */
export const JOB_STATUS = {
  ACCEPTED: 'ACCEPTED',
  ONGOING: 'ONGOING',
  SUCCESS: 'SUCCESS',
};

const JOB_STATUS_DISPLAY = {
  ACCEPTED: { label: 'Accepted', tone: 'info' },
  ONGOING: { label: 'In progress', tone: 'warning' },
  SUCCESS: { label: 'Completed', tone: 'success' },
  COMPLETED: { label: 'Completed', tone: 'success' },
  PENDING: { label: 'Pending', tone: 'warning' },
  UPCOMING: { label: 'Upcoming', tone: 'info' },
  CANCELLED: { label: 'Cancelled', tone: 'danger' },
  CANCELED: { label: 'Cancelled', tone: 'danger' },
  REJECTED: { label: 'Rejected', tone: 'danger' },
};

const LEAVE_STATUS_DISPLAY = {
  PENDING: { label: 'Pending', tone: 'warning' },
  ACCEPTED: { label: 'Approved', tone: 'success' },
  APPROVED: { label: 'Approved', tone: 'success' },
  REJECTED: { label: 'Rejected', tone: 'danger' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
};

const titleCase = value =>
  String(value)
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase());

const display = (map, status) => {
  const key = String(status || '').toUpperCase();
  if (!key) {
    return { label: 'Unknown', tone: 'neutral' };
  }
  return map[key] || { label: titleCase(key), tone: 'neutral' };
};

export const jobStatusDisplay = status => display(JOB_STATUS_DISPLAY, status);
export const leaveStatusDisplay = status =>
  display(LEAVE_STATUS_DISPLAY, status);

// Accepted and completed jobs open the read-only details; others open the job in progress.
export const opensJobDetails = status =>
  [JOB_STATUS.ACCEPTED, JOB_STATUS.SUCCESS].includes(
    String(status || '').toUpperCase(),
  );
