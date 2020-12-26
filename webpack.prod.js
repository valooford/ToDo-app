const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {
  config: common,
  regexp: { jsJsxRegexp, sassRegexp, sassModuleRegexp },
} = require('./webpack.common');

const cssLoaderProd = {
  loader: 'css-loader',
  options: {},
};
const cssModuleLoaderProd = {
  ...cssLoaderProd,
  options: {
    ...cssLoaderProd.options,
    importLoaders: 1, // 1 means that it also applies CSS modules on @imported resources
    modules: true,
  },
};

// + Babel & ESLint
// + MiniCssExtractPlugin & OptimizeCssAssetsPlugin
module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        // JS/JSX Rule
        test: jsJsxRegexp,
        exclude: /node_modules/,
        use: [
          {
            // transpilation (Babel)
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: 'defaults', // > 0.5%, last 2 versions, Firefox ESR, not dead
                    useBuiltIns: 'usage', // polyfills integration
                    corejs: '3.6', // corejs minor version
                  },
                ],
                '@babel/preset-react',
              ],
            },
          },
          {
            // linting (ESLint)
            loader: 'eslint-loader',
            options: {
              configFile: './.eslintrc.json', // конфиг ESLint
            },
          },
        ],
      },
      {
        // Sass Rule
        test: sassRegexp,
        use: [MiniCssExtractPlugin.loader, cssLoaderProd, 'sass-loader'],
      },
      {
        // Sass Module Rule
        test: sassModuleRegexp,
        use: [MiniCssExtractPlugin.loader, cssModuleLoaderProd, 'sass-loader'],
      },
    ],
  },
  plugins: [
    // merging all styles into a single CSS file
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new OptimizeCssAssetsPlugin(), // CSS minification
    new CleanWebpackPlugin(), // cleans output folder
  ],
  // devtool: 'source-map', // debugging in prod
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '', // relative to HTML page (same directory)
  },
});
