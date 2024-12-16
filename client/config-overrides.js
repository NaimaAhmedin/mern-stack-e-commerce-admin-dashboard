const webpack = require('webpack');

module.exports = function override(config) {
  const allowedHosts = config.devServer.allowedHosts || [];
  config.devServer = {
    ...config.devServer,
    allowedHosts: 'all'
  };
  return config;
};
