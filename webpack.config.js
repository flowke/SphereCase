const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:{
        app: './src/app.js'
    } ,

    output: {
        path: path.resolve(__dirname, 'dist/assets'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract(
                    [
                        {
                            loader: 'css-loader',
                            options: {
                                root: '.',
                                modules: true,
                                localIdentName: '[local]_[hash:base64:10]',
                            }
                        },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                outputStyle: 'compressed'
                            }
                        }
                    ]
                )
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("style.css"),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './index.html'
        })
    ],
    resolve: {
        extensions: ['.js'],
        alias: {
            util: path.resolve(__dirname,'src/util'),
            vendor: path.resolve(__dirname, 'framework/vendor'),
            static: path.resolve(__dirname, 'src/static'),
            module: path.resolve(__dirname, 'src/module')
        }
    },
    // devtool: 'source-map'
}
