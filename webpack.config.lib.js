'use strict'

let path = require('path')

//let ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'lib'),
    publicPath: '/lib/'
  },
//  plugins: [
//    new ExtractTextPlugin(path.parse(process.argv[2]).name + '.css')
//  ],
  module: {
    loaders: [
      {
        test: /\.png$/,
        loaders: [ 'url-loader?limit=7000' ]
      }
    ]
  }
}
