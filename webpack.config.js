'use strict';

const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

const pkg = require('./package.json');

const Clean = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'app');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');

process.env.BABEL_ENV = TARGET;

// common configuration for all lifecycle events
const common = {
    entry: APP_PATH,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: APP_PATH
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
        module: {
            preLoaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['eslint'],
                    include: APP_PATH
                },
                {
                    test: /\.css$/,
                    loaders: ['csslint'],
                    include: APP_PATH
                }
            ],
            loaders: [
                {
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    include: APP_PATH
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
    });
}

if ( TARGET === 'build' || TARGET === 'stats' ) {
    module.exports = merge(common, {
        entry: {
            app: APP_PATH,
            vendor: Object.keys(pkg.dependencies)
        },
        /* important! */
        output: {
            // Note that hashing the file names themselves is preferred to using query params
            // to force the cache to invalidate
            // http://www.stevesouders.com/blog/2008/08/23/revving-filenames-dont-use-querystring/
            path: BUILD_PATH,
            filename: '[name].[chunkhash].js'
        },
        devtool: 'source-map',
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css'),
                    // To chain loaders using function syntax use ! operator, ie
                    // loader: ExtractTextPlugin.extract('style', 'css!autoprefixer-loader'),
                    include: APP_PATH
                }
            ]
        },
        plugins: [
            // TODO: Checkout the DedupePlugin to help remove duplication from the bundled libs
            // https://github.com/webpack/docs/wiki/optimization

            // TODO: CHeckout code splitting to lazy load modules
            // https://webpack.github.io/docs/code-splitting.html
            new Clean(['build']),
            new ExtractTextPlugin('styles.[chunkhash].css'),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    // This affects react lib size
                    'NODE_ENV' : JSON.stringify('production')
                }
            }),
            new webpack.optimize.CommonsChunkPlugin(
                'vendor',
                '[name].[chunkhash].js'
            )
        ]
    });
}
