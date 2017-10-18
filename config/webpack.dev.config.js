process.env.NODE_ENV = 'development';

var merge = require('webpack-merge');
var path = require('path');
// var Proxy = require('./proxy.config');
var webpackBase = require('./webpack.base.config');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var chrome = process.platform === 'win32' ? 'chrome' : 'google-chrome';

module.exports = merge(webpackBase, {
    output: {//输出文件
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    },
    watch: true,
    devtool: '#cheap-module-source-map',
    plugins: [
        // 使用browser-sync实时刷新页面
        new BrowserSyncPlugin({
            // host: 'localhost',
            // port: 3000,
            server: {
                baseDir: './',
                https: true,
                // middleware: Proxy
            },
            open: false,
            // open: 'external',
            ghostMode: false,
            browser: chrome,
            startPath: 'dist/index.html',
            notify: false,

        })
    ].concat(webpackBase.plugins)
});