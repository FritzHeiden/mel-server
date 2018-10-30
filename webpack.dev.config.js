const buildConfig = require('./webpack.build.config')

const path = require('path')

buildConfig.devServer = {
  contentBase: path.join(__dirname, 'dist'),
  compress: true,
  port: 5432,
  watchOptions: {
    poll: true
  },
  historyApiFallback: true
}

module.exports = buildConfig
