const path = require('path');
const webpack = require('webpack');

module.exports = {
	name: 'client',
	mode: 'development',
	entry: {
	    vendor: ['react', 'react-dom'],
        main: [
        	'react-hot-loader/patch',
	        'babel-runtime/regenerator',
	        'webpack-hot-middleware/client?reload=true',
	        './src/main.js'
        ]
    },
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
    module: {
        rules: [
            {
              test: /\.js$/,
              use: [
                  {
                      loader: 'babel-loader'
                  }
              ],
              exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
	        {
		        test: /\.styl$/,
		        use: [
		        	'style-loader',
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
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('development'),
                WEBPACK: true,
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
