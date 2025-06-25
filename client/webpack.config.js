const fs = require('fs')
const dotenv = require('dotenv')
const webpack = require('webpack')

// Load .env into process.env
const envPath = require('path').resolve(__dirname, '.env')
if (fs.existsSync(envPath)) {
  dotenv.config({path: envPath})
}

module.exports = (config, context) => {
  // Merge your polyfill fallbacks with existing fallback config if any
  config.resolve = config.resolve || {}
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    util: require.resolve('util/'),
    stream: require.resolve('stream-browserify'),
    path: require.resolve('path-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    url: require.resolve('url/'),
    fs: false // mark 'fs' as unavailable in browser
  }

  // Provide process and Buffer globals used by some node libs
  config.plugins = config.plugins || []

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.REACT_APP_BASE_API_URL': JSON.stringify(process.env.REACT_APP_BASE_API_URL || '')
    })
  )

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      global: require.resolve('global')
    })
  )

  return config
}
