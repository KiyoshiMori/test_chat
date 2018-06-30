import Promise from 'bluebird';
const crypto = Promise.promisifyAll(require('crypto'));
// import crypto from 'crypto';

const config = {
	hashBytes: 64,
	saltBytes: 16,
	iterations: 10000,
	algo: 'sha512',
	encoding: 'base64'
};

const hashPassword = password => {
	let salt = null;

	return crypto.randomBytesAsync(config.saltBytes)
		.then(vsalt => {
			salt = vsalt;
			return crypto.pbkdf2Async(password, salt, config.iterations, config.hashBytes, config.algo);
		})
		.then(hash => {
			const array = new ArrayBuffer(hash.length + salt.length + 8);
			let hashframe = Buffer.from(array);

			hashframe.writeUInt32BE(salt.length, 0, true);
			hashframe.writeUInt32BE(config.iterations, 4, true);
			salt.copy(hashframe, 8);
			hash.copy(hashframe, salt.length + 8);
			return hashframe.toString(config.encoding);
		})
};

const verifyPassword = async (password, hashedPassword) => {
	// let hashframe = await hashPassword(password);
	let hashframe = hashedPassword;
	hashframe = Buffer.from(hashframe, config.encoding);
	const saltBytes = hashframe.readUInt32BE(0);
	const hashBytes = hashframe.length - saltBytes - 8;
	const iterations = hashframe.readUInt32BE(4);
	const salt = hashframe.slice(8, saltBytes + 8);
	const hash = hashframe.slice(8 + saltBytes, saltBytes + hashBytes + 8);

	return crypto.pbkdf2Async(password, salt, iterations, hashBytes, config.algo)
		.then(verify => {
			if (verify.equals(hash)) return Promise.resolve(true);
			return Promise.resolve(false);
		})
};

export { verifyPassword, hashPassword }
