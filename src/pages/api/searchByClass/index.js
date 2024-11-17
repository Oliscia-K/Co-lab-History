import { createRouter } from "next-connect";
// import knex from "../../../../../../knex/knex";
import onError from "../../../lib/middleware";
import UserClasses from "../../../../models/UserClasses";
import User from "../../../../models/User";

const router = createRouter();

router.post(async (req, res) => {
  let users;
  const { classes } = req.body;
  const usersEmails = await Promise.all(
    classes.map((classNumber) => UserClasses.query().where({ classNumber })),
  );
  const uniqueEmails = new Set();
  for (let i = 0; i < usersEmails.length; i += 1) {
    if (usersEmails[i].length > 0) {
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < usersEmails[i].length; j += 1) {
        uniqueEmails.add(usersEmails[i][j].userEmail);
      }
      // eslint-disable-next-line no-await-in-loop
      users = await Promise.all(
        Array.from(uniqueEmails).map((email) => User.query().where({ email })),
      );
    }
  }
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(200).json([]);
  }
});

export default router.handler({ onError });

/**
 
fetch('/api/searchByClass', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({classes: [201, 202]})
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
