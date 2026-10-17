const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  watchFolders: [path.resolve(__dirname, '..')],
  resolver: {
    extraNodeModules: {
      'react-native': path.resolve(__dirname, '../node_modules/react-native'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
