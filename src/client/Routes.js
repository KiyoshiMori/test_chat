import React, { Component } from 'react';
import {
	Route, Link, Switch, withRouter, Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withApollo, graphql } from 'react-apollo';
import { authReducer } from '../lib/redux/reducers';
import { getMyInfo } from '../lib/graphql/queries/user';

import UniversalComponent from './components/UniversalComponent';
import Page from 'Components/Page';
import Header from 'Components/Header';

const MainPage = import('./components/MainPage');
const AuthPage = import('./containers/Auth');

@withApollo
@withRouter
@connect(authReducer)
export default class extends Component {
	state = {
		headerButtons: [null]
	};

	setHeaderButtons = buttons => this.setState({ headerButtons: buttons });

	render() {
		const { dispatch, authorization } = this.props;
		const { headerButtons } = this.state;

		return (
			<Page>
				<Header headerButtons={headerButtons} />
				<Switch>
					<Route
						exact path="/"
						render={() =>
							<UniversalComponent
								is={AuthPage}
								dispatch={dispatch}
								authorization={authorization}
								setHeaderButtons={this.setHeaderButtons}
							/>
						}
					/>
				</Switch>
			</Page>
		);
	}
};
