module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Enable reanimated plugin
      'react-native-reanimated/plugin',
    ],
  };
}; 