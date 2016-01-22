/*globals __dirname:false */
'use strict'

let path = require('path')
let webpack = require('webpack')

// Replace with `__dirname` if using in project root.
let ROOT = __dirname //process.cwd()
let OUTPUT_DIR = path.join(ROOT, 'docs', 'build')
let base = require('./webpack.config.dev.js')

module.exports = {

  devServer: {
    contentBase: ROOT,
    noInfo: false
  },

  output: {
    path: OUTPUT_DIR,
    filename: 'main.js'
  },

  cache: true,
  devtool: 'source-map',
  entry: {
    app: [ './docs/app.js' ]
  },
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },
  module: base.module,
  // module: {
  //   loaders: [
  //     {
  //       test: /\.jsx?$/,
  //       exclude: [ /node_modules/ ],
  //       loaders: [ 'babel-loader?stage=0' ]
  //     }
  //   ]
  // },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
}
