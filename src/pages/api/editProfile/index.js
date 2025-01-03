/* eslint-disable no-console */
import { createRouter } from "next-connect";
import { getServerSession } from "next-auth/next"; // Import session function
import knex from "../../../../knex/knex";
import onError from "../../../lib/middleware";
import User from "../../../../models/User";
import { authOptions } from "../auth/[...nextauth]"; // Import auth options

const router = createRouter();

router.put(async (req, res) => {
  const session = await getServerSession(req, res, authOptions); // Get the session

  if (session) {
    // Check if the user is signed in
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
  } else {
    // If no session, return 403 Forbidden
    res.status(403).end("You must be signed in to access this endpoint.");
  }
});

// eslint-disable-next-line consistent-return
router.delete(async (req, res) => {
  const session = await getServerSession(req, res, authOptions); // Get the session

  if (session) {
    // Check if the user is signed in
    const { id, type, classToDelete, email } = req.body; // Get userId, type (class/partner), and related info from the request body

    try {
      // Fetch the user's profile
      const user = await knex("User")
        .where({ id })
        .select("partners", "classes")
        .first();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Handle the deletion of a class
      if (type === "class") {
        let { classes } = user;

        // If classes is a string (JSON serialized), parse it
        if (typeof classes === "string") {
          try {
            classes = JSON.parse(classes);
          } catch (error) {
            return res.status(500).json({ message: "Malformed classes data." });
          }
        }

        // If classes is not an array, it's either malformed or empty
        if (!Array.isArray(classes)) {
          return res.status(500).json({ message: "Malformed classes data." });
        }

        // Filter out the class by name
        const updatedClasses = classes.filter(
          (cls) => cls.name !== classToDelete,
        );

        // If no class was removed, return a 404 error
        if (classes.length === updatedClasses.length) {
          return res.status(404).json({ message: "Class not found" });
        }

        // Update the user's classes list in the database
        await knex("User")
          .where({ id })
          .update({
            classes: JSON.stringify(updatedClasses), // Save updated classes as a JSON string
          });

        return res.status(200).json({ message: "Class deleted successfully" });
      }

      // Handle the deletion of a partner
      if (type === "partner") {
        let { partners } = user;

        // If partners is a string (JSON serialized), parse it
        if (typeof partners === "string") {
          try {
            partners = JSON.parse(partners);
          } catch (error) {
            return res
              .status(500)
              .json({ message: "Malformed partners data." });
          }
        }

        // If partners is not an array, it's either malformed or empty
        if (!Array.isArray(partners)) {
          return res.status(500).json({ message: "Malformed partners data." });
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
        await knex("User")
          .where({ id })
          .update({
            partners: JSON.stringify(updatedPartners), // Save updated partners as a JSON string
          });

        return res
          .status(200)
          .json({ message: "Partner deleted successfully" });
      }

      // If no valid type is provided, return an error
      return res.status(400).json({ message: "Invalid type provided" });
    } catch (error) {
      console.error("Error deleting class or partner:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // If no session, return 403 Forbidden
    res.status(403).end("You must be signed in to access this endpoint.");
  }
});

export default router.handler({ onError });
