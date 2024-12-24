/* eslint-disable func-names */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
const fs = require("fs");

exports.seed = function (knex) {
  const contents = fs.readFileSync("./data/posts.json");
  const data = JSON.parse(contents);
  // Deletes ALL existing entries and reset the id count. Then use insert.
  return knex("Posts")
    .del()
    .then(() => knex.batchInsert("Posts", data, 100));
};
