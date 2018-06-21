import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../../src/client/index';

export default () => (req, res) => {
	const html = (`
			<html>
	            <body>
	                <h1>testFromRender!</h1>
	                <div id="root">${renderToString(<App/>)}</div>
	            </body>
	            <script src="vendor-bundle.js"></script>
	            <script src="main-bundle.js"></script>
			</html>
		`);

	res.send(html);
}