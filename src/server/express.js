require('dotenv').config();
import 'isomorphic-fetch';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import expressPlayground from 'graphql-playground-middleware-express';
import bodyParser from 'body-parser';
import apiRoutes from './apiRoutes';

import React from 'react';

import webpack from 'webpack';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import expressStaticGzip from "express-static-gzip";

import configDevClient from '../../config/webpack.dev-client';
import configProdClient from '../../config/webpack.prod-client';
import configDevServer from '../../config/webpack.dev-server';
import configProdServer from '../../config/webpack.prod-server';

import schema from '../lib/graphql/schema';

const server = express();
const app = express();
const ws = createServer(server);

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
let isBuilt = false;

const done = () => {
	if (isBuilt) return;

	server.use(cors());
	server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
	server.use('/playground', expressPlayground ({
		endpointURL: '/graphql',
		subscriptionsEndpoint: 'ws://localhost:7070/subscriptions'
	}));

	app.listen(8080, () => {
		isBuilt = true;
		console.log('app start:', 'localhost:', 8080);
	});

	server.listen(8081, () => {
		console.log('server started!');
	});

	ws.listen(7070, () => {
		new SubscriptionServer({
			execute,
			subscribe,
			schema,
		}, {
			server: ws,
			path: '/subscriptions'
		})
	})
};

server.use(bodyParser.json());

apiRoutes(server);

if (isDev) {
	const compiler = webpack([configDevClient, configDevServer]);

	const clientCompiler = compiler.compilers[0];
	const serverCompiler = compiler.compilers[1];

	const webpackDevMW = require('webpack-dev-middleware');
	const webpackHotMW = require('webpack-hot-middleware');

	app.use(webpackDevMW(compiler, configDevClient.devServer));
	app.use(webpackHotMW(clientCompiler, configDevClient.devServer));
	app.use(webpackHotServerMiddleware(compiler));
	done();
} else {
	// ssr
	webpack([configProdClient, configProdServer]).run((err, stats) => {
		app.use(expressStaticGzip("dist", {
				enableBrotli: true
			})
		);

		const clientStats = stats.toJson().children[0];

		console.log(stats.toString({
			colors: true
		}));

		const render = require("../../build/prod-server-bundle.js").default;

		app.use(render({ clientStats }));
		done();
	});
	//
}
