var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  context: __dirname,
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'subdivide.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEVTOOLS__: false // <-------- DISABLE redux-devtools HERE
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.png$/, loader: 'url-loader?limit=100000' },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      }
    ]
  }
};

