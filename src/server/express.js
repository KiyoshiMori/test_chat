import express from 'express';
import path from 'path';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from '../../src/client/index';

const server = express();

const isProd = process.env.NODE_ENV;
const isDev = !isProd;

if (isDev) {
	const webpack = require('webpack');
	const webpackConfig = require('../../config/webpack.dev');

	const compiler = webpack(webpackConfig);

	const webpackDevMW = require('webpack-dev-middleware');
	const webpackHotMW = require('webpack-hot-middleware');

	server.use(webpackDevMW(compiler, webpackConfig.devServer));
	server.use(webpackHotMW(compiler));
}

const staticMiddleware = express.static('dist');

server.use(staticMiddleware);

//ssr
server.get("*", (req, res) => {
	const html = (`
		<html>
    		<body>
        		<div id="root">
    				${ReactDOMServer.renderToString(<App />)}
				</div>
    		</body>
            <script src="main-bundle.js"></script>
		</html>
	`);

	res.send(html);
});
//

server.listen(8080, () => {
	console.log('server start:', 'localhost:', 8080);
});
