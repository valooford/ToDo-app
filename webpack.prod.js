const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {
  config: common,
  regexp: { jsJsxRegexp, cssModuleRegexp, sassModuleRegexp },
} = require('./webpack.common');

const cssLoaderProd = {
  loader: 'css-loader',
  options: {
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
        // CSS Module Правило
        test: cssModuleRegexp,
        use: [MiniCssExtractPlugin.loader, cssLoaderProd],
      },
      {
        // Sass Module Правило
        test: sassModuleRegexp,
        use: [MiniCssExtractPlugin.loader, cssLoaderProd, 'sass-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // cleans output folder
    // merging all styles into a single CSS file
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new OptimizeCssAssetsPlugin(), // CSS minification
  ],
  // devtool: 'source-map', // debugging in prod
  output: {
    filename: '[name].[contenthash].js',
  },
});
