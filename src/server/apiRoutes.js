require('dotenv').config();
import { PostgresPubSub } from "graphql-postgres-subscriptions";

export const pubsub = new PostgresPubSub({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD
});

const database = require('./db');

export default (server) => {
	server.get('/messages', async (req, res) => {
		const { from, to } = req.query;

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

			console.log({ response });

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