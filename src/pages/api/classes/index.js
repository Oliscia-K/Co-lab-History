import { createRouter } from "next-connect";
import knex from "../../../../knex/knex";
import onError from "../../../lib/middleware";
// import User from "../../../../../../models/User";

const router = createRouter();

router.get(async (req, res) => {
  const classes = await knex("Class");
  if (classes) {
    res.status(200).json(classes);
  } else {
    res.status(404).end(`no classes found`);
  }
});

export default router.handler({ onError });

/* Example how to fetch classList from this 
fetch('/api/classes')
      .then ((response) => {
        if (!response.ok){
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
*/
