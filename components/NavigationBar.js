import Image from "next/image";
import PropTypes from "prop-types";
import Link from "next/link";
import homeIcon from "../public/home_image.svg";
import profileIcon from "../public/profile_image.svg";
import styles from "../src/styles/Navigation.module.css";

export default function NavigationBar({ isActive }) {
  return (
    <div className={`${styles.sidebar} ${isActive ? styles.open : ""}`}>
      <ul className={styles.sidebarelements}>
        <li className={styles.sidebaritem}>
          <a
            className={styles.button}
            // onClick={() => handleNav("/homepage")}
            href="/"
            target="_blank"
          >
            <Image className={styles.homeicon} src={homeIcon} alt="Home Icon" />
            <div className={styles.text}>Home</div>
          </a>
        </li>
        <li className={styles.sidebaritem}>
          <Link
            className={styles.button}
            // onClick={() => handleNav("/")}
            href="/user/1/userProfile"
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
