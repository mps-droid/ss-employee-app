import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_HOST } from '../config/env';
import { resetTo } from '../navigation/navigationRef';
import { PUBLIC_PATHS } from './endpoints';

// Everything the app stores about the signed-in user; all of it is removed at logout.
const SESSION_KEYS = [
  'token',
  'tokenExpires',
  'roleId',
  'userID',
  'userName',
  'clockInTime',
  'clockInEpoch',
  'userProfile', // written by older versions of the app
];

const DEFAULT_TIMEOUT_MS = 20000;
export const UPLOAD_TIMEOUT_MS = 120000;

let sessionInvalid = false;
let logoutInProgress = null;

export const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

export const toRoleId = value => {
  const id = Number(value);
  return Number.isFinite(id) ? id : value;
};

const stringifyHeaders = (headers = {}) => {
  const next = {};
  Object.entries(headers).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      next[key] = String(value);
    }
  });
  return next;
};

// The API expects multipart form bodies, including for plain fields.
export const toFormData = (fields = {}) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    const values = Array.isArray(value) ? value : [value];
    values.forEach(item => {
      if (item === undefined || item === null) {
        return;
      }
      formData.append(key, typeof item === 'object' ? item : String(item));
    });
  });
  return formData;
};

export const isPublicEndpoint = (url = '') =>
  PUBLIC_PATHS.some(path => String(url).includes(path));

// Only our own API gets the token; public auth endpoints and other hosts never do.
const needsAuth = url => {
  const value = String(url);
  if (isPublicEndpoint(value)) {
    return false;
  }
  if (value.startsWith('http') && !value.includes(API_HOST)) {
    return false;
  }
  return true;
};

const decodeBase64 = value => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return typeof global.atob === 'function' ? global.atob(padded) : '';
};

