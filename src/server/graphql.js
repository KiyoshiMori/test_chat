import { graphqlExpress } from 'apollo-server-express';
import expressPlayground from 'graphql-playground-middleware-express';
import db from './db';

export default (server, schema, pubsub) => {
	server.use('/graphql',
		graphqlExpress((req, res)=> ({
			schema,
			context: { user: req.user, pubsub, req, res, db }
		}))
	);
	server.use('/playground', expressPlayground ({
		endpointURL: '/graphql',
		subscriptionsEndpoint: `ws://${process.env.HOST}:${process.env.PORT_WS}/subscriptions`
	}));
}