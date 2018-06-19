const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    name: 'server',
    entry: {
        server: './src/server/main.js'
    },
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve(__dirname, '../build'),
    },
    mode: 'production',
    target: 'node',
	externals: nodeExternals(),
	module: {
        rules: [
            {
              test: /\.js$/,
              use: [
                  {
                      loader: "babel-loader"
                  }
              ],
              exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
              test: /\.html$/,
              use: [
                  {
                      loader: "file-loader",
                      options: {
                          name: "[name].html"
                      }
                  }
              ]
            },
            {
                test: /\.(jpg|gif|png)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "images/[name].[ext]",
	                        emitFile: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
    ]
};
