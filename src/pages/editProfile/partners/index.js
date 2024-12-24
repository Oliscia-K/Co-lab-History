/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import ScrollBar from "../../../../components/ScrollBar";
import styles from "../../../styles/EditPartners.module.css";

export default function EditPartners({ currentUser }) {
  const router = useRouter();
  const { data: session } = useSession();
  if (!currentUser && session) {
    router.push("/");
  }
  const [previousPartners, setPreviousPartners] = useState([]);

  const userId = session?.user?.id;

  useEffect(() => {
    // Fetch user data from the API
    fetch(`/api/user/${userId}/userProfile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPreviousPartners(data.partners || []);
        console.log("Fetched partners:", data);
      })
      .catch((error) => console.log("Error fetching user profile:", error));
  }, [userId]);

  const linkRef = useRef(null); // Create a ref for the <a> tag

  // Function to handle button click
  const handleButtonClick = () => {
    if (linkRef.current) {
      linkRef.current.click(); // Trigger click on the <a> tag
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.editPartnersContainer}>
        <h2 className={styles.title}>Edit Partners</h2>

        {/* Display the list of previous partners using ScrollBar */}
        <div className={styles.scrollbarContainer}>
          <ScrollBar previousPartners={previousPartners} />
        </div>

        {/* Button container for navigating */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            type="button"
            onClick={() => router.push("/editProfile/partners/add")}
          >
            Add
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => router.push("/editProfile/partners/delete")}
          >
            Delete
          </button>

          {/* Cancel button */}
          <button
            className={styles.button} // Use your button styles
            type="button"
            onClick={handleButtonClick} // Trigger the function on click
          >
            Back
          </button>

          {/* Hidden <a> tag that will be clicked programmatically */}
          <a
            ref={linkRef} // Attach the ref to the <a> tag
            href={`/user/${userId}/userProfile`} // Your desired link
            style={{ display: "none" }} // Hide the <a> tag from the UI
          >
            Back
          </a>
        </div>
      </div>
    </div>
  );
}

EditPartners.propTypes = {
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
  }).isRequired,
};
