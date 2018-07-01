import db from './db';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

export default (server) => {
	const passport = require('passport');
	const session = require('express-session');
	const KnexSessionStore = require('connect-session-knex')(session);

	const store = new KnexSessionStore({
		knex: db,
		tablename: 'sessions',
	});

	server.use(session({ secret: 'cat', store, saveUninitialized: true, resave: true }));
	server.use(passport.initialize());
	server.use(passport.session());

	server.get('*', (req, res, next) => {
		next();
	});

	const cookieExtractor = req => {
		let token = null;
		if (req && req.cookies) {
			token = req.cookies['jwt'];
		}
		return token;
	};

	passport.use(new JWTStrategy({
		jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromBodyField('jwt'), cookieExtractor]),
		secretOrKey: process.env.jwtsecret
	}, ({ username, password }, done) => {
		console.log({ username, password });
		db('users')
			.where({
				username
			})
			.then(info => {
				done(null, info[0]);
				return null;
			})
			.catch(e => {
				done(e);
				return null;
			});
	}));

	server.get('/test', passport.authenticate('jwt', { failureRedirect: '/' }), async (req, res, next) => {
		console.log('jwt user', req.user);
		next();
	});

	server.post('/signing', passport.authenticate('jwt'), (req, res, next) => {
		console.log('test');
		res.json({ loggined: true });
	});

	passport.serializeUser((user, done) => {
		return done(null, user.id)
	});

	passport.deserializeUser((id, done) => {
		return done(null, { id });
	});
}