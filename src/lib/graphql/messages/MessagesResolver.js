import rp from 'request-promise';

export default {
	Query: {
		async getMessages(_, { input }) {
			const res = await rp({
				uri: `http://localhost:8081/messages?from=${input.sender}&to=${input.receiver}`
			});

			console.log(JSON.parse(res));

			return JSON.parse(res).response;
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
				},
				json: true,
			});

			console.log(res);

			return res.response;
		}
	}
}