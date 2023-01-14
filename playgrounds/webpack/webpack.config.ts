// Generated using webpack-cli https://github.com/webpack/webpack-cli
/// <reference path="node_modules/webpack-dev-server/types/lib/Server.d.ts"/>

import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import type { Configuration } from 'webpack'

import unplugin from '../../src/webpack'

const isProduction = process.env.NODE_ENV === 'production'

const config: Configuration & {} = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    open: false,
    port: 8081,
    host: 'localhost',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    unplugin({
      port: 8082,
    }),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
}

module.exports = () => {
  if (isProduction)
    config.mode = 'production'
  else
    config.mode = 'development'

  return config
}
