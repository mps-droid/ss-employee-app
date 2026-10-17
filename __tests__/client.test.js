/* eslint-env node, jest */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearSessionStorage,
  extractList,
  getSession,
  isEmptyListError,
  isPublicEndpoint,
  isTokenExpired,
  isUnauthorizedError,
  persistSession,
} from '../src/api/client';

const jwtExpiringIn = seconds => {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + seconds }),
  ).toString('base64');
  return `header.${payload}.signature`;
};

describe('API client', () => {
  beforeAll(() => {
    global.atob = value => Buffer.from(value, 'base64').toString('binary');
  });

  it('treats a token past its expiry as expired', () => {
    expect(isTokenExpired('t', new Date(Date.now() - 1000).toISOString())).toBe(
      true,
    );
    expect(
      isTokenExpired('t', new Date(Date.now() + 60000).toISOString()),
    ).toBe(false);
  });

  it('falls back to the expiry inside the JWT', () => {
    expect(isTokenExpired(jwtExpiringIn(-60))).toBe(true);
    expect(isTokenExpired(jwtExpiringIn(3600))).toBe(false);
  });

  it('recognises an expired session from the API', () => {
    expect(isUnauthorizedError({ response: { status: 401 } })).toBe(true);
    expect(isUnauthorizedError(new Error('jwt expired'))).toBe(true);
    expect(isUnauthorizedError(new Error('Network request failed'))).toBe(
      false,
    );
  });

  it('never sends the token to the public auth endpoints', () => {
    expect(isPublicEndpoint('https://x/api/v1/user/auth/login')).toBe(true);
    expect(isPublicEndpoint('https://x/api/v1/user/profile')).toBe(false);
  });

  it('reads lists from the API’s different response shapes', () => {
    expect(extractList([{ id: 1 }])).toEqual([{ id: 1 }]);
    expect(extractList({ rows: [{ id: 2 }, null] })).toEqual([{ id: 2 }]);
    expect(extractList({ data: [{ id: 3 }] })).toEqual([{ id: 3 }]);
    expect(extractList(undefined)).toEqual([]);
  });

  it('reads a “No … found” answer as an empty list, not a failure', () => {
    const answer = message => ({
      response: { status: 404, data: { message } },
    });
    expect(isEmptyListError(answer('No active notifications found'))).toBe(
      true,
    );
    expect(isEmptyListError(answer('no bookings found'))).toBe(true);
    expect(isEmptyListError(answer('Internal server error'))).toBe(false);
    expect(isEmptyListError(new Error('Network request failed'))).toBe(false);
  });

  it('saves the session and removes all of it at logout', async () => {
    await persistSession({
      token: 'abc',
      expires: '2030-01-01T00:00:00Z',
      roleId: '7',
      userId: 42,
      userName: 'Sam',
    });
    await AsyncStorage.setItem('lastRoleId', '7');
    expect(await getSession()).toMatchObject({
      token: 'abc',
      roleId: '7',
      userId: '42',
      userName: 'Sam',
    });
    await clearSessionStorage();
    expect((await getSession()).token).toBeNull();
    // The remembered role is a convenience, not session data.
    expect(await AsyncStorage.getItem('lastRoleId')).toBe('7');
  });
});
