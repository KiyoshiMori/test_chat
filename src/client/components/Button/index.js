import React from 'react';
import PropTypes from 'prop-types';
import styled, { media } from 'Styled';

const Button = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: ${props => props.autoWidth ? 'auto' : '150px'};
	height: 45px;
	margin: ${props => props.noMargin ? '0 0' : '0 115px'};
	background-color: ${props => !props.noBg && props.theme.colors.primary};
	box-shadow: ${props => !props.noBg && props.theme.shadow};
	border-radius: 15px;
	font-size: 12px;
	color: ${props => props.theme.colors.font};
	cursor: pointer;
	${media.mobile(`
		margin: 0;
	`)}
	&:active {
		background-color: ${props => !props.noBg && props.theme.colors.dark};
	}
	> * {
		&::selection {
			background: transparent;
		}
	}
`;

const ButtonComponent = ({ children, onClick, ...rest }) => (
	<Button onClick={onClick} {...rest}>
		{children}
	</Button>
);

Button.propTypes = {
	noMargin: PropTypes.bool,
	noBg: PropTypes.bool,
	autoWidth: PropTypes.bool,
};

Button.defaultProps = {
	noMargin: false,
	noBg: false,
	autoWidth: false,
};

ButtonComponent.propTypes = {
	children: PropTypes.any,
	onClick: PropTypes.func,
};

ButtonComponent.defaultProps = {
	children: null,
	onClick: () => console.log('clicked'),
};

export default ButtonComponent;
