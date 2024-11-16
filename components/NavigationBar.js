import Image from "next/image";
import PropTypes from "prop-types";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import homeIcon from "../public/home_image.svg";
import profileIcon from "../public/profile_image.svg";
import styles from "../src/styles/Navigation.module.css";
import LoginWidget from "../src/components/LoginWidget";

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
        <LoginWidget />
        <li className={styles.sidebaritem}>
          <Link
            className={styles.button}
            // onClick={() => handleNav("/homepage")}
            href="/"
          >
            <Image className={styles.homeicon} src={homeIcon} alt="Home Icon" />
            <div className={styles.text}>Home</div>
          </Link>
        </li>
        <li className={styles.sidebaritem}>
          <Link
            className={styles.button}
            // onClick={() => handleNav("/")}
            href={`/user/${id}/userProfile`}
          >
            <Image
              className={styles.profileicon}
              src={profileIcon}
              alt="Profile Icon"
            />
            <div className={styles.text}>Profile</div>
          </Link>
        </li>
      </ul>
    </div>
  );
}

NavigationBar.propTypes = {
  isActive: PropTypes.bool.isRequired,
};
