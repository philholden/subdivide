var path = require('path');
var webpack = require('webpack');

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
};

var reduxExternal = {
  root: 'Redux',
  commonjs2: 'redux',
  commonjs: 'redux',
  amd: 'redux'
};

module.exports = {
   externals: {
    'react': reactExternal,
    'react-native': reactExternal,
    'redux': reduxExternal
  },
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

