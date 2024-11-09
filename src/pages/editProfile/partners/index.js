import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ScrollBar from "../../../../components/ScrollBar";

export default function EditPartners() {
  const [previousPartners, setPreviousPartners] = useState([]);
  const router = useRouter();

  const userId = 3;

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
        id: userId, // Use the actual user ID
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
