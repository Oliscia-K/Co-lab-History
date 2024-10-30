/* eslint-disable func-names */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
const fs = require("fs");

exports.seed = function (knex) {
  const contents = fs.readFileSync("./data/test-data.json");
  const data = JSON.parse(contents);
  // Deletes ALL existing entries and reset the id count. Then use insert.
  return knex("sqlite_sequence")
    .where("name", "=", "User")
    .update({ seq: 0 })
    .then(() => knex("User").del())
    .then(() => knex.batchInsert("User", data, 10));
};
