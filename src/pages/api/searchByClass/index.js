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
  if (usersEmails) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < usersEmails.length; i++) {
      uniqueEmails.add(usersEmails[i][0].userEmail);
    }
    users = await Promise.all(
      Array.from(uniqueEmails).map((email) => User.query().where({ email })),
    );
  }
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).end(`users with the mentioned classes not found`);
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
