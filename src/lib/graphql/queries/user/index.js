import gql from 'graphql-tag';

export const getMyInfo = gql`
	query {
		getMyInfo {
			id
			authorized
		}
	}
`;