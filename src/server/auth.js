import db from './db';

export default (server) => {
	const passport = require('passport');
	const session = require('express-session');
	const KnexSessionStore = require('connect-session-knex')(session);

	const store = new KnexSessionStore({
		knex: db,
		tablename: 'sessions',
	});

	server.use(require('cookie-parser')());
	server.use(session({ secret: 'cat', store, saveUninitialized: true, resave: true }));
	server.use(passport.initialize());
	server.use(passport.session());

	server.get('/', (req, res, next) => {
		console.log('USER:', req.user);
		res.locals.user = req.user;
		next();
	});

	server.use('/login', (req, res, next) => {
		req.login({ id: 13 }, (err) => {
			console.log('user at login page', req.user);
			return res.redirect('/');
		});
	});

	passport.serializeUser((user, done) => {
		done(null, user)
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});
}