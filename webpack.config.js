
'use strict' // eslint-disable-line

const path = require('path')
const webpack = require('webpack')
const packge = require('./package.json')

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(
  require('./webpack-isomorphic-tools')
)

const configurations = [
  // Minified version
  {
    entry: './src/browser.jsx',
    output: {
      path: path.join(__dirname, '/public/scripts'),
      filename: 'main.min.js',
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: 'style!css' },
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel', // 'babel-loader' is also a legal name to reference
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
          version: `'${packge.version}'`,
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
    ],
  },

  // Development version
  {
    entry: [
      // 'webpack-hot-middleware/client?path=http://localhost:5000/scripts/__webpack_hmr',
      './src/browser.jsx',
    ],
    output: {
      path: path.join(__dirname, '/public/scripts'),
      filename: 'main.js',
      sourceMapFilename: 'main.map',
      publicPath: '/scripts/',
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: 'style!css' },
        { test: /\.jsx?$/, exclude: /node_modules/,
          loaders: ['babel'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"',
          version: `'${packge.version}'`,
        },
      }),
      // new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: 'eval',
  },
]

module.exports = configurations.filter((conf, i) => {
  if (i === 0) {
    return process.env.PROD !== '0'
  } else if (i === 1) {
    return process.env.DEV !== '0'
  }
  return false
})
