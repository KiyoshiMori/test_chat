import React, { Component } from 'react';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionTest } from '../redux/reducers';
// import universal from 'react-universal-component';

import UniversalComponent from './Components/UniversalComponent';
const MainPage = import('./Components/MainPage');

@withRouter
@connect()
export default class extends Component {
	render() {
		const { dispatch } = this.props;
		return (
			<div>
				<div>
					<Link to="/">Main page</Link>
					<Link to="/test">Test page</Link>
				</div>
				<Switch>
					<Route
						exact path="/"
						render={() =>
							<UniversalComponent
								is={MainPage}
								onLoad={onLoadText => dispatch(actionTest(onLoadText))}
							/>
						}
					/>
					<Route path="/test" render={() => <h1>testtest</h1>} />
				</Switch>
			</div>
		)
	}
}