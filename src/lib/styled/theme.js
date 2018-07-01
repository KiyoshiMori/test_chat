import { css } from 'Styled';

const MediaSizes = {
	desktop: 1190,
	mobile: 630,
};

const media = Object.keys(MediaSizes).reduce((acc, label) => {
	acc[label] = params => css`
		@media (max-width: ${MediaSizes[label]}px) {
			${css`${params}`};
		}
	`;

	return acc;
}, {});

export { media };
