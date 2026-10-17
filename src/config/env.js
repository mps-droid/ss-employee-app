import Config from 'react-native-config';

/**
 * Values read from .env at build time by react-native-config. After changing .env,
 * rebuild the app; reloading Metro is not enough.
 */
const required = name => {
  const value = Config[name];
  if (!value) {
    throw new Error(
      `${name} is missing. Add it to .env (see .env.example) and rebuild the app.`,
    );
  }
  return value;
};

// No trailing slash, e.g. https://node.socialsanitation.com/api/v1
export const API_BASE_URL = required('API_BASE_URL').replace(/\/+$/, '');

// Requests to this host carry the session token; any other host never sees it.
export const API_HOST = API_BASE_URL.replace(/^https?:\/\//, '').split('/')[0];
