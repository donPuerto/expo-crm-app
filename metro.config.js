// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle ESM modules
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: true,
};

module.exports = withNativeWind(config, { input: './global.css' });
