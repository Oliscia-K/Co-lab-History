import { createRouter } from "next-connect";
import knex from "../../../../knex/knex";
import onError from "../../../lib/middleware";
// import User from "../../../../../../models/User";

const router = createRouter();

router
  .get(async (req, res) => {
    const user = await knex("User").where({ email: req.query.email }).first();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).end(`user with id ${req.query.id} not found`);
    }
  })
  .post(async (req, res) => {
    const {
      name,
      email,
      pronouns = "Not specified",
      major = "Undeclared",
      year = "Not specified",
      bio = "",
      interests = "",
      classes = [],
      partners = [],
      pic = [],
    } = req.body;
    const newUser = {
      name,
      email,
      pronouns,
      major,
      "grad-year": year,
      bio,
      interests,
      classes,
      partners,
      "profile-pic": pic,
    };

    const user = await knex("User").insert(newUser).returning("*");
    res.status(201).json(user);
  });

export default router.handler({ onError });

/* Example how to fetch user from this 
(but using the the vairable for the id number instead of one of course)
fetch('/api/login?email=okthornton@middlebury.edu')
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



Example how to post a user to this
Assumption is that the name and email from the user creation would be passed here; other areas will get a default value 
that is edited later

fetch('/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Evan Lin',
    email: 'elin@middlebury.edu'
  })
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Fetch error:', error));
*/
