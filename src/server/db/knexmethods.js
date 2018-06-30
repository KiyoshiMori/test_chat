import crypto from 'crypto';

const salt = crypto.randomBytes(128).toString('base64');

const checkPassowrd = (queryBuilder, username, password) => {
	const passwordHash = crypto.pbkdf2Sync(password, salt, 1, 128, 'sha1');
	queryBuilder.where({ username, password: passwordHash }).select('password')
		.then(password => password === passwordHash);
};

