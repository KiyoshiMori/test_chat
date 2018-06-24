import { makeExecutableSchema } from 'graphql-tools';
import _ from 'lodash';

import RootDefinition from './RootDefinition.gql';
import RootResolver from './RootResolver';

export default makeExecutableSchema({
	typeDefs: [RootDefinition],
	resolvers: _.merge({}, RootResolver),
});
