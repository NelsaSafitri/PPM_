const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tambahkan dukungan untuk file .wasm dan .db
config.resolver.assetExts.push('wasm', 'db');

module.exports = config;