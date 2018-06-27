import webpack from 'webpack';
import expressStaticGzip from 'express-static-gzip';

import configDevClient from "../../config/webpack.dev-client";
import configDevServer from "../../config/webpack.dev-server";
import configProdClient from "../../config/webpack.prod-client";
import configProdServer from "../../config/webpack.prod-server";

export const webpackHotLoader = (server) => {
	const compiler = webpack([configDevClient, configDevServer]);

	const clientCompiler = compiler.compilers[0];
	const serverCompiler = compiler.compilers[1];

	const webpackDevMW = require('webpack-dev-middleware');
	const webpackHotMW = require('webpack-hot-middleware');
	const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
	server.use(webpackDevMW(compiler, configDevClient.devServer));
	server.use(webpackHotMW(clientCompiler, configDevClient.devServer));
	server.use(webpackHotServerMiddleware(compiler));
};

export const webpackSSR = (server) => {
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

		server.use(render({clientStats}));
	});
};
