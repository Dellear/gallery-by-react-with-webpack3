const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const cssLoders = require('./cssloaders.conf');

const isProduction =  function () {
  return process.env.NODE_ENV === JSON.stringify('production');
};

module.exports = {
  entry: {
    'index': './src/index.js',
  },

  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: isProduction()
        ? ['babel-loader']
        : ['react-hot-loader', 'babel-loader', 'eslint-loader'],
    },
    {
      test: /\.html$/,
      use: ['html-loader'],
    },
    {
      test: /\.(css|scss|pcss)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          cssLoders.css,
          cssLoders.postCss,
        ],
      }),
    },

    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'assets/images/[name]-[hash:8].[ext]',
          },
        },
      ],
    },
    {
      test: /\.(woff|woff2|ttf|svg|eot)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 500,
            name: 'assets/fonts/[name]-[hash:8].[ext]',
          },
        },
      ],
    },
    {
      test: /\.(mp4|ogg)$/,
      loader: 'file-loader',
    },
    ],
  },
  plugins: [
    //单独生成html文件
    new HtmlWebpackPlugin({
      filename: 'index.html',//生成的html及存放路径，相对于path
      template: 'src/index.ejs',//载入文件及路径
      hash: true,
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV,
    }),

    new ExtractTextPlugin(isProduction() ? '[name]-[hash].min.css' : '[name].css'),

  ],
}