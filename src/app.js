import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'

import App from './client/Components/AppRoot';

const render = Component => {
	ReactDOM.hydrate(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.getElementById("root")
	);
};

render(App);

if (module.hot) {
	module.hot.accept('./client/Components/AppRoot', () => {
		const newApp = require('./client/Components/AppRoot').default;
		render(newApp);
	});
}
