import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { Provider } from 'react-redux';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { StyleSheetManager, ServerStyleSheet } from 'styled-components';

import App from '../client/Routes';
import store from '../lib/redux/store';
import { client } from '../lib/graphql';

export default ({ clientStats }) => (req, res) => {
	const { js, styles, cssHash } = flushChunks(clientStats, {
		chunkNames: flushChunkNames(),
	});

	const sheet = new ServerStyleSheet();

	getDataFromTree(App).then(() => {
		const initialState = client.extract();

		const reduxState = {
			user: req.user,
			isAuth: req.isAuthenticated(),
		};

		const routerContext = {};

		const app = (
			<ApolloProvider client={client}>
				<Provider store={store}>
					<StaticRouter location={req.url} context={routerContext}>
						<StyleSheetManager sheet={sheet.instance}>
							<App />
						</StyleSheetManager>
					</StaticRouter>
				</Provider>
			</ApolloProvider>
		);

		const html = `
	<html>
		<head>
			${styles}
		</head>
		<body>
			<h1>testFromRender!</h1>
			<div id="root">${renderToString(app)}</div>
		</body>
		<script id="redux-state">window.__REDUX_STATE__=${JSON.stringify(reduxState)}</script>
		<script id="apollo-state">window.__APOLLO_STATE__=${JSON.stringify(initialState)}</script>
		${js}
		${cssHash}
	</html>
`;

		console.log(routerContext, req.user, req.session, 'router context');

		if (routerContext.url) {
			res.status(302).setHeader('Location', routerContext.url);
			console.log('TEST', routerContext, routerContext.url);
			res.end();
			return;
		}

		res.status(routerContext.missed ? 404 : 200).send(html);
	});
};
