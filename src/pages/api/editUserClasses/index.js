import { createRouter } from "next-connect";
// import knex from "../../../../knex/knex";
import { getServerSession } from "next-auth/next"; // Import session function
import onError from "../../../lib/middleware";
import UserClasses from "../../../../models/UserClasses";
import { authOptions } from "../auth/[...nextauth]"; // Import auth options

const router = createRouter();

router
  .get(async (req, res) => {
    const session = await getServerSession(req, res, authOptions); // Get session

    if (session) {
      // If session exists
      const userClasses = await UserClasses.query()
        .where({ userEmail: req.query.userEmail })
        .throwIfNotFound();

      res.status(200).json(userClasses); // Send user classes as JSON
    } else {
      res.status(403).end("You must be signed in to access this endpoint.");
    }
  })
  .put(async (req, res) => {
    const session = await getServerSession(req, res, authOptions); // Get session

    if (session) {
      // If session exists
      const { newClasses } = req.body;

      const userClasses = await Promise.all(
        newClasses.map((entry) => UserClasses.query().insertAndFetch(entry)),
      );

      res.status(201).json(userClasses); // Send newly added classes as JSON
    } else {
      res.status(403).end("You must be signed in to access this endpoint.");
    }
  })
  .post(async (req, res) => {
    const session = await getServerSession(req, res, authOptions); // Get session

    if (session) {
      // If session exists
      const { classNumber, userEmail, completionStatus } = req.body;

      const userClasses = await UserClasses.query()
        .where({ classNumber, userEmail })
        .update({ classNumber, userEmail, completionStatus })
        .returning("*");

      res.status(200).json(userClasses); // Send updated user class as JSON
    } else {
      res.status(403).end("You must be signed in to access this endpoint.");
    }
  })
  .delete(async (req, res) => {
    const session = await getServerSession(req, res, authOptions); // Get session

    if (session) {
      // If session exists
      const { classNumber, userEmail } = req.query;

      // Delete class entry for the user based on classNumber and userEmail
      const deletedClasses = await UserClasses.query()
        .where({ classNumber, userEmail })
        .del()
        .returning("*");

      if (deletedClasses.length > 0) {
        res.status(200).json({
          message: "Class entry deleted successfully",
          deletedClasses,
        });
      } else {
        res.status(404).json({ message: "Class entry not found" });
      }
    } else {
      res.status(403).end("You must be signed in to access this endpoint.");
    }
  });

export default router.handler({ onError });
