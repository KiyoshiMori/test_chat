import ApolloClient from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from "apollo-cache-inmemory";
import { getMainDefinition } from 'apollo-utilities'
import {SubscriptionClient } from 'subscriptions-transport-ws'

let link = null;

if (process.browser) {
	const wsClient = new SubscriptionClient(`ws://localhost:7070/subscriptions`, {
		reconnect: true,
	});

	console.log(wsClient.status);

	link = split(
		({ query }) => {
			const { kind, operation } = getMainDefinition(query)
			return kind === 'OperationDefinition' && operation === 'subscription'
		},
		new WebSocketLink({
			uri: 'ws://localhost:7070/subscriptions',
			options: {
				reconnect: true,
			}
		}),
		new createHttpLink({ uri: 'http://localhost:8081/graphql' }),
	);
} else {
	link = new createHttpLink({ uri: 'http://localhost:8081/graphql' });
}

console.log({ browser: process.browser });

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
	ssrMode: !process.browser,
});

export { client };

