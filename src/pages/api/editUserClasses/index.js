import { createRouter } from "next-connect";
// import knex from "../../../../knex/knex";
import onError from "../../../lib/middleware";
import UserClasses from "../../../../models/UserClasses";

const router = createRouter();

router
  .get(async (req, res) => {
    const userClasses = await UserClasses.query()
      .where({ userEmail: req.query.userEmail })
      .throwIfNotFound();
    if (userClasses) {
      res.status(200).json(userClasses);
    } else {
      res.status(200).json([]);
    }
  })
  .put(async (req, res) => {
    /** classNumber,
        userEmail,
        completionStatus, */
    const { newClasses } = req.body;

    const userClasses = await Promise.all(
      newClasses.map((entry) => UserClasses.query().insertAndFetch(entry)),
    );
    res.status(201).json(userClasses);
  })
  .post(async (req, res) => {
    const { classNumber, userEmail, completionStatus } = req.body;
    const userClasses = await UserClasses.query()
      .where({ classNumber, userEmail })
      .update({ classNumber, userEmail, completionStatus })
      .returning("*");
    res.status(200).json(userClasses);
  });

export default router.handler({ onError });

/* How to get the classes of a specific user from userClasses table

fetch('/api/editUserClasses?userEmail=okthornton@middlebury.edu')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Fetch error:', error)); */

/* How to add entirely new class entry NOTE: THIS TAKES A LIST OF OBJECTS TO ADD

fetch('/api/editUserClasses', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        newClasses:[{
            classNumber: 301,
            userEmail: 'okthornton@middlebury.edu',
            completionStatus: 'completed'
        },
        {
            classNumber: 312,
            userEmail: 'okthornton@middlebury.edu',
            completionStatus: 'in progress'
        }]
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Fetch error:', error)); */

/* How to update existing class entry NOTE: THIS TAKES ONE UPDATE OBJECT AT A TIME

fetch('/api/editUserClasses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        classNumber: 312,
        userEmail: 'okthornton@middlebury.edu',
        completionStatus: 'completed',
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Fetch error:', error)); */
