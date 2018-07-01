import jwt from 'jsonwebtoken';
import rp from 'request-promise';
import { hashPassword, verifyPassword } from '../../../helpers/passwordHash';

export default {
	Query: {
		async getMyInfo(_, input, { user }) {
			if (!user) return { authorized: false };
			return {
				...user,
				authorized: true
			};
		}
	},
	Mutation: {
		async login(_, { input }, { req, res, db }) {
			const { username, password } = input;

			const passwordHash = await hashPassword(password);
			const token = jwt.sign({username, password: passwordHash}, process.env.jwtsecret);

			const dbpromise = await db('users')
				.where({
					username
				})
				.returning(['id', 'password'])
				.then(async (i) => {
					const info = i[0];
					const verified = await verifyPassword(password, info.password);

					if (verified) {
						const { id } = info;
						res.cookie('jwt', token);
						return await new Promise((resolve, reject) => {
							const login = response => {
								resolve(response);
							};

							req.login({ id }, async (err) => {
								if (err) {
									console.log('some kind of error');
									login({ error: 'some kind of error' });
								}

								await rp({
									uri: `${req.protocol}://${process.env.HOST}:${process.env.PORT}/signing`,
									method: 'post',
									body: { jwt: token },
									json: true
								});

								login({ token });
							});

						})
					} else {
						console.log('password is invalid');
						return Promise.resolve({ error: `username or password is invalid` });
					}
				})
				.catch(e => {
					console.log('username not found', e);
					return Promise.resolve({ error: 'username or password is invalid' });
				});

			console.log({ dbpromise, user: req.user, session: req.session });

			return dbpromise
		},
		async signup(_, { input }, { req, res, db }) {
			const { username, password } = input;

			const passwordHash = await hashPassword(password);

			const token = jwt.sign({username, password: passwordHash}, process.env.jwtsecret);

			await db('users')
				.insert({
					username,
					password: passwordHash,
					type: 'common'
				})
				.returning(['*'])
				.then(async info => {
					const { id } = info[0];

					return await req.login({ id }, (err) => {
						if (err) {
							console.log({ err });
							return { error: 'some kind of error' }
						}

						res.cookie('jwt', token, { httpOnly: true });
						return { token }
					});
				})
				.catch(e => {
					console.log(e);
					return { error: e }
				});

			return { token };
		}
	}
}