import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../src/styles/ProfileComponent.module.css";
import ImageUploader from "./ImageUploader";

function ProfileComponent({ size = "large" }) {
  const isLarge = size === "large";

  // State for user profile data
  const [profileData, setProfileData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const userId = 2;

  useEffect(() => {
    fetch(`/api/user/${userId}/userProfile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProfileData(data); // Set fetched data to profileData state
        if (data["profile-pic"].length > 0) {
          const imageBlob = new Blob([new Uint8Array(data["profile-pic"])]); // Convert byte array to blob
          const imageURL = URL.createObjectURL(imageBlob);
          setProfilePicture(imageURL);
        }
      })
      .catch((error) => console.log("Error fetching user profile:", error));
  }, [userId]);

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
        id: userId,
        name: profileData?.name, // include other user info to update as necessary
        email: profileData?.email,
        pronouns: profileData?.pronouns,
        major: profileData?.major,
        "grad-year": profileData?.["grad-year"],
        "profile-pic": Array.from(binaryData), // convert the binary data to a plain array
        bio: profileData?.bio,
        interests: profileData?.interests,
        classes: profileData?.classes,
        partners: profileData?.partners,
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
          {getInitials(profileData?.name || "Your Name")}
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
        {getInitials(profileData?.name || "Your Name")}
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
            {profileData?.name || "Your Name"}
          </h2>
          <span className={styles.pronouns}>
            {profileData?.pronouns || "(they/them)"}
          </span>
        </div>
        <p className={styles.basics}>
          Major: {profileData?.major || "Your Major"}
        </p>
        <p className={styles.basics}>
          Year: {profileData?.["grad-year"] || "Your Year"}
        </p>
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>
    </div>
  );
}

ProfileComponent.propTypes = {
  size: PropTypes.oneOf(["large", "small"]),
};

export default ProfileComponent;
