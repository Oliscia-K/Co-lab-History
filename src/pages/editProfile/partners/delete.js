import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ScrollBar from "../../../../components/ScrollBar"; // Assuming ScrollBar is used for displaying partners

export default function DeletePartners() {
  const [previousPartners, setPreviousPartners] = useState([]); // Local state to hold the list of partners
  const [partnerToDelete, setPartnerToDelete] = useState(null); // To track the partner being deleted
  const router = useRouter();
  const userId = 3; // Replace with dynamic user ID if needed

  // Fetch user data from the API
  useEffect(() => {
    // Fetch user data from the API to get the list of partners
    fetch(`/api/user/${userId}/userProfile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Set the partners data in local state
        setPreviousPartners(data.partners || []);
      })
      .catch((error) => console.error("Error fetching user profile:", error));
  }, [userId]);

  // Function to handle deletion of a partner (sets the partner to be deleted)
  const handleDelete = (partnerEmail) => {
    // Find the partner by email
    const partner = previousPartners.find((p) => p.email === partnerEmail);
    if (partner) {
      setPartnerToDelete(partner); // Store the partner to delete
    }
  };

  // Confirm deletion and send the DELETE request to the server
  const confirmDelete = () => {
    if (!partnerToDelete) return;

    // Make the DELETE request to the API to remove the partner
    fetch("/api/editProfile", {
      method: "DELETE", // Use DELETE method to remove the partner
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId, // The user ID
        email: partnerToDelete.email, // The partner's email
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete partner: ${partnerToDelete.email}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Partner deleted successfully:", data);

        // Remove the partner from the local state to reflect the deletion immediately
        setPreviousPartners((prevPartners) =>
          prevPartners.filter(
            (partner) => partner.email !== partnerToDelete.email,
          ),
        );
        // Clear the partner to delete state
        setPartnerToDelete(null);
      })
      .catch((error) => {
        console.error("Error deleting partner:", error);
      });
  };

  // Cancel the deletion (reset state and return to edit partners page)
  const cancelDelete = () => {
    setPartnerToDelete(null); // Clear the partnerToDelete state
  };

  return (
    <div>
      <h2>Delete Partner</h2>

      {/* Display the list of previous partners using ScrollBar */}
      <ScrollBar previousPartners={previousPartners} />

      {/* Display the list of partners with delete buttons */}
      <ul>
        {previousPartners.map((partner) => (
          <li key={partner.email}>
            {partner.name} - {partner.email}
            <button
              type="button"
              onClick={() => handleDelete(partner.email)} // Trigger handleDelete to select a partner
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* If a partner is selected for deletion, show confirmation */}
      {partnerToDelete && (
        <div>
          <p>Are you sure you want to delete {partnerToDelete.name}?</p>
          <button type="button" onClick={confirmDelete}>
            Confirm Delete
          </button>{" "}
          {/* Confirm will delete */}
          <button type="button" onClick={cancelDelete}>
            Cancel
          </button>{" "}
          {/* Cancel will reset the state */}
        </div>
      )}

      {/* Button to cancel and go back to Edit Partners page */}
      <button
        type="button"
        onClick={() => router.push("/editProfile/partners")}
      >
        Back to Edit Partners
      </button>
    </div>
  );
}
