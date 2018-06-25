exports.up = function(knex, Promise) {
	knex.schema.hasTable(process.env.DB_NAME).then(exists => {
		if (!exists) {
			return knex.schema.createTable(process.env.DB_NAME, t => {
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
	return knex.schema.dropTableIfExists(process.env.DB_NAME);
};
