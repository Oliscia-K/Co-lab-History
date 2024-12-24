/* eslint-disable no-console */
import Image from "next/image";
import PropTypes from "prop-types";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import homeIcon from "../public/home_image.svg";
import profileIcon from "../public/profile_image.svg";
import styles from "../src/styles/Navigation.module.css";
import LoginWidget from "../src/components/LoginWidget";
import feedImage from "../public/feed_image.svg";
import createPostImage from "../public/createPost_image.svg";
import searchImage from "../public/search_image.svg";

export default function NavigationBar({ isActive }) {
  const { data: session } = useSession();
  const [id, setId] = useState();
  useEffect(() => {
    if (!session) return;
    fetch(`/api/login?email=${session.user.email}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        // console.log(result);
        setId(result[0].id);
      })
      .catch((error) => console.log(error));
  }, [session]);
  return (
    <div className={`${styles.sidebar} ${isActive ? styles.open : ""}`}>
      <ul className={styles.sidebarelements}>
        <LoginWidget size="small" />
        <li className={styles.sidebaritem}>
          <Link
            className={styles.button}
            href="/"
            style={{ textDecoration: "none" }}
          >
            <Image className={styles.homeicon} src={homeIcon} alt="Home Icon" />
            <div className={styles.text}>Home</div>
          </Link>
        </li>
        <li className={styles.sidebaritem}>
          <a
            className={styles.button}
            href={`/user/${id}/userProfile`}
            style={{ textDecoration: "none" }}
          >
            <Image
              className={styles.profileicon}
              src={profileIcon}
              alt="Profile Icon"
            />
            <div className={styles.text}>Profile</div>
          </a>
        </li>
        <li className={styles.sidebaritem}>
          <Link
            className={styles.button}
            href="/search"
            style={{ textDecoration: "none" }}
          >
            <Image
              className={styles.homeicon}
              src={searchImage}
              alt="Feed Icon"
            />
            <div className={styles.text}>Search</div>
          </Link>
        </li>
        <li className={styles.sidebaritem}>
          <Link
            className={styles.button}
            href="/feed/create"
            style={{ textDecoration: "none" }}
          >
            <Image
              className={styles.homeicon}
              src={createPostImage}
              alt="Post Icon"
            />
            <div className={styles.text}>Post</div>
          </Link>
        </li>
        <li className={styles.sidebaritem}>
          <Link
            className={styles.button}
            href="/myPosts"
            style={{ textDecoration: "none" }}
          >
            <Image
              className={styles.homeicon}
              src={feedImage}
              alt="Feed Icon"
            />
            <div className={styles.text}>My Posts</div>
          </Link>
        </li>
      </ul>
    </div>
  );
}

NavigationBar.propTypes = {
  isActive: PropTypes.bool.isRequired,
};
