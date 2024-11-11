/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ScrollBar from "../../../../components/ScrollBar"; // Assuming ScrollBar is used for displaying partners

export default function AddPartners() {
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [previousPartners, setPreviousPartners] = useState([]);
  const router = useRouter();

  // Get the session data from next-auth
  const { data: session, status } = useSession();

  // If no session is available, redirect to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin"); // Redirect to login if not authenticated
    }
  }, [status, router]);

  // Get userId from session
  const userId = session?.user?.id;

  // Fetch data from the user profile using the userId from session
  useEffect(() => {
    if (userId) {
      fetch(`/api/user/${userId}/userProfile`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Set the previous partners data from the fetched profile data
          setPreviousPartners(data.partners || []);
          console.log("Fetched partners:", data);
        })
        .catch((error) => console.log("Error fetching user profile:", error));
    }
  }, [userId]);

  const handleAdd = () => {
    if (!partnerName || !partnerEmail) {
      alert("Please enter both a name and email.");
      return;
    }

    // Create new partner object
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

    // Send the updated partners list to the backend API
    fetch("/api/editProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId, // Use the userId from session
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
        // After saving the partners, redirect to the Edit Partners page
        router.push("/editProfile/partners");
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
