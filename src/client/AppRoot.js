import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { client } from '../lib/graphql';

import Routes from './Routes';

export default class extends Component {
	render() {
		return (
			<Router>
				<Routes receiver={10} sender={18} />
			</Router>
		);
	}
}