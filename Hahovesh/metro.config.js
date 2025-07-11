const { getDefaultConfig } = require("expo/metro-config");

// Get the default Expo Metro configuration
const config = getDefaultConfig(__dirname);

// Add support for .cjs files (required by Firebase)
config.resolver.sourceExts.push("cjs");

// Avoid crashes with package exports in Firebase
config.resolver.unstable_enablePackageExports = false;

// Export the Metro configuration without NativeWind
module.exports = config;
