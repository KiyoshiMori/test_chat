import gql from 'graphql-tag';

export const getMyInfo = gql`
	query {
		getMyInfo {
			id
			authorized
		}
	}
`;

export const signup = gql`
	mutation($username: String!, $password: String!) {
		signup(input: {username: $username, password: $password}) {
			token
			error
		}
	}
`;


export const login = gql`
	mutation($username: String!, $password: String!) {
		login(input: {username: $username, password: $password}) {
			token
			error
		}
	}
`;