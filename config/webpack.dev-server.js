const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    name: 'server',
	mode: 'development',
	target: 'node',
	externals: nodeExternals(),
	entry: './src/server/render.js',
    output: {
        filename: 'dev-server-bundle.js',
	    chunkFilename: '[name].js',
	    path: path.resolve(__dirname, '../build'),
	    libraryTarget: "commonjs2"
    },
	devtool: 'source-map',
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
	            use: {
		            loader: 'css-loader',
		            options: {
			            minimize: true
		            }
	            }
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
	    new webpack.DefinePlugin({
		    "process.env": {
			    NODE_ENV: JSON.stringify('development'),
		    }
	    }),
    ]
};
