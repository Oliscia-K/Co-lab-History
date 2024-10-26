import { createRouter } from "next-connect";
import knex from "../../../../../../knex/knex";
import onError from "../../../../../lib/middleware";

const router = createRouter();

router.get(async (req, res) => {
  const user = await knex("User").where({ id: req.query.id }).first();
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).end(`user with id ${req.query.id} not found`);
  }
});

export default router.handler({ onError });
