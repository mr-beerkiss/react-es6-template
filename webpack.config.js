'use strict';

const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;
const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');

process.env.BABEL_ENV = TARGET;

// common configuration for all lifecycle events
const common = {
    entry: SRC_PATH,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loaders: ['eslint'],
                include: SRC_PATH
            },
            {
                test: /\.css$/,
                loaders: ['csslint'],
                include: SRC_PATH
            }
        ],
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: SRC_PATH
            },
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: SRC_PATH
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'Kanban App'
        })
    ],
};

if ( TARGET === 'start' || !TARGET ) {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            port: 3000
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
    });
}
