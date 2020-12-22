const { merge } = require('webpack-merge');
const {
  config: common,
  regexp: { jsJsxRegexp, cssModuleRegexp, sassModuleRegexp },
} = require('./webpack.common');

const cssLoaderDev = {
  loader: 'css-loader',
  options: {
    importLoaders: 1, // 1 means that it also applies CSS modules on @imported resources
    // CSS Modules
    modules: {
      localIdentName: '[local]--[name]_[hash:base64:5]',
    },
  },
};

// + devServer
// + source maps
module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        // JS/JSX Rule
        test: jsJsxRegexp,
        exclude: /node_modules/,
        loader: 'babel-loader', // transpilation
        options: {
          cacheDirectory: true, // ./node_modules/.cache/babel-loader
          presets: ['@babel/preset-react'],
          plugins: ['react-hot-loader/babel'],
        },
      },
      {
        // CSS Module Rule
        test: cssModuleRegexp,
        use: ['style-loader', cssLoaderDev],
      },
      {
        // Sass Module Rule
        test: sassModuleRegexp,
        use: [
          'style-loader',
          cssLoaderDev,
          'sass-loader', // sourceMap value depends on devtool
        ],
      },
    ],
  },
  devtool: 'eval-cheap-module-source-map', // source maps for development
  // webpack-dev-server configuration
  devServer: {
    open: true,
    // trick for html Live-Reload to work with Hot reload
    before(app, server) {
      // eslint-disable-next-line no-underscore-dangle
      server._watch('src/index.html'); // path to observed html-file(template)
    },
    hot: true, // enabling hot module replacement (HMR) (React-Hot-Loader)
    clientLogLevel: 'silent', // turning off console messages
  },
  output: {
    filename: '[name].js', // chunkhash и contenthash is not allowed in development when hot-reloading
    pathinfo: false, // no extra info about contained modules
    publicPath: '/',
  },
});
