const path = require('path');
const webpack = require('webpack');
const externals = require('./externals');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    name: 'server',
	mode: 'production',
	target: 'node',
	externals,
	entry: './src/server/render.js',
    output: {
        filename: 'prod-server-bundle.js',
        path: path.resolve(__dirname, '../build'),
	    libraryTarget: "commonjs2"
    },
	resolve: {
		alias: {
			Styled: path.resolve(__dirname, '../src/lib/styled'),
			Components: path.resolve(__dirname, '../src/client/components'),
		},
		extensions: ['.js', '.jsx'],
	},
	module: {
        rules: [
            {
              test: /\.jsx?$/,
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
                		loader: 'css-loader',
		                options: {
			                minimize: true,
		                }
	                },
                ],
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
    ]
};
