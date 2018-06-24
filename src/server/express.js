import 'isomorphic-fetch';
import express from 'express';
import expressStaticGzip from "express-static-gzip";
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { Pool, Client } from 'pg';
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
const app = express();

require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
let isBuilt = false;

console.log({ isDev });

const done = () => {
	console.log({ isBuilt });
	if (isBuilt) return;

	app.listen(8080, () => {
		isBuilt = true;
		console.log('app start:', 'localhost:', 8080);
		server.listen(8081, () => {
			console.log('server started!');
		})
	});
};

// TEMP TEST ZONE
const connectionConfigure = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD
};

const pool = new Pool(connectionConfigure);

pool.query('SELECT NOW()', (err, res) => {
	console.log('pool', { err, res });
	pool.end();
});

const client = new Client(connectionConfigure);
client.connect();

const query = 'INSERT INTO messages(identifier_message_number, message, "from") VALUES($1, $2, $3) RETURNING *';
const values = ['135', 'test123test', 15];

client.query(query, values, (err, res) => {
	console.log('client', { err, res: res?.rows[0] });
	client.end();
});
// //

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

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
