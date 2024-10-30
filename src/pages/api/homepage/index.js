import { createRouter } from "next-connect";
import knex from "../../../../knex/knex";
import onError from "../../../lib/middleware";

const router = createRouter();

router.get(async (req, res) => {
  // we query by class year, major, and name
  let users;
  if (req.query.major && req.query.year && req.query.name) {
    users = await knex("User").where(
      { major: req.query.major, "grad-year": req.query.year },
      "name",
      "like",
      `%${req.query.name}%`,
    );
  } else if (req.query.year && req.query.name) {
    users = await knex("User").where(
      { "grad-year": req.query.year },
      "name",
      "like",
      `%${req.query.name}%`,
    );
  } else if (req.query.major && req.query.name) {
    users = await knex("User").where(
      { major: req.query.major },
      "name",
      "like",
      `%${req.query.name}%`,
    );
  } else if (req.query.major && req.query.year) {
    users = await knex("User").where({
      major: req.query.major,
      "grad-year": req.query.year,
    });
  } else if (req.query.major) {
    users = await knex("User").where({ major: req.query.major });
  } else if (req.query.year) {
    users = await knex("User").where({ "grad-year": req.query.year });
  } else if (req.query.name) {
    users = await knex("User").where("name", "like", `%${req.query.name}%`);
  }
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).end(`users not found`);
  }
});

export default router.handler({ onError });

/* Example how to fetch from this 
but using the variable of the major, year, and name when applicable (note: %20 stands for spaces and this code allows for the full name not to be specified)
fetch("/api/homepage?major=Computer%20Science&year=2026&name=Oliscia%20Thornton")
   .then(resp => resp.json())
   .then(data => { console.log(data); })
   .catch((error) => console.log(error));
*/
