import React, { Component } from 'react';
import { Route, Link, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { actionTest, testReducer } from '../lib/redux/reducers';
// import universal from 'react-universal-component';
// import './test.styl';
import styles from './test.styl';

import UniversalComponent from './Components/UniversalComponent';
import {graphql} from "react-apollo/index";
import {getMyInfo} from "../lib/graphql/queries/user";
const MainPage = import('./Components/MainPage');

@withApollo
@withRouter
@connect(testReducer)
@graphql(getMyInfo, {
	props: ({ data }) => {
		console.log({ data });

		if (data.loading === true) {
			return { loading: data.loading }
		} else {
			const {authorized, ...info} = data?.getMyInfo;
			return {
				myInfo: {
					info: {...info},
					authorized,
					user_id: info.id,
					infoRefetch: data.refetch,
				}
			}
		}
	}
})
export default class extends Component {
	render() {
		const { dispatch, myInfo, loading } = this.props;

		// console.log(this.props, this, 'props at root');

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
								// onLoad={onLoadText => dispatch(actionTest(onLoadText))}
								receiver={14}
								sender={21}
								loading={loading}
								{...myInfo}
							/>
						}
					/>
					<Route path="/test" render={() => {
						return myInfo?.authorized
							? <h1>testtest</h1>
							: <Redirect to='/' />
					}} />
					<Route path="/testlogin" render={() => <Redirect to='/test' />} />
				</Switch>
			</div>
		)
	}
}