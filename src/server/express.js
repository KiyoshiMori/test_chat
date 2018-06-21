import express from 'express';
import path from 'path';
import expressStaticGzip from "express-static-gzip";

import React from 'react';

import webpack from 'webpack';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';

import configDevClient from '../../config/webpack.dev-client';
import configProdClient from '../../config/webpack.prod-client';
import configDevServer from '../../config/webpack.dev-server';
import configProdServer from '../../config/webpack.prod-server';

const server = express();

const isProd = process.env.BABEL_ENV === 'production';
const isDev = !isProd;
let isBuilt = false;

console.log({ isDev });

const done = () => {
	console.log({ isBuilt });
	if (isBuilt) return;

	server.listen(8080, () => {
		isBuilt = true;
		console.log('server start:', 'localhost:', 8080);
	});
};

if (isDev) {
	const compiler = webpack([configDevClient, configDevServer]);

	const clientCompiler = compiler.compilers[0];
	const serverCompiler = compiler.compilers[1];

	const webpackDevMW = require('webpack-dev-middleware');
	const webpackHotMW = require('webpack-hot-middleware');

	server.use(webpackDevMW(compiler, configDevClient.devServer));
	server.use(webpackHotMW(clientCompiler, configDevClient.devServer));
	server.use(webpackHotServerMiddleware(compiler));
	done();
} else {
	// ssr
	webpack([configProdClient, configProdServer]).run((err, stats) => {
		server.use(expressStaticGzip("dist", {
				enableBrotli: true
			})
		);

		const render = require("../../build/prod-server-bundle.js").default;

		server.use(render());
		done();
	});
	//
}
