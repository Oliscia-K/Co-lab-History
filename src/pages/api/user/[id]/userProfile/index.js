import { createRouter } from "next-connect";
// import knex from "../../../../../../knex/knex";
import onError from "../../../../../lib/middleware";
import User from "../../../../../../models/User";

const router = createRouter();

router.get(async (req, res) => {
  const user = await User.query().findById(req.query.id).throwIfNotFound();
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).end(`user with id ${req.query.id} not found`);
  }
});

export default router.handler({ onError });

/* Example how to fetch user from this 
(but using the the vairable for the id number instead of one of course)
fetch('/api/user/1/userProfile')
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
