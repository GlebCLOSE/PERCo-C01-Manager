const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

const upstreamResolveRequest = config.resolver.resolveRequest;

/**
 * Metro не резолвит относительный `./sourceMap` внутри css-tree (generator/create.js),
 * хотя файл `sourceMap.js` присутствует. Явно указываем путь для бандла.
 */
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === './sourceMap' && context?.originModulePath) {
    const origin = context.originModulePath.replace(/\\/g, '/');
    if (origin.includes('/css-tree/')) {
      const dir = path.dirname(context.originModulePath);
      return {
        type: 'sourceFile',
        filePath: path.join(dir, 'sourceMap.js'),
      };
    }
  }
  if (typeof upstreamResolveRequest === 'function') {
    return upstreamResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
