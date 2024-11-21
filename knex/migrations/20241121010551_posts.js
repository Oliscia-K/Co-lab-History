/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable("Posts", (table) => {
    table.increments("id").primary();
    table.string("title");
    table.string("content");
    table.string("creator");
    table.string("edited");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Posts");
};
