import { createRouter } from "next-connect";
import onError from "../../../../lib/middleware";
import Posts from "../../../../../models/Post";

const router = createRouter();

router
  .get(async (req, res) => {
    const allPosts = await Posts.query().where({ id: req.query.id });
    if (allPosts) {
      res.status(200).json(allPosts[0]);
    } else {
      res.status(200).json([]);
    }
  })
  .delete(async (req, res) => {
    await Posts.query().deleteById(req.query.id);
    res.status(204).end();
  });

export default router.handler({ onError });

/* How to get specific post by id (for editing purposes)
  fetch('/api/posts/13')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log(data))
      .catch(error => console.error('Fetch error:', error)); */
