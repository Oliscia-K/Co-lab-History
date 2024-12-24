/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ScrollBar from "../../../../components/ScrollBar"; // Make sure ScrollBar is correctly imported
import styles from "../../../styles/DeletePartners.module.css"; // Import the styles

export default function DeletePartners() {
  const [previousPartners, setPreviousPartners] = useState([]); // local state to hold the list of partners
  const [partnerToDelete, setPartnerToDelete] = useState(null); // local state for deleting partners
  const router = useRouter();
  const { data: session } = useSession(); // obtain session data

  const userId = session?.user?.id;

  useEffect(() => {
    // fetch user profile data if userId is available
    if (userId) {
      fetch(`/api/user/${userId}/userProfile`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setPreviousPartners(data.partners || []); // set the partners data
        })
        .catch((error) => console.error("error fetching user profile:", error));
    }
  }, [userId, router]);

  // sets the partner to be deleted
  const handleDelete = (partnerEmail) => {
    const partner = previousPartners.find((p) => p.email === partnerEmail);
    if (partner) {
      setPartnerToDelete(partner); // store the partner to delete
    }
  };

  // confirm the delete and send the DELETE request to the server
  const confirmDelete = () => {
    if (!partnerToDelete) return;

    // send the DELETE request to the API to remove the partner
    fetch("/api/editProfile", {
      method: "DELETE", // use DELETE method to remove the partner
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        type: "partner", // specify that this is a partner deletion
        email: partnerToDelete.email, // the partner's email
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`failed to delete partner: ${partnerToDelete.email}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("partner deleted successfully:", data);

        // remove the partner from the local state
        setPreviousPartners((prevPartners) =>
          prevPartners.filter(
            (partner) => partner.email !== partnerToDelete.email,
          ),
        );

        // clear the partner to delete state
        setPartnerToDelete(null);
      })
      .catch((error) => {
        console.error("error deleting partner:", error);
      });
  };

  // cancel the deletion (reset state)
  const cancelDelete = () => {
    setPartnerToDelete(null);
  };

  return (
    <div className={styles.deletePartnersContainer}>
      <div className={styles.deletePartnerFormContainer}>
        <h2 className={styles.deletePartnerTitle}>Delete Partners</h2>

        {/* ScrollBar component for displaying the partners */}
        <div className={styles.scrollbarContainer}>
          <ScrollBar previousPartners={previousPartners} />
        </div>

        {/* display the list of previous partners */}
        <div className={styles.previousPartnersList}>
          <ul>
            {previousPartners.map((partner) => (
              <li key={partner.email}>
                {partner.name} - {partner.email}
                <button
                  type="button"
                  onClick={() => handleDelete(partner.email)} // trigger handleDelete to select a partner
                  className={styles.button}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* if a partner is selected for deletion, show confirmation */}
      {partnerToDelete && (
        <div className={styles.confirmationBox}>
          <p>Are you sure you want to delete {partnerToDelete.name}?</p>
          <button
            type="button"
            onClick={confirmDelete}
            className={`${styles.button} ${styles.confirmButton}`}
          >
            Confirm Delete
          </button>
          <button
            type="button"
            onClick={cancelDelete}
            className={`${styles.button} ${styles.cancelButton}`}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Button to go back to the Edit Partners page */}
      <div className={styles.backButtonContainer}>
        <button
          type="button"
          onClick={() => router.push("/editProfile/partners")}
          className={styles.backButton}
        >
          Back
        </button>
      </div>
    </div>
  );
}
