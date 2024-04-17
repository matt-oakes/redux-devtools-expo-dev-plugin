// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

// Turn on support for package exports and symlinks
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
