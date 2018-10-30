const path = require('path')

const DIST_DIR = path.join(__dirname, 'dist')
const SRC_DIR = path.join(__dirname, 'src')

module.exports = {
  mode: 'development',
  context: SRC_DIR,
  entry: ['babel-polyfill', path.join(SRC_DIR, './web-app.jsx')],
  output: {
    filename: 'mel-web.js',
    path: DIST_DIR,
    library: 'MelWeb',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      },
      {
        test: /\.ttf$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'res/fonts/'
          }
        }
      },
      {
        test: /\.sass$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              module: true,
              localIdentName: '[name]-[local]-[hash:base64:6]',
              camelCase: true,
              importLoaders: 1
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
}
