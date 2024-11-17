import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ScrollBar from "../../../../components/ScrollBar";

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
    <div>
      <h2>delete partner</h2>

      {/* display the list of previous partners using ScrollBar */}
      <ScrollBar previousPartners={previousPartners} />

      {/* display the list of partners with delete buttons */}
      <ul>
        {previousPartners.map((partner) => (
          <li key={partner.email}>
            {partner.name} - {partner.email}
            <button
              type="button"
              onClick={() => handleDelete(partner.email)} // trigger handleDelete to select a partner
              style={{ margin: "10px" }} // add margin to the button for spacing
            >
              delete
            </button>
          </li>
        ))}
      </ul>

      {/* if a partner is selected for deletion, show confirmation */}
      {partnerToDelete && (
        <div>
          <p>are you sure you want to delete {partnerToDelete.name}?</p>
          <button
            type="button"
            onClick={confirmDelete}
            style={{ marginRight: "10px" }} // margin to space out buttons
          >
            confirm delete
          </button>{" "}
          {/* confirm will delete */}
          <button type="button" onClick={cancelDelete}>
            cancel
          </button>{" "}
          {/* cancel will reset the state */}
        </div>
      )}

      {/* button to cancel and go back to Edit Partners page */}
      <button
        type="button"
        onClick={() => router.push("/editProfile/partners")}
        style={{ marginTop: "20px" }} // margin to space out the back button
      >
        back
      </button>
    </div>
  );
}
