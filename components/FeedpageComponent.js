import { useEffect, useState } from "react";
import Post from "./Post";
import NavigationBarButton from "./NavigationBarButton";
import styles from "../src/styles/Feed.module.css";

export default function FeedpageComponent() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (posts.length < 1) {
      fetch("/api/posts")
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
  }, [posts]);
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div styles={{ display: "absolute", left: "0" }} data-testid="navbar">
        <NavigationBarButton />
      </div>
      <div className={styles.pageSpacing}>
        <div style={{ width: "80%", justifyItems: "left" }}>
          <h1
            className={styles.pageTitle}
            data-testid="feedHeader"
            style={{ fontFamily: "sans-serif" }}
          >
            Co-Lab History
          </h1>
        </div>

        {posts.map((post) => (
          <li key={post.id} style={{ listStyle: "none", width: "80%" }}>
            <Post
              title={post.title}
              content={post.content}
              creator={post.creator}
              edited={post.edited}
            />
          </li>
        ))}
      </div>
    </div>
  );
}
