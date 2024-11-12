import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ScrollBar from "../../../../components/ScrollBar"; // Assuming ScrollBar is used for displaying partners

export default function DeletePartners() {
  const [previousPartners, setPreviousPartners] = useState([]); // Local state to hold the list of partners
  const [partnerToDelete, setPartnerToDelete] = useState(null); // To track the partner being deleted
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session data for user info
  const userId = session?.user?.id; // Get userId from session

  // Ensure user is authenticated and fetch their partners data
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to home if not authenticated
    } else if (userId) {
      // Only fetch user profile data if userId is available
      fetch(`/api/user/${userId}/userProfile`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setPreviousPartners(data.partners || []); // Set the partners data
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    } else {
      // If no userId, redirect to the homepage
      router.push("/");
    }
  }, [userId, status, router]); // Added dependencies to rerun if session data changes

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

    // Remove the partner locally first to reflect the change immediately
    setPreviousPartners((prevPartners) =>
      prevPartners.filter((partner) => partner.email !== partnerToDelete.email),
    );

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

        // After deletion, reset partnerToDelete
        setPartnerToDelete(null);
      })
      .catch((error) => {
        console.error("Error deleting partner:", error);

        // If error occurs, restore the partner list
        setPreviousPartners((prevPartners) => [
          ...prevPartners,
          partnerToDelete,
        ]);
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
          <button
            type="button"
            onClick={confirmDelete}
            style={{ marginRight: "10px" }} // Added margin to space out buttons
          >
            Confirm Delete
          </button>{" "}
          {/* Confirm will delete */}
          <button
            type="button"
            onClick={cancelDelete}
            style={{ marginLeft: "10px" }} // Added margin to space out buttons
          >
            Cancel
          </button>{" "}
          {/* Cancel will reset the state */}
        </div>
      )}

      {/* Button to cancel and go back to Edit Partners page */}
      <button
        type="button"
        onClick={() => router.push("/editProfile/partners")}
        style={{ marginTop: "20px" }} // Added margin to space out the back button
      >
        Back to Edit Partners
      </button>
    </div>
  );
}
