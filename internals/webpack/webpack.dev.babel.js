/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = require('./webpack.base.babel')({
  mode: 'development',

  // Add hot reloading in development
  entry: {
    app: [
      'webpack-hot-middleware/client?reload=true',
      path.join(process.cwd(), 'app/app.tsx') // Start with js/app.js
    ],
    share: [
      'webpack-hot-middleware/client?reload=true',
      path.join(process.cwd(), 'share/app.tsx')
    ]
  },

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },

  optimization: {
    splitChunks: {
      // chunks: 'all',
      chunks: 'async',
      maxAsyncRequests: 5,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](?!antd|jquery|three|bootstrap-datepicker)(.[a-zA-Z0-9.\-_]+)[\\/]/,
          // test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },

  // Add development plugins
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['app', 'app~share', 'vendor'],
      inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
      template: 'app/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'share.html',
      chunks: ['share', 'app~share', 'vendor'],
      inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
      template: 'app/index.html'
    }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false // show a warning when there is a circular dependency
    }),
    new ForkTsCheckerWebpackPlugin()
  ],

  tsLoaders: [{
    loader: 'babel-loader',
    options: {
      plugins: ['react-hot-loader/babel']
    }
  }],

  // Emit a source map for easier debugging
  // See https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'source-map',

  performance: {
    hints: false
  },

  htmlWebpackPlugin: {
    files: {
      js: ['app.js', 'share.js'],
      chunks: {
        app: {
          entry: 'app.js'
        },
        share: {
          entry: 'share.js'
        }
      }
    }
  }
})
