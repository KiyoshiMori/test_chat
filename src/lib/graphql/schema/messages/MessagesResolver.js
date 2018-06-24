import rp from 'request-promise';
import { PubSub, withFilter } from 'graphql-subscriptions';
import moment from 'moment';

const pubsub = new PubSub();

export default {
	Query: {
		async getMessages(_, { input }) {
			const res = await rp({
				uri: `http://localhost:8081/messages?from=${input.sender}&to=${input.receiver}`,
				json: true
			});

			return res.response;
		}
	},
	Mutation: {
		async sendMessage(_, { input }) {
			const { text, sender, receiver } = input;

			const body = {
				text,
				messagefrom: sender,
				messageto: receiver,
				time: moment().format('HH:mm:ss'),
				date: moment().format('YYYY-MM-DD'),
			};

			const res = await rp({
				method: 'post',
				uri: 'http://localhost:8081/messages',
				body: {
					...body,
					from: sender,
					to: receiver
				},
				json: true,
			});

			pubsub.publish('newMessage', body);

			return res.response;
		}
	},
	Subscription: {
		newMessage: {
			resolve: payload => payload,
			subscribe: withFilter(() => pubsub.asyncIterator('newMessage'), (payload, variables) => {
				const { receiver, sender } = variables?.input;
				return [receiver, sender].indexOf(payload.messagefrom) !== -1;
			})
		}
	}
}