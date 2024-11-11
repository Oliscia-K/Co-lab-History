/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import Link from "next/link";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import styles from "../../../../styles/ProfilePage.module.css";
import ProfileComponent from "../../../../../components/ProfileComponent";
import LoginWidget from "../../../../components/LoginWidget";

export default function UserProfile({ currentUser, setCurrentUser }) {
  const { data: session } = useSession({ required: true });

  if (session && currentUser === undefined) {
    fetch(`/api/login?email=${session.user.email}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        setCurrentUser(result[0]);
      })
      .catch((error) => console.log(error));
  }
  return (
    <>
      <LoginWidget />
      <ProfileComponent size="large" user={currentUser} />
      <div className={styles.container}>
        {/* Middle Section: Bio and Project Interests with Edit Buttons */}
        <div className={styles.middleSection}>
          <div className={styles.bio}>
            <div className={styles.sectionHeader}>
              <h3>Bio:</h3>
              {/* <button type="button" className={styles.editButton}>
                Edit
              </button> */}

              <Link href="/editProfile/main/" className={styles.editButton}>
                Edit
              </Link>
            </div>
            <p>{currentUser ? currentUser.bio : "Loading bio..."}</p>{" "}
            {/* Display bio from currentUser */}
          </div>
          <div className={styles.projectInterests}>
            <div className={styles.sectionHeader}>
              <h3>Project Interests:</h3>
              {/* <button type="button" className={styles.editButton}>
                Edit
              </button> */}
              <Link href="/editProfile/main/" className={styles.editButton}>
                Edit
              </Link>
            </div>
            <p>
              {currentUser ? currentUser.interests : "Loading interests..."}
            </p>{" "}
            {/* Display projectInterests */}
          </div>
        </div>

        {/* Bottom Section: Classes and Past Partners with Edit Buttons */}
        <div className={styles.bottomSection}>
          <div className={styles.classes}>
            <div className={styles.sectionHeader}>
              <h3>Classes:</h3>
              {/* <button type="button" className={styles.editButton}>
                Edit
              </button> */}
              <Link href="/editProfile/classes/" className={styles.editButton}>
                Edit
              </Link>
            </div>
            <ul>
              {currentUser ? (
                currentUser.classes.map((classItem) => (
                  <li key={classItem.id}>{classItem.name}</li>
                ))
              ) : (
                <li>Loading classes...</li>
              )}
            </ul>
          </div>
          <div className={styles.partner}>
            <div className={styles.sectionHeader}>
              <h3>Past Partners:</h3>
              {/* <button type="button" className={styles.editButton}>
                Edit
              </button> */}
              <Link href="/editProfile/partners/" className={styles.editButton}>
                Edit
              </Link>
            </div>
            <ul>
              {currentUser ? (
                currentUser.partners.map((partner) => (
                  <li key={partner.id}>
                    <a href={`mailto:${partner.email}`}>{partner.name}</a>
                  </li>
                ))
              ) : (
                <li>Loading partners...</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

UserProfile.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    pronouns: PropTypes.string,
    major: PropTypes.string,
    "grad-year": PropTypes.string,
    "profile-pic": PropTypes.arrayOf(PropTypes.number),
    bio: PropTypes.string,
    interests: PropTypes.string,
    classes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        status: PropTypes.string,
      }),
    ),
    partners: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
      }),
    ),
  }),
  setCurrentUser: PropTypes.func,
};
