import { graphqlExpress } from 'apollo-server-express';
import expressPlayground from 'graphql-playground-middleware-express';
import db from './db';

export default (server, schema, pubsub) => {
	server.use(
		'/graphql',
		graphqlExpress((req, res) => ({
			schema,
			context: {
				user: req.user,
				pubsub,
				req,
				res,
				db,
			},
			debug: true,
		})),
	);
	server.use(
		'/playground',
		expressPlayground({
			endpointURL: '/graphql',
			subscriptionsEndpoint:
				`${process.env.PROTOCOL_WS}://${process.env.HOST}:${process.env.PORT_WS_CLIENT}/subscriptions`,
		}),
	);
};
