const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    name: 'server',
	mode: 'production',
	target: 'node',
	externals: nodeExternals(),
	entry: './src/server/render.js',
    output: {
        filename: 'prod-server-bundle.js',
        path: path.resolve(__dirname, '../build'),
	    libraryTarget: "commonjs2"
    },
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
                use: "css-loader",
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
	    new webpack.optimize.LimitChunkCountPlugin({
		    maxChunks: 1
	    }),
    ]
};
