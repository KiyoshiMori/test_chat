import React from 'react';
import { renderToString } from 'react-dom/server';
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

	console.log(process.env);

	getDataFromTree(App).then(() => {
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
								<StaticRouter location={req.url} context={{}}>
									<App/>
								</StaticRouter>
							</Provider>
						</ApolloProvider>
					)}</div>
	            </body>
	            ${js}
	            ${cssHash}
			</html>
		`);

		res.send(html);
	})
}