// Loads the library straight from ../src, so edits show up on reload without repacking.
//
// The library folder has its own node_modules (dev copies of react-native, React Navigation...).
// Those are blocked so every import resolves to this app's node_modules; two copies of
// React or React Navigation in one bundle would break hooks and contexts.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const libraryRoot = path.resolve(projectRoot, '..');

const escapeRegExp = (value) => value.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [...(config.watchFolders ?? []), libraryRoot];

config.resolver.blockList = [
  ...[].concat(config.resolver.blockList ?? []),
  new RegExp(`^${escapeRegExp(path.join(libraryRoot, 'node_modules'))}[\\\\/].*$`),
];

config.resolver.nodeModulesPaths = [path.join(projectRoot, 'node_modules')];

// Always use the TypeScript source, on every platform (web would otherwise pick `main` → lib/).
const librarySource = path.join(libraryRoot, 'src', 'index.ts');
const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@atta-hamamah/react-native-curved-tabbar') {
    return { type: 'sourceFile', filePath: librarySource };
  }
  return (upstreamResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
