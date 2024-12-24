/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../src/styles/Post.module.css";

export default function Post({
  title,
  content,
  creator,
  edited,
  edit = false,
  id = null,
}) {
  const [user, setUser] = useState();
  const [profilePicture, setProfilePicture] = useState();
  const router = useRouter();

  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
    return initials || "N/A";
  };

  const renderProfilePicture = () => {
    if (profilePicture) {
      return (
        <Link href={`/user/${user?.id}/userProfile`}>
          <img
            src={profilePicture}
            alt="Profile"
            className={styles.profilePicture}
          />
        </Link>
      );
    }
    return (
      <div className={styles.initialsCircle}>
        <Link
          style={{ textDecoration: "none", color: "#666" }}
          href={`/user/${user?.id}/userProfile`}
        >
          {getInitials(user?.name || "Your Name")}
        </Link>
      </div>
    );
  };

  useEffect(() => {
    if (!user) {
      fetch(`/api/login?email=${creator}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setUser(data[0]);
          if (data[0]?.["profile-pic"]?.length > 0) {
            // if profile-pic is available in the user data (byte array), convert it to an image URL
            const imageURL = URL.createObjectURL(
              new Blob([new Uint8Array(data[0]["profile-pic"])]),
            );
            setProfilePicture(imageURL);
          }
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error("Fetch error:", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = () => {
    fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
    <div className={styles.postContainer}>
      <div className={styles.userNameContainer}>
        <div className={styles.profileImage}>
          {/* Render profile or initials */}
          {renderProfilePicture()}
        </div>
        <div className={styles.nameAndDateDisplay}>
          <Link
            href={`/user/${user?.id}/userProfile`}
            style={{
              textDecoration: "none",
              textAlign: "left",
              color: "black",
              paddingLeft: "10px",
            }}
          >
            {user?.name ?? "loading"}
          </Link>
        </div>
        {edit && (
          <div
            style={{
              width: "40%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Link
              href={`/myPosts/${id}`}
              style={{
                fontSize: "1em",
                textDecoration: "none",
                width: "80px",
                paddingLeft: "5px",
                textAlign: "center",
                color: "white",
                border: "none",
                borderRadius: "1vh",
                padding: "5px",
                background: "linear-gradient(#376DFE , #0ED7FE)",
                fontFamily: "sans-serif",
              }}
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={() => handleDelete()}
              style={{
                fontSize: "1em",
                textDecoration: "none",
                width: "90px",
                textAlign: "center",
                color: "white",
                border: "none",
                borderRadius: "1vh",
                padding: "5px",
                background: "linear-gradient(#376DFE , #0ED7FE)",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <p
        style={{
          textAlign: "left",
          fontWeight: "bold",
          fontSize: "1.35em",
          paddingLeft: "10px",
          paddingTop: 0,
          paddingBottom: "16px",
          margin: 0,
        }}
      >
        {title}
      </p>
      <p className={styles.postContent}>{content}</p>
      <p
        style={{
          margin: 0,
          paddingLeft: "10px",
          fontSize: ".8em",
          paddingBottom: "16px",
        }}
      >
        {edited}
      </p>
    </div>
  );
}

Post.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  creator: PropTypes.string,
  edited: PropTypes.string,
  edit: PropTypes.bool,
  id: PropTypes.number,
};
