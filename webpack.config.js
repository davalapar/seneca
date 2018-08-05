/* eslint-disable no-alert, no-console */

const path = require('path');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
const WebpackNodeExternals = require('webpack-node-externals');

const Server = {
  entry: [
    './src/server/index.js',
  ],
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [
    WebpackNodeExternals(),
  ],
  output: {
    path: `${__dirname}/dist/server`,
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  stats: 'minimal',
};

const Client = (env, argv) => {
  console.log('mode:', argv.mode);
  return {
    entry: [
      './src/client/index.jsx',
    ],
    output: {
      path: path.join(__dirname, '/dist/client'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        { test: /\.(jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
      ],
    },
    optimization: {
      minimize: Boolean(argv.mode === 'production'),
      minimizer: [
        new UglifyJSWebpackPlugin({
          parallel: true,
          cache: true,
          uglifyOptions: {
            output: {
              comments: false,
            },
            compress: {
              dead_code: true,
            },
          },
        }),
      ],
    },
    stats: 'minimal',
  };
};
module.exports = [Client, Server];
