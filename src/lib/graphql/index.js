import ApolloClient from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from "apollo-cache-inmemory";
import { getMainDefinition } from 'apollo-utilities'
import {SubscriptionClient } from 'subscriptions-transport-ws'

let link = null;

if (process.browser) {
	console.log({ env: process.env });

	const wsClient = new SubscriptionClient(`ws://${process.env.HOST}:${process.env.PORT_WS}/subscriptions`, {
		reconnect: true,
	});

	console.log(wsClient.status);

	link = split(
		({ query }) => {
			const { kind, operation } = getMainDefinition(query);
			return kind === 'OperationDefinition' && operation === 'subscription'
		},
		new WebSocketLink({
			uri: `ws://${process.env.HOST}:${process.env.PORT_WS}/subscriptions`,
			options: {
				reconnect: true,
			}
		}),
		new createHttpLink({ uri: `http://${process.env.HOST}:${process.env.PORT_SERVER}/graphql` }),
	);
} else {
	link = new createHttpLink({ uri: `http://${process.env.HOST}:${process.env.PORT_SERVER}/graphql` });
}

console.log({ browser: process.browser });

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
	ssrMode: !process.browser,
});

export { client };

