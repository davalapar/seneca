## seneca

* commands:

```
yarn run dev
yarn run prod
yarn run final
nodemon
```

* `yarn installs`

```
// Client:
yarn add webpack webpack-cli uglifyjs-webpack-plugin -D
npm info "eslint-config-airbnb@latest" peerDependencies
yarn add babel-core babel-loader babel-eslint babel-preset-airbnb eslint-config-airbnb -D
// Server:
yarn add express cors compression express-force-ssl
yarn add webpack-node-externals -D
// React:
yarn add react react-dom @material-ui/core @material-ui/icons
yarn add babel-preset-react babel-plugin-transform-class-properties babel-plugin-syntax-dynamic-import -D
```

* `.babelrc`

```
{
  "presets": [
      [
        "airbnb",
        {
          "targets": {
            "chrome": 50,
            "firefox": 45
          }
        }
      ],
      "react"
  ],
  "plugins": [
    "transform-class-properties",
    "syntax-dynamic-import"
  ]
}
```

* `.eslintrc`

```
{
  "parser": "babel-eslint",
  "rules": {
    "strict": 0
  },
  "extends": "airbnb"
}
```

* `webpack.config.js`

```
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
  };
};
module.exports = [Client, Server];

```

* `package.json`

```
"scripts": {
  "dev": "webpack --progress --mode=development --watch",
  "prod": "webpack --progress --mode=production --watch",
  "final": "webpack --progress --mode=production"
},
"main": "./dist/server/main.js",
```

* `.eslintignore`

```
/dist
/node_modules
```