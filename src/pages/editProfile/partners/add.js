import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ScrollBar from "../../../../components/ScrollBar"; // Assuming ScrollBar is used for displaying partners

export default function AddPartners() {
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [previousPartners, setPreviousPartners] = useState([]);
  const router = useRouter();
  const userId = 3;

  // Fetch data from user profile
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

  const handleAdd = () => {
    if (!partnerName || !partnerEmail) {
      alert("Please enter both a name and email.");
    }

    // create new partner
    const newPartner = {
      name: partnerName,
      email: partnerEmail,
    };

    // Update the state with the new partner
    setPreviousPartners((prevPartners) => [...prevPartners, newPartner]);

    // Clear the input fields
    setPartnerName("");
    setPartnerEmail("");
  };

  const handleSave = () => {
    if (previousPartners.length === 0) {
      alert("No partners to save.");
      return;
    }

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
      })
      .catch((error) => {
        console.error("Error saving partners:", error);
      });
    router.push("/editProfile/partners");
  };

  return (
    <div>
      <h2>Add Partner</h2>

      {/* Display the list of previous partners using ScrollBar */}
      <ScrollBar previousPartners={previousPartners} />

      {/* Form for adding a new partner */}
      <input
        value={partnerName}
        onChange={(e) => setPartnerName(e.target.value)}
        placeholder="Full Name"
      />
      <input
        value={partnerEmail}
        onChange={(e) => setPartnerEmail(e.target.value)}
        placeholder="email@domain.com"
      />

      <button type="button" onClick={handleAdd}>
        Add Partner
      </button>

      {/* Button to save the new partner */}
      <button type="button" onClick={handleSave}>
        Save Partner
      </button>

      {/* Button to cancel and go back to Edit Partners page */}
      <button
        type="button"
        onClick={() => router.push("/editProfile/partners")}
      >
        Cancel
      </button>
    </div>
  );
}
