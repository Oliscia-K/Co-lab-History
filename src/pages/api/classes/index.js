import { createRouter } from "next-connect";
// import knex from "../../../../knex/knex";
import { getServerSession } from "next-auth/next";
import onError from "../../../lib/middleware";
import Class from "../../../../models/Class";
import { authOptions } from "../auth/[...nextauth]";

const router = createRouter();

router.get(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const classes = await Class.query();
    if (classes) {
      res.status(200).json(classes);
    } else {
      res.status(404).end(`no classes found`);
    }
  } else {
    res.status(403).end("You must be signed in to access this endpoint.");
  }
});

export default router.handler({ onError });
