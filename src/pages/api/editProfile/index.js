import { createRouter } from "next-connect";
import knex from "../../../../knex/knex";
import onError from "../../../lib/middleware";

const router = createRouter();

router.post(async (req, res) => {
  const { id, ...userData } = req.body;

  const user = await knex("User").where({ id }).update(userData).returning("*");
  res.status(201).json(user);
});

export default router.handler({ onError });
