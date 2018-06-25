module.exports = {
	development: {
		client: "pg",
		connection: {
			user: process.env.DB_USER,
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			database: process.env.DB_NAME,
			password: process.env.DB_PASSWORD
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "knex_migrations"
		}
	}
};