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
		error: '#e53935',
		errorDark: '#ab000d',
	},
	shadow: '0 0 20px rgba(0, 0, 0, 0.35)',
};

export { media };
export default theme;
