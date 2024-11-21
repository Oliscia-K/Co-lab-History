import { createRouter } from "next-connect";
import onError from "../../../lib/middleware";
import Posts from "../../../../models/Post";

const router = createRouter();

router
  .get(async (req, res) => {
    const allPosts = await Posts.query();
    if (allPosts) {
      res.status(200).json(allPosts);
    } else {
      res.status(200).json([]);
    }
  })
  .put(async (req, res) => {
    const { newPost } = req.body;

    const post = await Posts.query().insertAndFetch(newPost);
    res.status(201).json(post);
  })
  .post(async (req, res) => {
    const { alteredClass } = req.body;
    const updatedPost = await Posts.query()
      .where({ id: alteredClass.id })
      .update({ ...alteredClass })
      .returning("*");
    res.status(200).json(updatedPost);
  });

export default router.handler({ onError });

/* How to get all posts from Posts table

fetch('/api/posts')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Fetch error:', error)); */

/* How to add entirely new post entry

fetch('/api/posts', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        newPost:{
            creator: "okthornton@middlebury.edu",
            title: "Senior Seminar Team?",
            content: "Looking for a team to work on the senior seminar project with!",
            edited: "2024-11-12T00:00:00.000Z"
        }
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

/* How to update existing post entry 

fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        alteredClass: {
            id: 5,
            creator: "okthornton@middlebury.edu",
            title: "Senior Seminar Team? (Edited)",
            content: "Currently looking for one more person to work on the senior seminar project with!",
            edited: "2024-11-18T00:00:00.000Z"
        }   
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
