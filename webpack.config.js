const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const fontFileRegexp = /\.(eot|svg|ttf|woff|woff2)$/;
const jsJsxRegexp = /\.(js|jsx)$/;
const cssModuleRegexp = /\.module\.css$/;
const sassModuleRegexp = /\.module\.s[ac]ss$/i;

const config = {
  entry: {
    main: './src/index.jsx',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': '@/components',
      '@styles': '@/styles',
      '@store': '@/store',
    },
  },
  output: {
    filename: '[name]-[contenthash].js', // имя бандла
    path: path.resolve(__dirname, 'dist'), // папка вывода
  },
  module: {
    rules: [
      {
        // Правило для файлов шрифтов
        test: fontFileRegexp,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name].[ext]', outputPath: 'assets/fonts' },
          },
        ],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: 'src/index.html',
      chunks: ['main'], // chunks, включаемые в html
    }),
  ],
};

const cssLoaderDev = {
  loader: 'css-loader',
  options: {
    sourceMap: true, // включает CSS source maps
    modules: true, // CSS Modules
  },
};
const cssLoaderProd = {
  loader: 'css-loader',
  options: {
    modules: true, // CSS Modules
  },
};

if (isDev) {
  // DEVELOPMENT
  // + devServer
  // + source maps
  config.output.filename = '[name].js'; // в development при hot-reload не допускается chunkhash и contenthash
  config.module.rules = config.module.rules.concat([
    {
      // JS/JSX Правило
      test: jsJsxRegexp,
      exclude: /node_modules/,
      use: [
        {
          // транспиляция
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      ],
    },
    {
      // CSS Module Правило
      test: cssModuleRegexp,
      use: ['style-loader', cssLoaderDev],
    },
    {
      // Sass Module Правило
      test: sassModuleRegexp,
      use: [
        'style-loader',
        cssLoaderDev,
        'sass-loader', // в этом загрузчике значение sourceMap зависит от config.devtool
      ],
    },
  ]);
  config.devtool = 'source-map';
  config.devServer = {
    port: 3000,
    // trick for html Live-Reload to work with Hot reload
    before(app, server) {
      // eslint-disable-next-line no-underscore-dangle
      server._watch('src/index.html'); // путь к отслеживаемому html-файлу(шаблону)
    },
    hot: true, // включение горячей перезагрузки (HMR)
    clientLogLevel: 'silent', // отключает сообщения о горячей перезагрузке в консоли
  };
} else {
  // PRODUCTION
  // + Babel & ESLint
  // + MiniCssExtractPlugin & OptimizeCssAssetsPlugin
  config.module.rules = config.module.rules.concat([
    {
      // JS/JSX Правило
      test: jsJsxRegexp,
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
              '@babel/preset-react',
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
      // CSS Module Правило
      test: cssModuleRegexp,
      use: [MiniCssExtractPlugin.loader, cssLoaderProd],
    },
    {
      // Sass Module Правило
      test: sassModuleRegexp,
      use: [MiniCssExtractPlugin.loader, cssLoaderProd, 'sass-loader'],
    },
  ]);
  config.plugins = config.plugins.concat([
    // склеивание стилей в один css файл
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css', // имя css файла
    }),
    new OptimizeCssAssetsPlugin(), // минификация css
    // создание html со сборками в тегах <script />
    new CleanWebpackPlugin(), // очищение папки output.path
  ]);
}

module.exports = config;
