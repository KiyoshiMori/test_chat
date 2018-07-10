import React, { PureComponent } from 'react';
import styled from 'Styled';

import { Row, Col } from 'Components/Grid';
import Input from 'Components/Input';
import Button from 'Components/Button';

const AuthWrapper = styled.div`
	display: flex;
	flex-direction: column;
	background-color: ${props => props.theme.colors.secondary};
	box-shadow: ${props => props.theme.shadow};
	border-radius: 30px;
	max-height: 250px;
	height: 100%;
	width: 100%;
	justify-content: center;
	align-items: center;
`;

export default class AuthBLock extends PureComponent {
	render() {
		return (
			<Row centered verticalCentered height="calc(100% - 150px)">
				<Col size={3} margin="0 0 150px">
					<AuthWrapper>
						<Input label="Username" />
						<Input label="Password" type="password" />
						<Button>
							<h2>LOGIN</h2>
						</Button>
					</AuthWrapper>
				</Col>
			</Row>
		);
	}
}