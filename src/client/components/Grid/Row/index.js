import styled from 'Styled';
import PropTypes from 'prop-types';

const Row = styled.div`
	width: 100%;
	height: ${props => props.height};
	max-width: 1200px;
	margin: 0 auto;
	display: flex;
	flex-wrap: wrap;
	justify-content: ${props => props.centered && 'center'};
	align-items: ${props => props.verticalCentered && 'center'};
`;

Row.propTypes = {
	centered: PropTypes.bool,
	verticalCentered: PropTypes.bool,
	height: PropTypes.string,
};

Row.defaultProps = {
	verticalCentered: false,
	centered: false,
	height: 'auto',
};

export default Row;
