// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],      // preset יחיד
    plugins: ['nativewind/babel'],       // כאן ה-plugin החשוב
  };
};
