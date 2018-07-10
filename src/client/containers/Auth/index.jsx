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
		this.setHeaderButtons();
	}


	componentDidUpdate(prevProps, prevState) {
		if (prevState.isRegistration !== this.state.isRegistration) {
			this.setHeaderButtons();
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
		const { authorization } = this.props;
		const { username, password, confirmPassword, isRegistration } = this.state;

		if (authorization?.isAuth) return (
			<Redirect to="/test" />
		);

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