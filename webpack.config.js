var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  context: __dirname,
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __TESTTOOLS__: false,
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
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass?outputStyle=expanded&' +
          'includePaths[]=' +
            (path.join(__dirname, './style'))
             + '&' +
          'includePaths[]=' +
            (path.join(__dirname, './node_modules'))
      }
    ]
  }
};
