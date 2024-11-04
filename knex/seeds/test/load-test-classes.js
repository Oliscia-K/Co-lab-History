/* eslint-disable func-names */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
const fs = require("fs");

exports.seed = function (knex) {
  const contents = fs.readFileSync("./data/classes-test-data.json");
  const data = JSON.parse(contents);
  // Deletes ALL existing entries and reset the id count. Then use insert.
  const { client } = knex.client.config;
  if (client === "pg") {
    return knex
      .raw('ALTER SEQUENCE "Class_id_seq" RESTART WITH 1')
      .then(() => knex("Class").del())
      .then(() => knex.batchInsert("Class", data, 100));
  }
  return knex("sqlite_sequence")
    .where("name", "=", "Class")
    .update({ seq: 0 })
    .then(() => knex("Class").del())
    .then(() => knex.batchInsert("Class", data, 100));
};
