import styled from 'Styled';

const Canvas = styled.div`
	width: 100%;
	min-height: 100vh;
	position: relative;
	display: flex;
	flex-direction: column;
	background-color: ${props => props.theme.colors.primary};
`;

export default Canvas;
