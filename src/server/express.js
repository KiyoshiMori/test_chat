import express from 'express';
import path from 'path';
import expressStaticGzip from "express-static-gzip";

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import webpack from 'webpack';

import configDevClient from '../../config/webpack.dev-client';
import configProdClietn from '../../config/webpack.prod-client';
import configDevServer from '../../config/webpack.dev-server';
import configProdServer from '../../config/webpack.prod-server';

import App from '../../src/client/index';

const server = express();

const isProd = process.env.BABEL_ENV === 'production';
const isDev = !isProd;

console.log({ isDev });

if (isDev) {
	const compiler = webpack([ configDevClient, configDevServer ]);

	const clientCompiler = compiler.compilers[0];
	const serverCompiler = compiler.compilers[1];

	const webpackDevMW = require('webpack-dev-middleware');
	const webpackHotMW = require('webpack-hot-middleware');

	server.use(webpackDevMW(compiler, configDevClient.devServer));
	server.use(webpackHotMW(clientCompiler, configDevClient.devServer));
} else {
	server.use(expressStaticGzip("dist", {
			enableBrotli: true
		})
	);

	// ssr
	server.get("*", (req, res) => {
		const html = (`
		<html>
    		<body>
    			<h1>test</h1>
        		<div id="root">
    				${ReactDOMServer.renderToString(<App/>)}
				</div>
    		</body>
    		<script src="vendor-bundle.js"></script>
            <script src="main-bundle.js"></script>
		</html>
	`);

		res.send(html);
	});
	//
}

server.listen(8080, () => {
	console.log('server start:', 'localhost:', 8080);
});
