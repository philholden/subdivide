'use strict'

let CleanPlugin = require('clean-webpack-plugin')
let StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
let StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin
let DefinePlugin = require('webpack').DefinePlugin

let base = require('./webpack.config.dev.js')

let OUTPUT_DIR = 'docs/build'

// All routes we want to static-render--in this case, just the index page:
let routes = [
  ''
]

module.exports = {
  entry: {
    main: './docs/static-render-entry.js'
  },
  output: {
    path: OUTPUT_DIR,
    filename: 'main.[hash].js',
    libraryTarget: 'umd' // Needs to be universal for `static-site-generator-webpack-plugin` to work
  },
  resolve: base.resolve,
  module: base.module,
  plugins: [
    new CleanPlugin(OUTPUT_DIR),
    new StatsWriterPlugin({
      filename: 'stats.json'
    }),
    new DefinePlugin({
      'process.env': {
        // Disable warnings for static build
        NODE_ENV: JSON.stringify('docs')
      }
    }),
    new StaticSiteGeneratorPlugin('main', routes)
  ]
}
