const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/* eslint-disable max-len */
const common = {
  entry: {
    app: ['./example/index'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'static/[name].[hash].js',
    publicPath: '/',
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('static/style.[hash].css', { allChunks: true }),
    new HtmlWebpackPlugin({
      template: './example/index.html',
      inject: true,
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: __dirname,
      },
      {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap'
        ),
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/img/[name].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/fonts/[name].[ext]',
        },
      },
    ],
  },

  postcss: [
    require('autoprefixer'),
  ],
}

module.exports = common
