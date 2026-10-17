/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);
jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest'),
);
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

// The swipe list runs on Reanimated, whose native module is not available in Jest.
// The app does not use Reanimated directly, so a plain list stands in for it.
jest.mock('react-native-swipe-list-view', () => {
  const React = require('react');
  const { FlatList } = require('react-native');
  return {
    SwipeListView: ({ renderHiddenItem, ...props }) =>
      React.createElement(FlatList, props),
  };
});

jest.mock('react-native-config', () => ({
  API_BASE_URL: 'https://api.example.test/api/v1',
}));

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  requestAuthorization: jest.fn(),
}));

jest.mock('@react-native-firebase/database', () => ({
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(() => ({})),
  query: jest.fn(reference => reference),
  limitToLast: jest.fn(),
  onValue: jest.fn(() => jest.fn()),
  push: jest.fn(() => Promise.resolve()),
}));
