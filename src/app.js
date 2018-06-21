import React from 'react';
import ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader'

import Client from './client';

const render = Component => {
	ReactDOM.hydrate(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.getElementById("root")
	);
};

render(Client);

if (module.hot) {
	module.hot.accept('./client', () => {
		const newClient = require('./client').default;
		render(newClient);
	});
}
