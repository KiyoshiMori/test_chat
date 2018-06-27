import { graphqlExpress } from 'apollo-server-express';
import cors from 'cors';
import expressPlayground from 'graphql-playground-middleware-express';

export default (server, schema, pubsub) => {
	server.use('*', cors({ origin: 'http://localhost:8081', credentials: true }));
	server.use('/graphql',
		(req, res, next) => {
			console.log('GRAPHQL USER', req.user, res.locals.user);

			if (!req.user) {
				// res.json('You are not authorized!')
			}

			next();
		},
		graphqlExpress(req => ({
			schema,
			context: { user: req.user, pubsub }
		}))
	);
	server.use('/playground', expressPlayground ({
		endpointURL: '/graphql',
		subscriptionsEndpoint: 'ws://localhost:7070/subscriptions'
	}));
}