import 'isomorphic-fetch';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { PostgresPubSub } from 'graphql-postgres-subscriptions';
import bodyParser from 'body-parser';
import React from 'react';

const server = express();
const ws = createServer(server);

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
let isBuilt = false;

const pubsub = new PostgresPubSub({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD
});

server.use(bodyParser.json());
server.use('*', cors({
	origin: `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`, credentials: true,
}));
server.use(require('cookie-parser')());

const schema = require('../lib/graphql/schema');

const done = () => {
	if (isBuilt) return;

	server.listen(process.env.PORT, () => {
		isBuilt = true;
		console.log('server started!');
	});

	ws.listen(process.env.PORT_WS, () => {
		new SubscriptionServer({
			execute,
			subscribe,
			schema,
			rootValue: { pubsub }
		}, {
			server: ws,
			path: '/subscriptions'
		})
	})
};

require('./auth').default(server);
require('./apiRoutes').default(server, pubsub);
require('./graphql').default(server, schema, pubsub);

console.log({ isDev });
if (isDev) {
	require('./webpackCompile').webpackHotLoader(server);
	done();
} else {
	require('./webpackCompile').webpackSSR(server);
	done();
}
