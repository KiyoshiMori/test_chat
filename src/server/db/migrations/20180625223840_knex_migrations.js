exports.up = function(knex, Promise) {
	knex.schema.hasTable('message_info').then(exists => {
		if (!exists) {
			return knex.schema.createTable('messages_info', t => {
				t.increments("messageid").primary();
				t.integer("messageto").notNull();
				t.integer("messagefrom").notNull();
				t.string("text").notNull();
				t.time("time").notNull();
				t.date("date").notNull();
				t.bool("is_readed").notNull().default(false);
			});
		}
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('messages_info');
};
