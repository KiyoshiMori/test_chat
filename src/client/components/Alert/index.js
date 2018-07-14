import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'Styled';

const alertType = (type, colors, dark) => {
	switch(type) {
		case 'error':
			return dark ? colors?.errorDark : colors?.error;
		default:
			return 'white'
	}
};

const Alert = styled.div`
	background-color: ${props => alertType(props.type, props.theme.colors)};
	box-shadow: 0 0 10px ${props => alertType(props.type, props.theme.colors, true)};
	border-radius: 30px;
	display: flex;
	justify-content: center;
	padding: 10px 10px;
	margin: 20px 0;
	position: absolute;
	width: auto;
	min-width: 70%;
	left: 50%;
	transform: translate(-50%, 0);
`;

const AlertComponent = ({ children, type }) => (
	<Alert type={type}>
		{children}
	</Alert>
);

Alert.propTypes = {
};

Alert.defaultProps = {
};

AlertComponent.propTypes = {
	type: PropTypes.oneOf(['error'])
};

AlertComponent.defaultProps = {
	type: 'error'
};

export default AlertComponent;
