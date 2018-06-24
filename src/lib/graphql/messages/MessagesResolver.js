import rp from 'request-promise';

export default {
	Query: {
		async getMessages(_, { input }) {
			const res = await rp({
				uri: `http://localhost:8081/messages/`
			});

			return JSON.parse(res).response;
		}
	}
}