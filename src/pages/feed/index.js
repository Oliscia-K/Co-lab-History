import { useEffect, useState } from "react";
import Post from "../../../components/Post";
import NavigationBarButton from "../../../components/NavigationBarButton";

export default function Feed() {
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
          console.log(data);
          setPosts(data);
        })
        .catch((error) => console.error("Fetch error:", error));
    }
  }, [posts]);
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div styles={{ display: "absolute", left: "0" }}>
        <NavigationBarButton />
      </div>
      <h1>Feed</h1>
      {posts.map((post) => (
        <li key={post.id}>
          <Post
            title={post.title}
            content={post.content}
            creator={post.creator}
            edited={post.edited}
          />
        </li>
      ))}
    </div>
  );
}
