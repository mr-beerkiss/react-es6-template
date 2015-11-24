'use strict';

const path = require('path');
const webpack = require('webpack');

const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');

module.exports = config => {
    config.set({
        browsers: ['Chrome'],
        singleRun: false,
        frameworks: ['jasmine'],
        files: [
            'tests.webpack.js'
        ],
        preprocessors: {
            'tests.webpack.js' : [ 'webpack' ]
        },
        reporters: ['dots'],
        webpack: {
            module: {
                preLoaders: [
                    {
                        test: /\.jsx?$/,
                        loaders: ['eslint'],
                        include: SRC_PATH
                    }
                ],
                loaders: [
                    {
                        test: /\.jsx?$/, 
                        loaders: ['babel'],
                        include: SRC_PATH
                    }
                ]
            }
        },
        webpackServer: {
            noInfo: true
        }
    });
};