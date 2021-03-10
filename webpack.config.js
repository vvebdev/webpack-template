const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  //
  entry: {
    main: path.resolve(__dirname, 'src/js')
  },
  //
  output: {
    filename: 'js/[name].[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  //
  resolve: {
    alias: {
      'img': path.resolve(__dirname, 'src/images'),
      'fonts': path.resolve(__dirname, 'src/fonts'),
    }
  },
  //
  plugins: [
    // copy folder to /dist
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/images", to: "images" },
        { from: "public", to: "public" },
      ],
    }),
    // extracting css
    new MiniCssExtractPlugin({
      filename: 'css/[name].[fullhash].css',
    }),
    // convert pug pages to html
    ...glob.sync('./src/pug/pages/*.pug').map(htmlFile => {
      return new HtmlWebpackPlugin({
        // inject: true,
        // interpolate: true,
        filename: path.basename(htmlFile).replace(/\.pug/, '.html'),
        template: htmlFile,
      });
    })
  ],
  //
  module: {
    rules: [
      // Pug
      {
        test: /\.pug$/i, 
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      },
      // // JavaScript
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // PostCSS, Sass
      {
        test: /\.s[ca]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      // PostCSS, CSS
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      // Images
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '../images',
              outputPath: './images',
              // useRelativePath: true
            }
          },
        ]
      },
      // Fonts
      {
        test: /\.(woff(2)?|ttf|eot)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '../fonts',
              outputPath: './fonts',
              // useRelativePath: true
            }
          },
        ]
      }
    ],
  },
}
