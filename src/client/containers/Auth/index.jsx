import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router';

import { AuthBlock } from './components';
import { ButtonsContext } from '../../../lib/context/headerButtons';

import { login } from '../../../lib/graphql/queries/user';
import { auth } from '../../../lib/redux/thunk';

import Button from 'Components/Button';

@graphql(login, {
	name: 'login',
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

	setHeaderButtons = () => {
		const { setHeaderButtons } = this.props;
		const { isRegistration } = this.state;

		setHeaderButtons([
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


	login = async ({ username, password }) => {
		const { login, dispatch } = this.props;
		dispatch(auth(
			login({ variables: { username, password } })
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
				login={this.login}
				loading={authorization?.loading}
				error={authorization?.error}
				handleInput={this.handleInput}
				values={{ username, password, confirmPassword }}
				isRegistration={isRegistration}
			/>
		);
	}
}