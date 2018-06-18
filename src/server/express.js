import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMW from 'webpack-dev-middleware';
import webpackHotMW from 'webpack-hot-middleware';
import webpackConfig from '../../config/webpack.dev';

const server = express();

const compiler = webpack(webpackConfig);

server.use(webpackDevMW(compiler, webpackConfig.devServer));
server.use(webpackHotMW(compiler));

const staticMiddleware = express.static('dist');

server.use(staticMiddleware);

server.listen(8080, () => {
	console.log('server start');
});
