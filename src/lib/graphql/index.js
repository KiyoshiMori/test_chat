import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
	uri: 'localhost:8081/graphql',
});

export { client };

