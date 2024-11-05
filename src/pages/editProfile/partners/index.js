import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ScrollBar from "../../../../components/ScrollBar";

export default function EditPartners() {
  const [previousPartners, setPreviousPartners] = useState([]);
  const router = useRouter();

  // Fetch the partners from localStorage when the component mounts
  useEffect(() => {
    const storedPartners = localStorage.getItem("partners");

    if (storedPartners) {
      setPreviousPartners(JSON.parse(storedPartners)); // Set the partners list from localStorage
    }
  }, []);

  // Function to handle save action and redirect to user profile
  const handleSave = () => {
    // You may want to update the partners list in the backend here
    fetch("/api/editProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 2, // Replace with actual user ID
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
        router.push("/user/2/userProfile/"); // Replace with the correct path for the user profile page
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

      {/* Save button to save the changes and redirect */}
      <button type="button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}