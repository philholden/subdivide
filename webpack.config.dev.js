'use strict'

let path = require('path')
let webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    bundle: [
      'eventsource-polyfill', // necessary for hot reloading with IE
      'webpack-hot-middleware/client',
      './src/index'
    ],
    // 'docs': [
    //   'eventsource-polyfill', // necessary for hot reloading with IE
    //   'webpack-hot-middleware/client',
    //   './docs/app.js'
    // ],
    'examples': [
      'eventsource-polyfill', // necessary for hot reloading with IE
      'webpack-hot-middleware/client',
      './examples/app.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    modulesDirectories: [
      path.join(__dirname, 'src'),
      'node_modules'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: [ 'babel' ],
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'docs'),
          path.join(__dirname, 'examples')
        ]
      },
      {
        test: /\.png$/, loader: 'url-loader?limit=100000'
      }
    ]
  }
}