const getJwtExpiryMs = token => {
  const payload = typeof token === 'string' ? token.split('.')[1] : null;
  if (!payload) {
    return null;
  }
  try {
    const { exp } = JSON.parse(decodeBase64(payload));
    return exp ? exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token, expiresAt) => {
  const now = Date.now() + 5000;
  if (expiresAt) {
    const expiryMs = new Date(expiresAt).getTime();
    if (!Number.isNaN(expiryMs)) {
      return expiryMs <= now;
    }
  }
  const jwtExpiry = getJwtExpiryMs(token);
  return jwtExpiry ? jwtExpiry <= now : false;
};

export const getSession = async () => {
  const values = await AsyncStorage.getMany([
    'token',
    'tokenExpires',
    'roleId',
    'userID',
    'userName',
  ]);
  return {
    token: values.token,
    tokenExpires: values.tokenExpires,
    roleId: values.roleId,
    userId: values.userID,
    userName: values.userName,
  };
};

export const persistSession = async ({
  token,
  expires,
  roleId,
  userId,
  userName,
}) => {
  sessionInvalid = false;
  const entries = {};
  if (token) {
    entries.token = String(token);
  }
  if (expires) {
    entries.tokenExpires = String(expires);
  }
  if (roleId !== undefined && roleId !== null && roleId !== '') {
    entries.roleId = String(toRoleId(roleId));
  }
  if (userId !== undefined && userId !== null && userId !== '') {
    entries.userID = String(userId);
  }
  if (userName) {
    entries.userName = String(userName);
  }
  if (Object.keys(entries).length) {
    await AsyncStorage.setMany(entries);
  }
};

export const clearSessionStorage = () => AsyncStorage.removeMany(SESSION_KEYS);

export const handleUnauthorized = async () => {
  sessionInvalid = true;
  if (!logoutInProgress) {
    logoutInProgress = (async () => {
      try {
        await clearSessionStorage();
        resetTo('Login');
      } finally {
        logoutInProgress = null;
      }
    })();
  }
  return logoutInProgress;
};

export const getAuthHeaders = async ({ redirectIfInvalid = true } = {}) => {
  const { token, roleId, tokenExpires } = await getSession();
  const expired =
    !token || isTokenExpired(token, tokenExpires) || sessionInvalid;

  if (expired) {
    if (redirectIfInvalid && token) {
      await handleUnauthorized();
    }
    return { token: null, roleId: null, headers: {}, expired: true };
  }

  return {
    token,
    roleId,
    headers: stringifyHeaders({
      timezone: getTimezone(),
      'x-access-token': token,
      ...(roleId ? { role_id: String(toRoleId(roleId)) } : {}),
    }),
    expired: false,
  };
};

export const isUnauthorizedError = error => {
  if (error?.isSessionExpired) {
    return true;
  }
  const status = error?.response?.status;
  const apiStatus = error?.response?.data?.status;
  if ([status, apiStatus].some(code => code === 401 || code === 403)) {
    return true;
  }
  const message = String(
    error?.response?.data?.message || error?.message || '',
  ).toLowerCase();
  return [
    'please authenticate',
    'jwt expired',
    'jwt malformed',
    'invalid signature',
    'invalid token',
    'token expired',
    'unauthorized',
    'not authenticated',
  ].some(text => message.includes(text));
};

const createSessionError = () => {
  const error = new Error('Your session has expired. Please log in again.');
  error.isSessionExpired = true;
  return error;
};

const createApiError = (message, status, data, url) => {
  const error = new Error(message || `Request failed (${status || 'network'})`);
  error.response = { status, data };
  error.config = { url };
  return error;
};

export const apiRequest = async ({
  url,
  method = 'GET',
  data,
  auth,
  headers: extraHeaders = {},
  timeout = DEFAULT_TIMEOUT_MS,
} = {}) => {
  if (!url) {
    throw createApiError('Missing API url', 0, {}, url);
  }

  const methodUpper = String(method).toUpperCase();
  const useAuth = auth !== undefined ? auth : needsAuth(url);
  const headers = stringifyHeaders({
    Accept: 'application/json',
    timezone: getTimezone(),
    ...extraHeaders,
  });

  if (useAuth) {
    if (sessionInvalid) {
      throw createSessionError();
    }
    const session = await getAuthHeaders();
    if (session.expired || !session.token) {
      await handleUnauthorized();
      throw createSessionError();
    }
    Object.assign(headers, session.headers, stringifyHeaders(extraHeaders));
  }

  // fetch sets the multipart boundary itself.
  delete headers['Content-Type'];
  delete headers['content-type'];

  let body;
  const canHaveBody = !['GET', 'HEAD'].includes(methodUpper);
  if (canHaveBody && data !== undefined && data !== null && data !== '') {
    if (data instanceof FormData) {
      body = data;
    } else if (typeof data === 'object') {
      body = toFormData(data);
    } else {
      body = data;
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: methodUpper,
      headers,
      body,
      signal: controller.signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw createApiError(
        json?.message || `Request failed (${res.status})`,
        res.status,
        json,
        url,
      );
    }
    return { status: res.status, data: json };
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw createApiError(
        'The server took too long to answer. Check your connection and try again.',
        0,
        {},
        url,
      );
    }
    if (useAuth && isUnauthorizedError(error)) {
      await handleUnauthorized();
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

export const apiGet = (url, options = {}) =>
  apiRequest({ url, method: 'GET', ...options });

export const apiPost = (url, data, options = {}) =>
  apiRequest({ url, method: 'POST', data, ...options });

export const apiPut = (url, data, options = {}) =>
  apiRequest({ url, method: 'PUT', data, ...options });

export const apiDelete = (url, options = {}) =>
  apiRequest({ url, method: 'DELETE', ...options });

// Photo uploads get a longer timeout so they finish on mobile data.
export const apiUpload = (url, formData, options = {}) =>
  apiRequest({
    url,
    method: 'POST',
    data: formData,
    timeout: UPLOAD_TIMEOUT_MS,
    ...options,
  });

// The API wraps lists in a few different shapes.
export const extractList = payload => {
  const candidates = [
    payload,
    payload?.rows,
    payload?.data,
    payload?.bookings,
    payload?.groups,
  ];
  const list = candidates.find(Array.isArray) || [];
  return list.filter(item => item && typeof item === 'object');
};

// Some list endpoints answer an empty list with an error, such as "No active
// notifications found". That means the list is empty, not that loading failed.
export const isEmptyListError = error =>
  /^no\b.*\bfound\b/i.test(String(error?.response?.data?.message || '').trim());

export const isSuccess = response =>
  (response?.status === 200 || response?.status === 201) &&
  response?.data?.success !== false;
