module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Reanimated 4 (used by the keyboard controller and swipe list) needs this plugin; it must be last.
  plugins: ['react-native-worklets/plugin'],
};
