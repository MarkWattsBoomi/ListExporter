const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');
const flow = require('./package.json').flow;

module.exports = function() {
    const config = {
        entry: "./src/index.tsx",
        output: {
            filename: flow.filenames.js,
            path: path.resolve(__dirname, 'build'),
            sourceMapFilename: "[flow.filenames.js].map"
        },
        devtool: 'inline-source-map',
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        devServer: {
            contentBase: './build'
        },
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    enforce: 'pre',
                    use: [
                        {
                            loader: 'tslint-loader',
                            options: {
                                fix: true
                            }
                        }
                    ]
                },
                { 
                    test: /\.tsx?$/, 
                    loader: "ts-loader" 
                },
                { 
                    test: /\.js$/, 
                    enforce: "pre", 
                    loader: "source-map-loader" 
                },
                { 
                    test:/\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader"
                      ]
                }
            ]
        },
        externals: {
            "react": "React",
            "react-dom": "ReactDOM"
        },
        plugins: [
            new WriteFilePlugin(),
            new MiniCssExtractPlugin({ filename: flow.filenames.css })
        ],
    }

    if (!fs.existsSync('./build'))
        fs.mkdirSync('./build');

    return config;
};