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
@graphql(getMyInfo, {
	options: {
		ssr: false,
	},
	props: ({ data }) => {
		console.log({ data });

		if (data.loading === true) {
			return { loading: data.loading };
		} else {
			const { authorized, ...info } = data?.getMyInfo;
			return {
				myInfo: {
					info: { ...info },
					authorized,
					user_id: info.id,
					infoRefetch: data.refetch,
				},
			};
		}
	},
})
export default class extends Component {
	render() {
		const { dispatch, myInfo, loading } = this.props;

		console.log(this.props);

		return (
			<Page>
				<Header />
				{loading
					? <div>Loading...</div>
					: (
						<Switch>
							<Route
								exact path="/"
								render={() =>
									<UniversalComponent
										is={AuthPage}
										{...myInfo}
									/>
								}
							/>
						</Switch>
					)
				}
			</Page>
		);
	}
};
