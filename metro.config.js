// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add Tamagui support
config.resolver.sourceExts.push('mjs');

// Tamagui requires these for web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Enable package exports for ESM modules
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
