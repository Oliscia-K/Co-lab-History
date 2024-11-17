/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable("User-Classes", (table) => {
    table.increments("id").primary();
    table.integer("classNumber");
    table.string("userEmail");
    table.string("completionStatus");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("User-Classes");
};
