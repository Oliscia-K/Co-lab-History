import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../src/styles/ProfileComponent.module.css";
import ImageUploader from "./ImageUploader";

function ProfileComponent({ size = "large", user }) {
  const isLarge = size === "large";

  // state for user profile picture
  const [profilePicture, setProfilePicture] = useState(null);

  const handleImageUpload = (binaryData) => {
    // FOR TESTING PURPOSES: log the binary data to check what is being passed
    console.log("Binary data received:", binaryData);

    // Convert the binary data into a Blob for preview
    const blob = new Blob([binaryData]);
    const imageURL = URL.createObjectURL(blob);
    setProfilePicture(imageURL);

    fetch(`/api/editProfile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user?.id,
        name: user?.name, // include other user info to update as necessary
        email: user?.email,
        pronouns: user?.pronouns,
        major: user?.major,
        "grad-year": user?.["grad-year"],
        "profile-pic": Array.from(binaryData), // convert the binary data to a plain array
        bio: user?.bio,
        interests: user?.interests,
        classes: user?.classes,
        partners: user?.partners,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update profile picture");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Profile picture updated:", data);
      })
      .catch((error) => {
        console.error("Error updating profile picture:", error);
      });
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
          <img
            src={profilePicture}
            alt="Profile"
            className={styles.profilePicture} // large profile picture
          />
        );
      }
      return (
        <div className={styles.initialsCircle}>
          {getInitials(user?.name || "Your Name")}
        </div>
      );
    }
    if (profilePicture) {
      return (
        <img
          src={profilePicture}
          alt="Profile"
          className={`${styles.smallPicture} ${styles.small}`} // small profile picture
        />
      );
    }
    return (
      <div className={styles.initialsCircle}>
        {getInitials(user?.name || "Your Name")}
      </div>
    );
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
            {user?.name || "Your Name"}
          </h2>
          <span className={styles.pronouns}>
            {user?.pronouns || "(they/them)"}
          </span>
        </div>
        <p className={styles.basics}>Major: {user?.major || "Your Major"}</p>
        <p className={styles.basics}>
          Year: {user?.["grad-year"] || "Your Year"}
        </p>
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>
    </div>
  );
}

ProfileComponent.propTypes = {
  size: PropTypes.oneOf(["large", "small"]), // Size can only be "large" or "small"
  user: PropTypes.shape({
    id: PropTypes.number.isRequired, // Assuming the ID is a required field
    name: PropTypes.string.isRequired, // Assuming name is required
    pronouns: PropTypes.string,
    email: PropTypes.string.isRequired, // Email is required for profile updates
    major: PropTypes.string,
    "grad-year": PropTypes.string,
    "profile-pic": PropTypes.arrayOf(PropTypes.number), // Assuming it's an array of numbers (binary data)
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
  }).isRequired, // The user object itself is required
};

export default ProfileComponent;
