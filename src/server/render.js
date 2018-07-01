import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { Provider } from 'react-redux';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import App from '../client/Routes';
import store from '../lib/redux/store';
import { client } from '../lib/graphql';

export default ({ clientStats }) => (req, res) => {
	const { js, styles, cssHash } = flushChunks(clientStats, {
		chunkNames: flushChunkNames()
	});

	// req.get('/', (req, res) => {
	// 	console.log(req);
	// 	res.redirect('/test');
	// });

	// console.log(req, 'test renderer');

	getDataFromTree(App).then(() => {
		const initialState = client.extract();

		const reduxState = {
			user: req.user,
			isAuth: req.isAuthenticated()
		};

		const routerContext = {};

		const html = (`
			<html>
				<head>
					${styles}
				</head>
	            <body>
	                <h1>testFromRender!</h1>
	                <div id="root">${renderToString(
						<ApolloProvider client={client}>
							<Provider store={store}>
								<StaticRouter location={req.url} context={routerContext}>
									<App />
								</StaticRouter>
							</Provider>
						</ApolloProvider>
					)}</div>
	            </body>
        		<script id="redux-state">window.__REDUX_STATE__=${JSON.stringify(reduxState)}</script>
        		<script id="apollo-state">window.__APOLLO_STATE__=${JSON.stringify(initialState)}</script>
	            ${js}
	            ${cssHash}
			</html>
		`);

		console.log(routerContext, req.user, req.session, 'router context');

		if (routerContext.url) {
			res.status(302).setHeader('Location', routerContext.url);
			console.log('TEST', routerContext, routerContext.url);
			res.end();
			return;
		}

		res.status(routerContext.missed ? 404 : 200).send(html);
		// res.send(html);
	})
}