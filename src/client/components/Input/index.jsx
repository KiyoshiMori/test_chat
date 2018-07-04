import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'Styled';

const Input = styled.input`
	color: ${props => props.theme.colors.font};
	caret-color: ${props => props.theme.colors.dark};
	background-color: ${props => props.theme.colors.light};
	box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.25);
	border-radius: 20px;
	border: 0;
	outline: 0;
	height: ${props => props.height};
	padding: 0 10px;
	margin-bottom: 25px;
	&:focus {
		box-shadow: ${props => `0 0 10px ${props.theme.colors.dark}`};
	}
`;

const Label = styled.p`
	position: relative;
	top: ${props => props.focused && '-3px'};
	margin: 0;
	padding: 0 15px;
	color: ${props => props.theme.colors.font};
`;

class InputComponent extends Component {
	state = {
		focused: false,
	};

	focus = () => (
		this.setState({ focused: true })
	);

	blur = () => (
		this.setState({ focused: false })
	);

	render() {
		const { label, ...props } = this.props;
		const { focused } = this.state;

		return (
			<div>
				{label && (
					<Label focused={focused}>
						{label}
					</Label>
				)}
				<Input
					{...props}
					onFocus={e => {
						this.focus();
					}}
					onBlur={e => {
						this.blur();
					}}
				/>
			</div>
		);
	}
}

Input.propTypes = {
	height: PropTypes.string,
};

Input.defaultProps = {
	height: '35px',
};

export default InputComponent;