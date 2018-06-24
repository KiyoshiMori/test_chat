import 'isomorphic-fetch';
import express from 'express';
import expressStaticGzip from "express-static-gzip";
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';

import React from 'react';

import webpack from 'webpack';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';

import configDevClient from '../../config/webpack.dev-client';
import configProdClient from '../../config/webpack.prod-client';
import configDevServer from '../../config/webpack.dev-server';
import configProdServer from '../../config/webpack.prod-server';

import schema from '../lib/graphql/schema';

const server = express();

require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
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

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

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

		const clientStats = stats.toJson().children[0];

		console.log(stats.toString({
			colors: true
		}));

		const render = require("../../build/prod-server-bundle.js").default;

		server.use(render({ clientStats }));
		done();
	});
	//
}
