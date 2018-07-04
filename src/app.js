import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { AppContainer } from 'react-hot-loader';
import { ThemeProvider } from 'styled-components';

import store from './lib/redux/store';
import { client } from './lib/graphql';

import theme from 'Styled/theme';

import App from './client/AppRoot';

const render = Component => {
	console.log({ client });

	ReactDOM.hydrate(
		<ApolloProvider client={client}>
			<Provider store={store}>
				<AppContainer>
					<ThemeProvider theme={theme}>
						<Component />
					</ThemeProvider>
				</AppContainer>
			</Provider>
		</ApolloProvider>,
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
