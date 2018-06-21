import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from '../client/Components/Routes';

export default () => (req, res) => {
	const html = (`
			<html>
				<head>
					<link href="/main.css" rel="stylesheet" />
				</head>
	            <body>
	                <h1>testFromRender!</h1>
	                <div id="root">${renderToString(
	                	<StaticRouter location={req.url} context={{}}>
	                	    <App/>
		                </StaticRouter>
					)}</div>
	            </body>
	            <script src="vendor-bundle.js"></script>
	            <script src="main-bundle.js"></script>
			</html>
		`);

	res.send(html);
}