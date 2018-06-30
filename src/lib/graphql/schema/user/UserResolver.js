import jwt from 'jsonwebtoken';
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

			await db('users')
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
						return await req.login({ id }, (err) => {
							if (err) {
								console.log('some kind of error');
								return { error: 'some kind of error' }
							}

							console.log('should be', id);

							return { token }
						});
					} else {
						console.log('password is invalid');
						return { error: 'username or password is invalid' }
					}
				})
				.catch(() => {
					console.log('username not found');
					return { error: 'username or password is invalid'}
				});

			return { token }
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