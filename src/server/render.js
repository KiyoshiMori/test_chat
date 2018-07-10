import React from 'react';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { Provider } from 'react-redux';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { StyleSheetManager, ServerStyleSheet, ThemeProvider, injectGlobal } from 'styled-components';

import App from '../client/Routes';
import store from '../lib/redux/store';
import { client } from '../lib/graphql';
import theme from 'Styled/theme';
import globalStyles from 'Styled/globalStyles';

export default ({ clientStats }) => (req, res) => {
	const { js, styles, cssHash } = flushChunks(clientStats, {
		chunkNames: flushChunkNames(),
	});

	const sheet = new ServerStyleSheet();
	injectGlobal`${globalStyles}`;

	getDataFromTree(App).then(() => {
		const initialState = client.extract();

		const reduxState = {
			authorization: {
				isAuth: req.isAuthenticated(),
			},
		};

		const routerContext = {};

		const app = (
			<ApolloProvider client={client}>
				<Provider store={store}>
					<StaticRouter location={req.url} context={routerContext}>
						<ThemeProvider theme={theme}>
							<StyleSheetManager sheet={sheet.instance}>
								<App />
							</StyleSheetManager>
						</ThemeProvider>
					</StaticRouter>
				</Provider>
			</ApolloProvider>
		);

		// ${renderToString(app)}
		const html = `
			<html>
				<head>
					<meta id="viewport" name="viewport" content ="width=device-width" />
					<link href="https://fonts.googleapis.com/css?family=Gaegu" rel="stylesheet">
					<link href="https://fonts.googleapis.com/css?family=Pangolin" rel="stylesheet">
					${styles}
				</head>
				<body>
					<div id="root">`;
		const html2 = `
			</div>
			</body>
			<script id="redux-state">window.__REDUX_STATE__=${JSON.stringify(reduxState)}</script>
			<script id="apollo-state">window.__APOLLO_STATE__=${JSON.stringify(initialState)}</script>
			${js}
			${cssHash}
		</html>`;

		res.write(html);

		const stream = sheet.interleaveWithNodeStream(renderToNodeStream(app));

		stream.pipe(res, { end: false });

		console.log(routerContext, req.user, req.session, 'router context');

		if (routerContext.url) {
			res.status(302).setHeader('Location', routerContext.url);
			console.log('TEST', routerContext, routerContext.url);
			res.end();
			return;
		}

		stream.on('end', () => res.end(html2));
		// res.status(routerContext.missed ? 404 : 200).send(html);
	});
};
