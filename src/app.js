import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader'

import store from './redux/store';

import App from './client/AppRoot';

const render = Component => {
	ReactDOM.hydrate(
		<Provider store={store}>
			<AppContainer>
				<Component />
			</AppContainer>
		</Provider>,
		document.getElementById("root")
	);
};

render(App);

if (module.hot) {
	module.hot.accept('./client/AppRoot', () => {
		const newApp = require('./client/AppRoot').default;
		render(newApp);
	});
}
