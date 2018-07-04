import { css } from 'Styled';

const MediaSizes = {
	desktop: 1190,
	mobile: 760,
};

const media = Object.keys(MediaSizes).reduce((acc, label) => {
	acc[label] = params => css`
		@media only screen and (max-width: ${MediaSizes[label]}px) {
			${css`${params}`};
		}
	`;

	return acc;
}, {});

const theme = {
	colors: {
		primary: '#B2EBF2',
		secondary: '#4DD0E1',
		light: '#E0F7FA',
		dark: '#00838F',
		font: '#37474F',
	},
};

export { media };
export default theme;
