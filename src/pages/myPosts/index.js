import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Post from "../../../components/Post";
import styles from "../../styles/Feed.module.css";
import NavigationBarButton from "../../../components/NavigationBarButton";

export default function Feed() {
  const { data: session } = useSession({ required: true });
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (posts.length < 1 && session) {
      fetch(`/api/posts?email=${session.user.email}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setPosts(data.reverse());
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error("Fetch error:", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, session]);
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div styles={{ display: "absolute", left: "0" }}>
        <NavigationBarButton />
      </div>
      <div className={styles.pageSpacing}>
        <h1
          className={styles.pageTitle}
          style={{ fontFamily: "sans-serif", fontSize: "2em" }}
        >
          My Posts
        </h1>
        {posts.map((post) => (
          <li key={post.id} style={{ listStyle: "none", width: "90%" }}>
            <Post
              title={post.title}
              content={post.content}
              creator={post.creator}
              edited={post.edited}
              edit
              id={post.id}
            />
          </li>
        ))}
      </div>
    </div>
  );
}
