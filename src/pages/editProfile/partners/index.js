/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import ScrollBar from "../../../../components/ScrollBar";

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
        // Set fetched partners data into the state
        setPreviousPartners(data.partners || []); // Assuming the API returns a 'partners' field
        console.log("Fetched partners:", data);
      })
      .catch((error) => console.log("Error fetching user profile:", error));
  }, [userId]);

  // Function to handle the save action and update the user profile
  const handleSave = () => {
    // Send the updated partners list to the backend
    fetch("/api/editProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        partners: previousPartners, // Send the updated partners list
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update partners");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Partners updated successfully:", data);
        // After saving the partners, redirect the user to their profile page
        router.push(`/user/${userId}/userProfile/`);
      })
      .catch((error) => {
        console.error("Error saving partners:", error);
      });
  };

  return (
    <div>
      <h2>Edit Partners</h2>
      {/* Pass previousPartners as props to the ScrollBar component */}
      <ScrollBar previousPartners={previousPartners} />

      {/* Button to navigate to the Add Partners page */}

      <button
        type="button"
        onClick={() => router.push("/editProfile/partners/add")}
      >
        Add
      </button>

      <button
        type="button"
        onClick={() => router.push("/editProfile/partners/delete")}
      >
        Delete
      </button>

      {/* Cancel button */}
      <button type="button" onClick={() => router.push("/")}>
        Cancel
      </button>

      {/* Save button */}
      <button type="button" onClick={handleSave}>
        Save
      </button>
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
