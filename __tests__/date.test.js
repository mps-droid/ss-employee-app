import {
  formatClockTime,
  formatDate,
  formatDuration,
  formatWorkedTime,
  parseDate,
  toApiDate,
} from '../src/utils/date';

describe('date helpers', () => {
  it('formats 24-hour clock times for staff', () => {
    expect(formatClockTime('14:30')).toBe('2:30 PM');
    expect(formatClockTime('00:05:00')).toBe('12:05 AM');
    expect(formatClockTime('')).toBe('');
  });

  it('reads the API date formats', () => {
    expect(parseDate('2026-10-17 09:15:00').format('HH:mm')).toBe('09:15');
    expect(parseDate('2026-10-17').format('D MMM YYYY')).toBe('17 Oct 2026');
    expect(parseDate('not a date')).toBeNull();
    expect(parseDate(null)).toBeNull();
  });

  it('falls back instead of showing "Invalid date"', () => {
    expect(formatDate('garbage', 'D MMM', 'Not recorded')).toBe('Not recorded');
  });

  it('sends dates to the API as YYYY-MM-DD', () => {
    expect(toApiDate(new Date(2026, 9, 7))).toBe('2026-10-07');
  });

  it('formats the worked time the API sends', () => {
    expect(formatWorkedTime('1 hours 1 minutes')).toBe('1 h 1 min');
    expect(formatWorkedTime('0 hours 45 minutes')).toBe('45 min');
    expect(formatWorkedTime('2 hours 0 minutes')).toBe('2 h');
    expect(formatWorkedTime('about a day')).toBe('about a day');
    expect(formatWorkedTime(null)).toBe('');
  });

  it('formats the clocked-in timer', () => {
    expect(formatDuration(3725)).toBe('01:02:05');
    expect(formatDuration(-5)).toBe('00:00:00');
  });
});
