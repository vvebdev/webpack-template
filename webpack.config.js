const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: './src/js/index.js',
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    alias: {
      'img': path.resolve(__dirname, 'src/images'),
      'fonts': path.resolve(__dirname, 'src/fonts'),
    }
  },
  plugins: [
    ...glob.sync('./src/pug/pages/*.pug').map(htmlFile => {
      return new HtmlWebpackPlugin({
        filename: path.basename(htmlFile).replace(/\.pug/, '.html'),
        template: htmlFile,
      });
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/images", to: "images" },
        { from: "public", to: "public" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.pug$/i,
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      },
      {
        test: /\.s[ca]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '../images',
              outputPath: './images',
            }
          },
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  }
};
