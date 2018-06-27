const knex = require('knex')(
	require('./knexfile')['development'] // process.env.NODE_ENV ||
);

module.exports = knex;
