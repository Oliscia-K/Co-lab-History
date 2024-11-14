import { createRouter } from "next-connect";
import knex from "../../../../knex/knex";
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

// eslint-disable-next-line consistent-return
router.delete(async (req, res) => {
  const { id, email } = req.body; // Get the userId and partner email from the request body

  try {
    // Fetch the user's partners
    const user = await knex("User").where({ id }).select("partners").first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the 'partners' field is a string (i.e., serialized JSON), or if it's already an array
    let { partners } = user;

    // If partners is a string (JSON serialized), parse it
    if (typeof partners === "string") {
      partners = JSON.parse(partners || "[]");
    }
    // If partners is already an array, no need to parse it
    else if (!Array.isArray(partners)) {
      // This handles cases where the data is malformed. We can return an error or handle it as needed.
      return res
        .status(500)
        .json({ message: "Malformed partners data in database." });
    }

    // Filter out the partner by email
    const updatedPartners = partners.filter(
      (partner) => partner.email !== email,
    );

    // If no partner was removed, return a 404 error
    if (partners.length === updatedPartners.length) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // Update the user's partners list in the database
    const updatedUser = await knex("User")
      .where({ id })
      .update({
        partners: JSON.stringify(updatedPartners), // Save updated partners as a JSON string
      })
      .returning("*");

    if (updatedUser.length > 0) {
      res.status(200).json(updatedUser[0]);
    } else {
      res.status(500).json({ message: "Failed to update partners" });
    }
  } catch (error) {
    console.error("Error deleting partner:", error);
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
