import React, { PureComponent } from 'react';
import styled from 'Styled';

import { Row, Col } from 'Components/Grid';
import Input from 'Components/Input';
import Button from 'Components/Button';
import Alert from 'Components/Alert';


// max-height: 250px;
const AuthWrapper = styled.div`
	display: flex;
	flex-direction: column;
	background-color: ${props => props.theme.colors.secondary};
	box-shadow: ${props => props.theme.shadow};
	border-radius: 30px;
	height: auto;
	width: auto;
	padding: 20px 59px;
	justify-content: center;
	align-items: center;
`;

export default class AuthBLock extends PureComponent {
	render() {
		const { values, handleInput, auth, isRegistration, error } = this.props;

		const { username = '', password = '', confirmPassword = '' } = values;

		return (
			<Row centered verticalCentered withHeader height="100%">
				<Col size={3} margin="0 0 150px">
					<AuthWrapper>
						<Input
							name="username"
							label="UsernameТест"
							value={username}
							onChange={handleInput}
						/>
						<Input
							name="password"
							label="Password"
							type="password"
							value={password}
							onChange={handleInput}
						/>
						{isRegistration && (
							<Input
								name="confirmPassword"
								label="Confirm your password"
								type="password"
								value={confirmPassword}
								onChange={handleInput}
							/>
						)}
						<Button
							onClick={() => auth({ username, password })}
						>
							<h2>{isRegistration ? 'REGISTER' : 'LOGIN'}</h2>
						</Button>
					</AuthWrapper>
					{error && <Alert>{error}</Alert>}
				</Col>
			</Row>
		);
	}
}