import { useState, useEffect } from "react";
import styles from "../../../../styles/ProfileComponent.module.css";
import ProfileComponent from "../../../../../components/ProfileComponent";

export default function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const userId = 1;

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
              <button type="button" className={styles.editButton}>
                Edit
              </button>
            </div>
            <p>{profileData ? profileData.bio : "Loading bio..."}</p>{" "}
            {/* Display bio from profileData */}
          </div>
          <div className={styles.projectInterests}>
            <div className={styles.sectionHeader}>
              <h3>Project Interests:</h3>
              <button type="button" className={styles.editButton}>
                Edit
              </button>
            </div>
            <p>
              {profileData
                ? profileData.projectInterests
                : "Loading interests..."}
            </p>{" "}
            {/* Display projectInterests */}
          </div>
        </div>

        {/* Bottom Section: Classes and Past Partners with Edit Buttons */}
        <div className={styles.bottomSection}>
          <div className={styles.classes}>
            <div className={styles.sectionHeader}>
              <h3>Classes:</h3>
              <button type="button" className={styles.editButton}>
                Edit
              </button>
            </div>
            <ul>
              {profileData ? (
                profileData.classes.map((classItem) => (
                  <li key={classItem.id}>{classItem.name}</li> // Changed `key` from `index` to `classItem.id`
                ))
              ) : (
                <li>Loading classes...</li>
              )}
            </ul>
          </div>
          <div className={styles.pastPartners}>
            <div className={styles.sectionHeader}>
              <h3>Past Partners:</h3>
              <a href="/editProfile/partners" target="_blank">
                Edit
              </a>
            </div>
            <ul>
              {profileData ? (
                profileData.pastPartners.map((partner) => (
                  <li key={partner.id}>{partner.name}</li> // Changed `key` from `index` to `partner.id`
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
