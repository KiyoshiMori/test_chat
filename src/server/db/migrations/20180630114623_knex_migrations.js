exports.up = function (knex) {
	knex.schema.hasTable('users').then((exists) => {
		if (!exists) {
			return knex.schema.createTable('users', (t) => {
				t.increments('id').primary();
				t.string('username').notNull();
				t.string('password').notNull();
				t.string('type').notNull().default('common');
				t.unique(['username']);
			});
		}
		return null;
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('users');
};
