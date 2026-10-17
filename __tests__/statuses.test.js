import {
  jobStatusDisplay,
  leaveStatusDisplay,
  opensJobDetails,
} from '../src/constants/statuses';
import { roleLabel } from '../src/constants/roles';

describe('statuses', () => {
  it('labels job statuses the same way everywhere', () => {
    expect(jobStatusDisplay('ONGOING')).toEqual({
      label: 'In progress',
      tone: 'warning',
    });
    expect(jobStatusDisplay('success').label).toBe('Completed');
    expect(jobStatusDisplay('ON_HOLD')).toEqual({
      label: 'On hold',
      tone: 'neutral',
    });
    expect(jobStatusDisplay(undefined).label).toBe('Unknown');
  });

  it('calls accepted leave "Approved"', () => {
    expect(leaveStatusDisplay('ACCEPTED')).toEqual({
      label: 'Approved',
      tone: 'success',
    });
  });

  it('sends accepted and completed jobs to the details screen', () => {
    expect(opensJobDetails('ACCEPTED')).toBe(true);
    expect(opensJobDetails('SUCCESS')).toBe(true);
    expect(opensJobDetails('ONGOING')).toBe(false);
  });

  it('names roles from their IDs', () => {
    expect(roleLabel(7)).toBe('Supervisor');
    expect(roleLabel('8')).toBe('Quality Inspector');
    expect(roleLabel('99')).toBe('');
  });
});
