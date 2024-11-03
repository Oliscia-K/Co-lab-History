import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/MainApp.module.css";

export default function MainApp() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleClick = (action) => {
    if (action === "edit") {
      router.push(`/editProfile/main`);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Section: Profile Picture and Name with Pronouns */}
      <div className={styles.topSection}>
        <div className={styles.profilePictureContainer}>
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              className={styles.profilePicture}
              width={80} // Specify width
              height={80} // Specify height
              layout="responsive" // Make it responsive
            />
          ) : (
            <div className={styles.placeholder}>Upload Image</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.uploadInput}
          />
        </div>
        <div className={styles.nameSection}>
          <strong>First Last</strong>{" "}
          <span className={styles.pronouns}>(pronouns)</span>
          <div className={styles.smallText}>Major, School Year</div>
          <button
            type="button"
            className={styles.editButton}
            onClick={() => handleClick("edit")}
          >
            Edit Basics
          </button>
        </div>
      </div>

      {/* Middle Section: Bio and Project Interests with Edit Buttons */}
      <div className={styles.middleSection}>
        <div className={styles.bio}>
          <div className={styles.sectionHeader}>
            <h3>Bio:</h3>
            <button
              type="button"
              className={styles.editButton}
              onClick={() => handleClick("edit")}
            >
              Edit
            </button>
          </div>
          <p>Short bio goes here...</p>
        </div>
        <div className={styles.projectInterests}>
          <div className={styles.sectionHeader}>
            <h3>Project Interests:</h3>
            <button
              type="button"
              className={styles.editButton}
              onClick={() => handleClick("edit")}
            >
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
  );
}
