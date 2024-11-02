import styles from "../styles/ProfilePage.module.css";
import ProfileComponent from "../../components/ProfileComponent";

export default function ProfilePage() {
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
            <p>Short bio goes here...</p>
          </div>
          <div className={styles.projectInterests}>
            <div className={styles.sectionHeader}>
              <h3>Project Interests:</h3>
              <button type="button" className={styles.editButton}>
                Edit
              </button>
            </div>
            <p>Interests go here...</p>
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
              <li>Class 1</li>
              <li>Class 2</li>
            </ul>
          </div>
          <div className={styles.pastPartners}>
            <div className={styles.sectionHeader}>
              <h3>Past Partners:</h3>
              <button type="button" className={styles.editButton}>
                Edit
              </button>
            </div>
            <ul>
              <li>Partner 1</li>
              <li>Partner 2</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
