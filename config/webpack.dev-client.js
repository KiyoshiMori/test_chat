const path = require('path');
const webpack = require('webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

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
        // hot: true,
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
                use: [MiniCSSExtractPlugin.loader, 'css-loader']
            },
            // {
            //   test: /\.html$/,
            //   use: [
            //       {
            //           loader: 'file-loader',
            //           options: {
            //               name: '[name].html'
            //           }
            //       }
            //   ]
            // },
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
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('development'),
                WEBPACK: true,
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
