const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const imageFileRegexp = /\.(png|svg|jpe?g|gif)$/i;
const fontFileRegexp = /\.(eot|ttf|woff|woff2)$/;
const jsJsxRegexp = /\.(js|jsx)$/;
const sassRegexp = /(?<!\.module)\.s[ac]ss$/i;
const sassModuleRegexp = /\.module\.s[ac]ss$/i;

module.exports = {
  config: {
    entry: {
      main: './src/index.jsx',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        // aliases for elegant import (__dirname is required)
        'react-dom': '@hot-loader/react-dom',
        '@': path.resolve(__dirname, './src/'),
        '@api': '@/api',
        '@assets': '@/assets',
        '@components': '@/components',
        '@store': '@/store',
        '@styles': '@/styles',
      },
    },
    module: {
      rules: [
        // Image Files Rule
        {
          test: imageFileRegexp,
          loader: 'file-loader',
          options: { name: '[name].[ext]', outputPath: 'assets/images' },
        },
        {
          // Font Files Rule
          test: fontFileRegexp,
          loader: 'file-loader',
          options: { name: '[name].[ext]', outputPath: 'assets/fonts' },
        },
      ],
    },
    plugins: [
      // generates index.html file from a template file
      new HTMLWebpackPlugin({
        template: './src/index.html',
      }),
    ],
    output: {
      path: path.resolve(__dirname, 'dist'), // output directory
      // filename
    },
  },
  regexp: { jsJsxRegexp, sassRegexp, sassModuleRegexp },
};
