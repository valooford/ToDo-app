const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const config = {
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name]-[contenthash].js', // имя бандла
    path: path.resolve(__dirname, 'dist'), // папка вывода
  },
  module: {
    rules: [],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html',
      chunks: ['main'], // chunks, включаемые в html
    }),
    new CleanWebpackPlugin(), // очищение папки output.path
  ],
};

if (isDev) {
  // DEVELOPMENT
  // + devServer
  // + source maps
  config.output.filename = '[name].js'; // в development при hot-reload не допускается chunkhash и contenthash
  config.module.rules = config.module.rules.concat([
    {
      // CSS Правило
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: true, // включает CSS source maps
          },
        },
      ],
    },
    {
      // Sass Правило
      test: /\.s[ac]ss$/i,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: true, // включает CSS source maps
          },
        },
        'sass-loader', // в этом загрузчике значение sourceMap зависит от config.devtool
      ],
    },
  ]);
  config.devtool = 'source-map';
  config.devServer = {
    port: 3000,
    hot: true,
    clientLogLevel: 'silent', // отключает сообщения о горчей перезагрузке в консоли
  };
} else {
  // PRODUCTION
  // + Babel & ESLint
  // + MiniCssExtractPlugin & OptimizeCssAssetsPlugin
  config.module.rules = config.module.rules.concat([
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          // транспиляция
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
            ],
          },
        },
        {
          // линтинг
          loader: 'eslint-loader',
          options: {
            configFile: './.eslintrc.json', // конфиг ESLint
          },
        },
      ],
    },
    {
      // CSS Правило
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
    {
      // Sass Правило
      test: /\.s[ac]ss$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
    },
  ]);
  config.plugins = config.plugins.concat([
    // склеивание стилей в один css файл
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css', // имя css файла
    }),
    new OptimizeCssAssetsPlugin(), // минификация css
    // создание html со сборками в тегах <script />
  ]);
}

module.exports = config;
