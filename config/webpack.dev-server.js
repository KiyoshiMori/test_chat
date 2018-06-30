const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const externals = require('./externals');
// use minicss-extract-loader here because of bug with ssr and use of style-loader with it is unavaliable
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    name: 'server',
	mode: 'development',
	target: 'node',
	externals,
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
		        test: /\.gql$/,
		        loader: 'graphql-tag/loader'
	        },
            {
                test: /\.css$/,
	            use: {
		            loader: 'css-loader',
		            options: {
			            minimize: true,
		            }
	            }
            },
	        {
	            test: /\.styl$/,
		        use: [
			        MiniCSSExtractPlugin.loader,
			        {
			        	loader: 'css-loader',
				        options: {
			        		modules: true,
					        localIdentName: '[local]-[hash]'
				        }
			        },
			        'postcss-loader',
			        'stylus-loader'
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
    	new MiniCSSExtractPlugin(),
	    new webpack.optimize.LimitChunkCountPlugin({
		    maxChunks: 1
	    }),
	    new webpack.DefinePlugin({
		    "process.env": {
			    NODE_ENV: JSON.stringify('development'),
		    }
	    }),
	    new Dotenv()
    ],
};
