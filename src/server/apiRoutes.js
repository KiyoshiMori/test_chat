const database = require('./db');

export default (server, pubsub) => {
	server.get('/messages', async (req, res) => {
		const { from, to } = req.query;

		console.log({ from, to });

		try {
			const response = await database('messages_info')
				.where({
					messagefrom: +from,
					messageto: +to
				})
				.orWhere({
					messagefrom: +to,
					messageto: +from
				})
				.orderByRaw('date, time ASC')
				.select();

			// console.log({ response });

			return res.json({ response });
		} catch (e) {
			console.log({ ERROR: e });

			return res.json({ error: e });
		}
	});

	server.post('/messages', (req, res) => {
		const {text, time, date, from, to} = req.body;

		database('messages_info')
			.insert({
				text,
				time,
				date,
				messagefrom: from,
				messageto: to
			})
			.then(() => {
				pubsub.publish('newMessage', {
					text,
					time,
					date,
					messagefrom: from,
					messageto: to
				});

				return res.json({ response: { status: 'SUCCESS' } });
			})
			.catch(e => res.json({ error: e }));
	});
}