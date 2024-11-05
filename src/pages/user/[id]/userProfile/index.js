import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../../../styles/ProfilePage.module.css";
import ProfileComponent from "../../../../../components/ProfileComponent";

export default function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const userId = 28;

  useEffect(() => {
    // Fetch user data
    fetch(`/api/user/${userId}/userProfile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProfileData(data); // Set fetched data to profileData state
        console.log(data);
      })
      .catch((error) => console.log("Error fetching user profile:", error));
  }, [userId]);
  return (
    <>
      <ProfileComponent size="large" />
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
            <p>{profileData ? profileData.bio : "Loading bio..."}</p>{" "}
            {/* Display bio from profileData */}
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
              {profileData ? profileData.interests : "Loading interests..."}
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
              {profileData ? (
                profileData.classes.map((classItem) => (
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
              {profileData ? (
                profileData.partners.map((partner) => (
                  <li key={partner.id}>{partner.name}</li>
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
