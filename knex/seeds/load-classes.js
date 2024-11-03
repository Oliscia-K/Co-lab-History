/* eslint-disable func-names */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
const fs = require("fs");

exports.seed = function (knex) {
  const contents = fs.readFileSync("./data/cs-courses.json");
  const data = JSON.parse(contents);

  const serializedData = data.map((course) => ({
    ...course,
    prerequisites: JSON.stringify(course.prerequisites),
  }));

  // Deletes ALL existing entries
  // Use batch insert because we could have too many classes for simple insert
  return knex("Class")
    .del()
    .then(() => knex.batchInsert("Class", serializedData, 100));
};
