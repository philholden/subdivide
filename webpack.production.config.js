var path = require('path');
var webpack = require('webpack');

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
};

var reactDOMExternal = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom'
};

module.exports = {
  externals: {
    'react': reactExternal,
    'react-native': reactExternal,
    'react-dom': reactDOMExternal
  },
  devtool: 'source-map',
  context: __dirname,
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'subdivide.js',
    library: 'Subdivide',
    libraryTarget: 'umd',
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

