import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { client } from '../lib/graphql';

import Routes from './Routes';

export default class extends Component {
	render() {
		console.log(this.props);

		return (
			<Router>
				<Route
					render={({ location, ...rest }) => {
						console.log({ location });
						return <Routes location={location} {...rest} />;
					}}
				/>
			</Router>
		);
	}
}