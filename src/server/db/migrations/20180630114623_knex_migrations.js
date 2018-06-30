exports.up = function(knex, Promise) {
	knex.schema.hasTable('users').then(exists => {
		if (!exists) {
			return knex.schema.createTable('users', t => {
				t.increments("id").primary().uniq();
				t.string("username").notNull().uniq();
				t.string("password").notNull();
				t.string("type").notNull().default('common');
			});
		}
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('users');
};
