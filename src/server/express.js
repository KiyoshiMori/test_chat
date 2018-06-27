import 'isomorphic-fetch';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import expressPlayground from 'graphql-playground-middleware-express';
import { PostgresPubSub } from 'graphql-postgres-subscriptions';
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
import db from './db';

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

const done = () => {
	if (isBuilt) return;

	server.listen(process.env.PORT_SERVER, () => {
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

apiRoutes(server, pubsub);

const passport = require('passport');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const store = new KnexSessionStore({
	knex: db,
	tablename: 'sessions',
});

server.use(require('cookie-parser')());
server.use(session({ secret: 'cat', store, saveUninitialized: true, resave: true }));
server.use(passport.initialize());
server.use(passport.session());

server.get('/', (req, res, next) => {
	console.log('USER:', req.user);
	res.locals.user = req.user;
	next();
});

server.use('/login', (req, res, next) => {
	req.login({ id: 13 }, (err) => {
		console.log('user at login page', req.user);
		return res.redirect('/');
	});
});

passport.serializeUser((user, done) => {
	done(null, user)
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

server.use('*', cors({ origin: 'http://localhost:8081', credentials: true }));
server.use('/graphql',
	(req, res, next) => {
		console.log('GRAPHQL USER', req.user, res.locals.user);

		if (!req.user) {
			// res.json('You are not authorized!')
		}

		next();
	},
	graphqlExpress(req => ({
		schema,
		context: { user: req.user, pubsub }
	}))
);
server.use('/playground', expressPlayground ({
	endpointURL: '/graphql',
	subscriptionsEndpoint: 'ws://localhost:7070/subscriptions'
}));

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
