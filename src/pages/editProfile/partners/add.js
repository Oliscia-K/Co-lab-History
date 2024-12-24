/* eslint-disable no-console */
/* eslint-disable no-alert */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ScrollBar from "../../../../components/ScrollBar";
import styles from "../../../styles/EditPartners.module.css"; // Import your shared styles

export default function AddPartners() {
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [previousPartners, setPreviousPartners] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();

  const userId = session?.user?.id;

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
          setUserProfile(data);
          setPreviousPartners(data.partners || []);
        })
        .catch((error) => console.log("Error fetching user profile:", error));
    }
  }, [userId]);

  const handleAdd = () => {
    if (!partnerName || !partnerEmail) {
      alert("Please enter both a name and email.");
      return;
    }

    const newPartner = { name: partnerName, email: partnerEmail };

    setPreviousPartners((prevPartners) => [...prevPartners, newPartner]);
    setPartnerName("");
    setPartnerEmail("");
  };

  const handleSave = () => {
    if (previousPartners.length === 0) {
      alert("No partners to save.");
      return;
    }

    const requestBody = {
      id: userId,
      name: userProfile.name || "Unknown",
      email: userProfile.email || "No Email",
      pronouns: userProfile.pronouns || "Not provided",
      major: userProfile.major || "Undeclared",
      "grad-year": userProfile["grad-year"] || "Not available",
      "profile-pic": userProfile["profile-pic"] || [],
      bio: userProfile.bio || "Bio not provided",
      interests: userProfile.interests || "",
      classes: userProfile.classes || [],
      partners: previousPartners.map((partner) => ({
        name: partner.name,
        email: partner.email,
      })),
    };

    console.log("Sending request body:", requestBody);

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
        router.push("/editProfile/partners");
      })
      .catch((error) => {
        console.error("Error saving partners:", error);
      });
  };

  return (
    <div className={styles.addPartnerContainer}>
      <div className={styles.addPartnerFormContainer}>
        <h2 className={styles.addPartnerTitle}>Add Partner</h2>

        <ScrollBar previousPartners={previousPartners} />

        <input
          className={styles.addPartnerInput}
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder="Partner Name"
        />
        <input
          className={styles.addPartnerInput}
          value={partnerEmail}
          onChange={(e) => setPartnerEmail(e.target.value)}
          placeholder="email@domain.com"
        />

        <div className={styles.addPartnerButtonContainer}>
          <button
            className={styles.addPartnerButton}
            type="button"
            onClick={handleAdd}
          >
            Add Partner
          </button>
          <button
            className={styles.addPartnerButton}
            type="button"
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button
            className={styles.addPartnerButton}
            type="button"
            onClick={() => router.push("/editProfile/partners")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
