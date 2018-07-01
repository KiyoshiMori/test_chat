import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'Styled';
import { media } from 'Styled/theme';

const singleColWidth = 100 / 12;

const Col = styled.div`
	${(props) => {
		const width = size => `${singleColWidth * (size || props.size)}%`;
		console.log({ props, test: width(props.sizeMd), test2: media.mobile`width: ${'50'}%;`, test3: `width: 5${'50'}%` });

		const widthh = `width: ${50}%`;
		console.log({ widthh });
		const test = css`
			width: ${width(props.size)};
			padding: 0 20px;
			flex: 0 1 auto;
			text-align: ${props.centered && 'center'};
			${media.mobile(`
				width: ${width(props.sizeMd)};
			`)}
		`;
		console.log(test);
		return test;
	}}
`;

const sizeType = PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
Col.propTypes = {
	size: sizeType,
	sizeMd: sizeType,
	centered: PropTypes.bool,
};

Col.defaultProps = {
	size: 12,
	sizeMd: 12,
	centered: false,
};

export default Col;
