import rp from 'request-promise';
import { withFilter } from 'graphql-subscriptions';
import moment from 'moment';

export default {
	Query: {
		async getMessages(_, { input }) {
			const msgres = await rp({
				uri: `http://localhost:8081/messages?from=${input.sender}&to=${input.receiver}`,
				json: true
			});

			return msgres.response;
		}
	},
	Mutation: {
		async sendMessage(_, { input }) {
			const { text, sender, receiver } = input;

			const res = await rp({
				method: 'post',
				uri: 'http://localhost:8081/messages',
				body: {
					text,
					from: sender,
					to: receiver,
					time: moment().format('HH:mm:ss'),
					date: moment().format('YYYY-MM-DD'),
				},
				json: true,
			});

			return res.response;
		},
		async isTyping(_, { input }, { pubsub }) {
			const { isTyping } = input;

			pubsub.publish('isTyping', input);
			return { isTyping };
		}
	},
	Subscription: {
		newMessage: {
			resolve: payload => payload,
			subscribe: withFilter(({ pubsub }) => pubsub.asyncIterator('newMessage'), (payload, variables) => {
				const { receiver, sender } = variables?.input;
				console.log({ receiver, sender, messagefrom: payload.messagefrom});
				return [receiver, sender].indexOf(payload.messagefrom) !== -1;
			})
		},
		isTypingSubscription: {
			resolve: payload => payload,
			subscribe: withFilter(({ pubsub }) => pubsub.asyncIterator('isTyping'), (payload, variables) => {
				const { from, to } = variables?.input;
				return (payload.sender === from) && (payload.receiver === to);
			})
		}
	}
}