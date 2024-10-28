import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../src/styles/ProfileComponent.module.css";
import ImageUploader from "./ImageUploader";

// haven't implemented the userid prop of the profile component
function ProfileComponent({ size = "large" }) {
  const isLarge = size === "large";

  // state for all the basics to be edited
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("Your Name");
  const [pronouns, setPronouns] = useState("(they/them)");
  const [major, setMajor] = useState("Your Major");
  const [year, setYear] = useState("Your Year");
  const [profilePicture, setProfilePicture] = useState(null);

  // toggle edit
  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  // handle image upload
  const handleImageUpload = (binaryData) => {
    // this is where we can send image data
    setProfilePicture(URL.createObjectURL(new Blob([binaryData])));
  };

  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
    return initials || "N/A";
  };

  return (
    <div
      className={`${styles.profileContainer} ${isLarge ? styles.large : styles.small}`}
    >
      <div className={styles.profileImage}>
        {/* shows profile picture if uploaded, otherwise show initials */}
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className={styles.profilePicture}
          />
        ) : (
          <div
            className={`${styles.initialsCircle} ${isLarge ? styles.large : styles.small}`}
          >
            {getInitials(fullName)}
          </div>
        )}
      </div>

      <div className={styles.profileBasics}>
        <div className={styles.profileHeader}>
          {/* edit name */}
          {isEditing ? (
            <input
              className={styles.nameInput}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
            />
          ) : (
            <h2 className={isLarge ? styles.largeName : styles.smallName}>
              {fullName}
            </h2>
          )}

          {/* editing pronouns */}
          {isEditing ? (
            <input
              className={styles.pronounsInput}
              type="text"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)} // Updates state as you type
              placeholder="Your Pronouns"
            />
          ) : (
            <span className={styles.pronouns}>{pronouns}</span>
          )}
        </div>

        {/* editing major and year */}
        {isEditing ? (
          <>
            <input
              className={styles.basicsInput}
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="Your Major"
            />
            <input
              className={styles.basicsInput}
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Your Year"
            />
          </>
        ) : (
          <>
            <p className={styles.basics}>Major: {major}</p>
            <p className={styles.basics}>Year: {year}</p>
          </>
        )}
      </div>

      {/* edit button toggles edit */}
      {isLarge && (
        <button
          type="button"
          className={styles.editButton}
          onClick={handleEditClick}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      )}

      {/* ImageUploader component after edit */}
      {isEditing && <ImageUploader onImageUpload={handleImageUpload} />}
    </div>
  );
}

ProfileComponent.propTypes = {
  size: PropTypes.oneOf(["large", "small"]),
  // userID: PropTypes.string.isRequired, // for when userID is implemented
};

export default ProfileComponent;
