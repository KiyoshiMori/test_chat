import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router';

import { AuthBlock } from './components';

import { login, signup } from '../../../lib/graphql/queries/user';
import { auth } from '../../../lib/redux/thunk';

@graphql(login, {
	name: 'login',
})
@graphql(signup, {
	name: 'registration',
})
export default class AuthContainer extends Component {
	state = {
		username: '',
		password: '',
		confirmPassword: '',
		isRegistration: false,
	};

	toggleLogReg = () => (
		this.setState(state => ({ isRegistration: !state.isRegistration }))
	);

	setHeaderButtons = remove => {
		const { setHeaderButtons } = this.props;
		const { isRegistration } = this.state;

		if (remove) return setHeaderButtons([null]);

		return setHeaderButtons([
			{
				text: isRegistration ? 'LOGIN' : 'REGISTRATION',
				onClick: this.toggleLogReg
			},
		]);
	};

	componentWillMount() {
		const { history, authorization } = this.props;
		this.setHeaderButtons();
		authorization?.isAuth && history.push('/test', {animate: true});
	}


	componentDidUpdate(prevProps, prevState) {
		const { history, authorization } = this.props;

		if (prevState.isRegistration !== this.state.isRegistration) {
			this.setHeaderButtons();
		}

		if ((prevProps.authorization.isAuth !== authorization.isAuth) && (authorization.isAuth === true)) {
			history.push('/test', {animate: true});
		}
	}

	componentWillUnmount() {
		this.setHeaderButtons(true);
	}

	authFunc = async ({ username, password }) => {
		const { login, registration, dispatch } = this.props;
		const { isRegistration } = this.state;

		dispatch(auth(
			isRegistration
				? registration({ variables: { username, password } })
				: login({ variables: { username, password } }),
			isRegistration
		));
	};

	handleInput = e => (
		this.setState({ [e.target.name]: e.target.value })
	);

	render() {
		const { authorization, history } = this.props;
		const { username, password, confirmPassword, isRegistration } = this.state;

		return (
			<AuthBlock
				auth={this.authFunc}
				loading={authorization?.loading}
				error={authorization?.error}
				handleInput={this.handleInput}
				values={{ username, password, confirmPassword }}
				isRegistration={isRegistration}
			/>
		);
	}
}