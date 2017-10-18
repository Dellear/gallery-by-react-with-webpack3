process.env.NODE_ENV = 'production';

var merge = require('webpack-merge');
var path = require('path');
var webpackBase = require('./webpack.base.config');

module.exports = merge(webpackBase, {
    output: {//输出文件
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]-[hash].js'
    },
});