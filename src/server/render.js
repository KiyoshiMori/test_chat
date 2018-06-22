import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import App from '../client/Routes';
import store from '../redux/store';

export default ({ clientStats }) => (req, res) => {
	const names = flushChunkNames();
	const { js, style } = flushChunks(clientStats, {
		chunkNames: names
	});

	const html = (`
			<html>
				<head>
					<link href="/main.css" rel="stylesheet" />
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
			</html>
		`);

	res.send(html);
}