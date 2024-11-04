import Image from "next/image";
import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../src/styles/ProfileComponent.module.css";
import ImageUploader from "./ImageUploader";

function ProfileComponent({ size = "large" }) {
  const isLarge = size === "large";

  // State for all the basics to be edited
  const [fullName] = useState("Your Name");
  const [pronouns] = useState("(they/them)");
  const [major] = useState("Your Major");
  const [year] = useState("Your Year");
  const [profilePicture, setProfilePicture] = useState(null);

  // Handle image upload
  const handleImageUpload = (binaryData) => {
    const blob = new Blob([binaryData]);
    const imageURL = URL.createObjectURL(blob);
    setProfilePicture(imageURL);
  };

  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
    return initials || "N/A";
  };

  const renderProfilePicture = () => {
    if (isLarge) {
      if (profilePicture) {
        return (
          <Image
            src={profilePicture}
            alt="Profile"
            className={styles.profilePicture} // large profile picture
          />
        );
      }
      return (
        <div className={styles.initialsCircle}>{getInitials(fullName)}</div>
      );
    }
    if (profilePicture) {
      return (
        <Image
          src={profilePicture}
          alt="Profile"
          className={`${styles.smallPicture} ${styles.small}`} // small profile picture
        />
      );
    }
    return <div className={styles.initialsCircle}>{getInitials(fullName)}</div>;
  };

  return (
    <div
      className={`${styles.profileContainer} ${isLarge ? styles.large : styles.small}`}
    >
      <div className={styles.profileImage}>
        {/* show profile picture if uploaded and in large mode, otherwise show initials */}
        {renderProfilePicture()}
      </div>

      <div className={styles.profileBasics}>
        <div className={styles.profileHeader}>
          <h2 className={isLarge ? styles.largeName : styles.smallName}>
            {fullName}
          </h2>
          <span className={styles.pronouns}>{pronouns}</span>
        </div>
        <p className={styles.basics}>Major: {major}</p>
        <p className={styles.basics}>Year: {year}</p>
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>
    </div>
  );
}

ProfileComponent.propTypes = {
  size: PropTypes.oneOf(["large", "small"]),
};

export default ProfileComponent;