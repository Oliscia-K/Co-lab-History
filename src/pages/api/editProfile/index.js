import { createRouter } from "next-connect";
// import knex from "../../../../knex/knex";
import onError from "../../../lib/middleware";
import User from "../../../../models/User";

const router = createRouter();

router.put(async (req, res) => {
  const {
    id,
    classes,
    partners,
    "profile-pic": profilePic,
    ...userData
  } = req.body;

  // Ensure JSON serialization
  const serializedData = {
    ...userData,
    classes,
    partners,
    "profile-pic": profilePic,
  };
  try {
    const user = await User.query().updateAndFetchById(id, serializedData);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router.handler({ onError });

/* Example of how I updated Evan's profile 

fetch('/api/editProfile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: 2,
    name: 'Evan Lin',
    email: 'elin@middlebury.edu',
    pronouns: "Not specified",
    major: "Computer Science",
    "grad-year": "2026",
    "profile-pic": [],
    bio: "Hi, sorry I'm just putting something random for testing purposes",
    interests: "",
    classes: [
      {
        "name": "CSCI 318",
        "status": "in progress"
      }
    ],
    partners: [
      {
        "name": "Oliscia Thornton",
        "email": "okthornton@middlebury.edu"
      },
      {
        "name": "Seunghwan Oh",
        "email": "seunghwano@middlebury.edu"
      }
    ]

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
