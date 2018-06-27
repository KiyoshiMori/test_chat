import { makeExecutableSchema } from 'graphql-tools';
import _ from 'lodash';

import RootDefinition from './RootDefinition.gql';
import RootResolver from './RootResolver';

import MessagesDefinition from './messages/MessagesDefinition.gql';
import MessagesResolver from './messages/MessagesResolver';

import UserDefinition from './user/UserDefinition.gql';
import UserResolver from './user/UserResolver';

export default makeExecutableSchema({
	typeDefs: [RootDefinition, MessagesDefinition, UserDefinition],
	resolvers: _.merge({}, RootResolver, MessagesResolver, UserResolver),
});
//comment for update gql file12