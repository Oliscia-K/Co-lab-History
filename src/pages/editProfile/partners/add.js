import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ScrollBar from "../../../../components/ScrollBar";

export default function AddPartners() {
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [previousPartners, setPreviousPartners] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // state to hold the user profile data
  const router = useRouter();
  const { data: session } = useSession();

  const userId = session?.user?.id;

  // Fetch user profile data
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
          setUserProfile(data); // set the profile data in the state
          setPreviousPartners(data.partners || []); // set the previous partners from the profile data
        })
        .catch((error) => console.log("Error fetching user profile:", error));
    }
  }, [userId]);

  // Handle adding a new partner
  const handleAdd = () => {
    if (!partnerName || !partnerEmail) {
      alert("Please enter both a name and email."); // could potentially add a filter for a valid email address later
      return;
    }

    const newPartner = { name: partnerName, email: partnerEmail };

    // update the state with the new partner, using spread object
    setPreviousPartners((prevPartners) => [...prevPartners, newPartner]);

    // clear the input fields
    setPartnerName("");
    setPartnerEmail("");
  };

  // handle saving the updated partner list
  const handleSave = () => {
    if (previousPartners.length === 0) {
      alert("No partners to save.");
      return;
    }

    const requestBody = {
      id: userId,
      name: userProfile.name || "Unknown", // Use name from userProfile
      email: userProfile.email || "No Email", // Use email from userProfile
      pronouns: userProfile.pronouns || "Not provided", // Use pronouns from userProfile
      major: userProfile.major || "Undeclared", // Use major from userProfile
      "grad-year": userProfile["grad-year"] || "Not available", // Use grad-year from userProfile
      "profile-pic": userProfile["profile-pic"] || [], // Use profile-pic from userProfile
      bio: userProfile.bio || "Bio not provided", // Use bio from userProfile
      interests: userProfile.interests || "", // Use interests from userProfile
      classes: userProfile.classes || [], // Use classes from userProfile
      partners: previousPartners.map((partner) => ({
        name: partner.name,
        email: partner.email,
      })), // Ensure partners is sent as an array of objects
    };

    console.log("Sending request body:", requestBody); // TESTING purposes

    // Send PUT request to update the profile and partner list
    fetch("/api/editProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to update partners, status:", response.status);
          throw new Error("Failed to update partners");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Partners updated successfully:", data);
        router.push("/editProfile/partners"); // redirect to partners page after successful update
      })
      .catch((error) => {
        console.error("Error saving partners:", error);
      });
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
        placeholder="Partner Name"
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
