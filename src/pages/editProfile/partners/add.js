import React, { useState } from "react";
import { useRouter } from "next/router";
import ScrollBar from "../../../../components/ScrollBar"; // Assuming ScrollBar is used for displaying partners

export default function ProfileAddPartners() {
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [previousPartners, setPreviousPartners] = useState([
    { id: 1, name: "Previous Partner 1" },
    { id: 2, name: "Previous Partner 2" },
    { id: 3, name: "Previous Partner 3" },
  ]);

  const router = useRouter();

  const handleSave = () => {
    const newPartner = {
      id: previousPartners.length + 1,
      name: partnerName,
      email: partnerEmail,
    };

    const updatedPartners = [...previousPartners, newPartner];

    // Save the updated partners list in localStorage
    localStorage.setItem("partners", JSON.stringify(updatedPartners));

    // Update local state and clear input fields
    setPreviousPartners(updatedPartners);
    setPartnerName("");
    setPartnerEmail("");

    // Optionally navigate back to the EditPartners page
    router.push("/editProfile/partners");
  };

  return (
    <div>
      <h2>Add Partners</h2>

      {/* ScrollBar component to display previous partners */}
      <ScrollBar previousPartners={previousPartners} />

      <input
        value={partnerName}
        onChange={(e) => setPartnerName(e.target.value)}
        placeholder="Full Name"
      />
      <input
        value={partnerEmail}
        onChange={(e) => setPartnerEmail(e.target.value)}
        placeholder="email@middlebury.edu"
      />

      <button
        type="button"
        onClick={() => router.push("/editProfile/partners")}
      >
        Cancel
      </button>
      <button type="button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
