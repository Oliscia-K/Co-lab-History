import { createRouter } from "next-connect";
import knex from "../../../../knex/knex";
import onError from "../../../lib/middleware";

const router = createRouter();

router.get(async (req, res) => {
  // we query by class year, major, and name
  let users;
  if (req.query.name) {
    users = await knex("User").where(
      "name",
      "like",
      `%${req.query.name[0].toUpperCase()}%`,
    );
  } else {
    users = await knex("User");
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
fetch("/api/homepage?name=Oliscia%20Thornton")
   .then(resp => resp.json())
   .then(data => { console.log(data); })
   .catch((error) => console.log(error));
*/
