const path = require('path');
const webpack = require('webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotilPlugin = require('brotli-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    name: 'client',
    entry: {
        vendor: ['react', 'react-dom'],
        main: './src/main.js'
    },
    mode: 'production',
    output: {
        filename: '[name]-bundle.js',
	    chunkFilename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    devServer: {
        contentBase: 'dist',
        overlay: true,
        hot: true,
        stats: {
            colors: true,
        }
    },
	optimization: {
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				vendor: {
					name: 'vendor',
					chunks: "initial",
					minChunks: 2
				}
			}
		}
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
                      loader: 'babel-loader'
                  }
              ],
              exclude: /node_modules/,
            },
	        {
		        test: /\.css$/,
		        use: [MiniCSSExtractPlugin.loader, 'css-loader']
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
              test: /\.html$/,
              use: [
                  {
                      loader: 'file-loader',
                      options: {
                          name: '[name].html'
                      }
                  }
              ]
            },
            {
                test: /\.(jpg|gif|png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
    	new MiniCSSExtractPlugin(),
	    new CompressionPlugin({
		    algorithm: 'gzip'
	    }),
	    new BrotilPlugin(),
	    new Dotenv(),
    ]
};
