var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var AssetsPlugin = require('assets-html-webpack-plugin')
var path = require('path');
// var Proxy = require('./proxy.config');

var isProduction = process.env.NODE_ENV === 'production' ? true : false;

module.exports = {
    entry: {//输入文件
        'index': './src/index.js'//‘index’是生成文件的名称，，多个生成文件名将匹配output里的[name],'index'后面的需要被加载到index的文件的路径，可用数组方式加载多个文件，如['./src/js/index.js'，'./src/js/base.js']
    },

    stats: {
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            use: isProduction
                ? ['babel-loader']
                : ['react-hot-loader', 'babel-loader']
        },
        {
            test: /\.html$/,
            use: ['html-loader']
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader'
                ]
            })
        },
        ]
    },
    plugins: [
        //单独生成html文件
        new HtmlWebpackPlugin({
            filename: 'index.html',//生成的html及存放路径，相对于path
            template: 'src/index.ejs',//载入文件及路径
            hash: true
        }),
        new AssetsPlugin(),
        new ExtractTextPlugin(isProduction ? '[name].css' : '[name]-[hash].css'),
        
    ]
}