import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NavigationBarButton from "../../../components/NavigationBarButton";
import styles from "../../styles/EditPost.module.css";

export default function Create() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("/api/posts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPost: {
          creator: session.user.email,
          title: event.target.title.value,
          content: event.target.content.value,
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
      <div style={{ position: "absolute", left: "0" }} data-testid="navbar">
        <NavigationBarButton />
      </div>
      <div style={{ width: "100%" }}>
        <form
          onSubmit={handleSubmit}
          className={styles.formStructure}
          data-testid="form"
        >
          <label className={styles.titleInputLabel} htmlFor="title">
            Title:
          </label>
          <input
            type="text"
            data-testid="titleBox"
            id="title"
            name="title"
            required
            className={styles.titleInputContainer}
          />
          <label className={styles.contentInputLabel} htmlFor="content">
            Content:
          </label>
          <textarea
            id="content"
            data-testid="contentBox"
            name="content"
            required
            className={styles.contentTextArea}
          />
          <button className={styles.submitButton} type="submit">
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}
