import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'Styled';
import { media } from 'Styled/theme';

const singleColWidth = 100 / 12;

const Col = styled.div`
	${(props) => {
		const width = size => `${singleColWidth * (size || props.size)}%`;

		return css`
			position: relative;
			width: ${width(props.size)};
			padding: 0 20px;
			margin: ${props => props.margin};
			flex: 0 1 auto;
			text-align: ${props.centered && 'center'};
			${media.mobile(`
				width: ${width(props.sizeMd)};
			`)}
		`;
	}}
`;

const sizeType = PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
Col.propTypes = {
	size: sizeType,
	sizeMd: sizeType,
	centered: PropTypes.bool,
	margin: PropTypes.oneOf(PropTypes.string, PropTypes.number),
};

Col.defaultProps = {
	size: 12,
	sizeMd: 12,
	centered: false,
	margin: 0,
};

export default Col;
