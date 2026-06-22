const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@expo/vector-icons']
      }
    },
    argv
  );

  // Fix crypto polyfill issue for web
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: false,
    stream: false,
  };

  return config;
};
