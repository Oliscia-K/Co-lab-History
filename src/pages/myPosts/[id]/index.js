import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../../styles/EditPost.module.css";
import NavigationBarButton from "../../../../components/NavigationBarButton";

export default function EditPost() {
  useSession({ required: true });
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!post && id) {
      fetch(`/api/posts/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setPost(data);
          setTitle(data.title);
          setContent(data.content);
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error("Fetch error:", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alteredPost: {
          id: post.id,
          creator: post.creator,
          title,
          content,
          edited: new Date().toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(router.push("/"))
      // eslint-disable-next-line no-console
      .catch((error) => console.error("Fetch error:", error));
  };
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div style={{ position: "absolute", left: "0" }}>
        <NavigationBarButton />
      </div>
      <div style={{ width: "100%" }}>
        <form onSubmit={handleSubmit} className={styles.formStructure}>
          <label className={styles.titleInputLabel} htmlFor="title">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className={styles.titleInputContainer}
          />
          <label className={styles.contentInputLabel} htmlFor="content">
            Content:
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            className={styles.contentTextArea}
          />
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
