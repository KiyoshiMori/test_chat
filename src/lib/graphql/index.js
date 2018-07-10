import ApolloClient from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from "apollo-cache-inmemory";
import { getMainDefinition } from 'apollo-utilities'
import {SubscriptionClient } from 'subscriptions-transport-ws'

let link = null;
let preloadedState = null;

if (process.browser) {
	console.log({ env: process.env });

	const wsLink = `${process.env.PROTOCOL_WS}://${process.env.HOST}:${process.env.PORT_WS_CLIENT}/subscriptions`;

	const wsClient = new SubscriptionClient(wsLink, {
		reconnect: true,
	});

	console.log(wsClient.status);

	link = split(
		({ query }) => {
			const { kind, operation } = getMainDefinition(query);
			return kind === 'OperationDefinition' && operation === 'subscription';
		},
		new WebSocketLink({
			uri: wsLink,
			options: {
				reconnect: true,
			},
		}),
		new createHttpLink({
			uri: `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT_CLIENT}/graphql`,
			credentials: 'include',
		}),
	);

	preloadedState = window.__APOLLO_STATE__;

	const apolloState = document.getElementById('apollo-state');
	apolloState.parentElement.removeChild(apolloState);
	delete window.__APOLLO_STATE__;
} else {
	link = new createHttpLink({
		uri: `https://${process.env.HOST}:${process.env.PORT_CLIENT}/graphql`, credentials: 'include',
	});
}

console.log({ browser: process.browser });

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
	ssrMode: !process.browser,
	initialState: preloadedState,
	connectToDevTools: true,
});

export { client };
