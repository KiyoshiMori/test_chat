import { makeExecutableSchema } from 'graphql-tools';
import _ from 'lodash';

import RootDefinition from './RootDefinition.gql';
import RootResolver from './RootResolver';

import MessagesDefinition from './messages/MessagesDefinition.gql';
import MessagesResolver from './messages/MessagesResolver';

export default makeExecutableSchema({
	typeDefs: [RootDefinition, MessagesDefinition],
	resolvers: _.merge({}, RootResolver, MessagesResolver),
});
