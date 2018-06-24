import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
	uri: 'localhost:8080/graphql',
});

export { client };

