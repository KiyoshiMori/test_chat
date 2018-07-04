exports.up = function (knex) {
	knex.schema.hasTable('message_info').then((exists) => {
		if (!exists) {
			return knex.schema.createTable('messages_info', (t) => {
				t.increments('messageid').primary();
				t.integer('messageto').notNull();
				t.integer('messagefrom').notNull();
				t.string('text').notNull();
				t.time('time').notNull();
				t.date('date').notNull();
				t.bool('is_readed').notNull().default(false);
			});
		}
		return null;
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('messages_info');
};
