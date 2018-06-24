import React, { Component } from 'react';
import { Route, Link, Switch, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { actionTest } from '../lib/redux/reducers';
// import universal from 'react-universal-component';
// import './test.styl';
import styles from './test.styl';

import UniversalComponent from './Components/UniversalComponent';
const MainPage = import('./Components/MainPage');

@withApollo
@withRouter
@connect()
export default class extends Component {
	render() {
		const { dispatch } = this.props;

		console.log(this.props, 'props at roout');

		return (
			<div>
				<div className={styles.Links}>
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