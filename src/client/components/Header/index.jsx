import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'Styled';
import Button from 'Components/Button';
import { Menu } from 'styled-icons/material';

const Header = styled.div`
	display: flex;
	background-color: ${props => props.theme.colors.secondary};
	box-shadow: ${props => props.theme.shadow};
	padding: 0 45px;
	height: 80px;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 70px;
`;

const FlexWrapper = styled.div`
	${props => css`
		display: flex;
		width: 100%;
		flex: 1;
		align-items: center;
		justify-content: ${props.end ? 'flex-end' : 'flex-start'}
	`}
`;


class HeaderComponent extends PureComponent {
	state = {
		showSide: false,
	};

	render() {
		const { headerButtons } = this.props;

		const renderButtons = button => (
			<Button onClick={button.onClick}>
				<h2>{button.text}</h2>
			</Button>
		);

		return (
			<Fragment>
				<Header>
					<FlexWrapper>
						<Button noBg noMargin autoWidth>
							<Menu size={35} />
						</Button>
					</FlexWrapper>
					<FlexWrapper end>
						{headerButtons?.map(button => button != null && renderButtons(button))}
					</FlexWrapper>
				</Header>
			</Fragment>
		);
	}
};

FlexWrapper.propTypes = {
	end: PropTypes.bool,
};

FlexWrapper.defaultProps = {
	end: false,
};

export default HeaderComponent;
