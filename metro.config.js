const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add support for .cjs files (required by Firebase)
config.resolver.sourceExts.push("cjs");

// Avoid crashes with package exports in Firebase
config.resolver.unstable_enablePackageExports = false;

// Enable NativeWind and return the final config
module.exports = withNativeWind(config, { input: "./global.css" });
