import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import App from '../client/Routes';
import store from '../lib/redux/store';

export default ({ clientStats }) => (req, res) => {
	const { js, styles, cssHash } = flushChunks(clientStats, {
		chunkNames: flushChunkNames()
	});

	const html = (`
			<html>
				<head>
					${styles}
				</head>
	            <body>
	                <h1>testFromRender!</h1>
	                <div id="root">${renderToString(
	                	<Provider store={store}>
		                    <StaticRouter location={req.url} context={{}}>
		                        <App/>
			                </StaticRouter>
		                </Provider>
					)}</div>
	            </body>
	            ${js}
	            ${cssHash}
			</html>
		`);

	res.send(html);
}