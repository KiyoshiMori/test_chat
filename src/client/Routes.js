import React, { Component } from 'react';
import {
	Route, Link, Switch, withRouter, Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withApollo, graphql } from 'react-apollo';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

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
		const { dispatch, authorization, location, ...rest } = this.props;
		const { headerButtons } = this.state;

		console.log(this.props, location, location.key);

		return (
			<Page>
				<Header headerButtons={headerButtons} />
				<Link to="/auth">main</Link>
				<Link to="/test">test</Link>
				<Link to="/test2">test2</Link>
				<TransitionGroup component={null}>
					<CSSTransition
						key={location.key}
						// TODO improve transition conditions handling
						classNames={
							location.pathname === '/auth'
								? 'slide'
								: location.state?.animate ? 'fade' : 'null'
						}
						timeout={
							(location.pathname === '/auth' || location.state?.animate)
								? 1000
								: 0
						}
					>
						<Switch location={location}>
							<Route
								exact path="/auth"
								render={() =>
									<UniversalComponent
										is={AuthPage}
										dispatch={dispatch}
										authorization={authorization}
										setHeaderButtons={this.setHeaderButtons}
										{...rest}
									/>
								}
							/>
							<Route
								path="/test"
								render={() =>
									<div>TEST</div>
								}
							/>
						</Switch>
					</CSSTransition>
				</TransitionGroup>
			</Page>
		);
	}
};
