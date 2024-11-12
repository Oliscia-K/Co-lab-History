/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import ScrollBar from "../../../../components/ScrollBar";

export default function EditPartners() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [previousPartners, setPreviousPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ensure the user is logged in and has a valid session
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to home if no session
    } else {
      const userId = session?.user?.id;
      if (!userId) {
        router.push("/"); // Redirect to home if user ID is not found
      } else {
        // Fetch user profile and partners data
        fetch(`/api/user/${userId}/userProfile`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setPreviousPartners(data.partners || []); // Set partners from fetched user profile
            setLoading(false); // Stop loading when data is fetched
          })
          .catch((error) => {
            console.error("Error fetching user profile:", error);
            setLoading(false); // Stop loading in case of error
          });
      }
    }
  }, [session, status, router]);

  // Handle save action and update partners
  const handleSave = async () => {
    const userId = session?.user?.id;
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    try {
      // Only send the updated partners array
      const requestBody = {
        partners: previousPartners.map((partner) => ({
          name: partner.name,
          email: partner.email,
        })),
      };

      const response = await fetch(`/api/user/${userId}/partners`, {
        method: "PATCH", // PATCH for partial updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to update partners");
      }

      const data = await response.json();
      console.log("Partners updated successfully:", data);

      // After saving the partners, redirect to the profile page
      router.push(`/user/${userId}/userProfile/`);
    } catch (error) {
      console.error("Error saving partners:", error);
    }
  };

  // Display loading state
  if (loading) {
    return <div>Loading...</div>; // Display loading state while fetching
  }

  return (
    <div>
      <h2>Edit Partners</h2>
      {/* Pass previousPartners as props to the ScrollBar component */}
      <ScrollBar previousPartners={previousPartners} />

      {/* Buttons to navigate to the Add/Delete Partners pages */}
      <button
        type="button"
        onClick={() => router.push("/editProfile/partners/add")}
      >
        Add Partner
      </button>

      <button
        type="button"
        onClick={() => router.push("/editProfile/partners/delete")}
      >
        Delete Partner
      </button>

      {/* Cancel button to go back to the main profile page */}
      <button
        type="button"
        onClick={() => router.push(`/user/${session.user.id}/userProfile/`)}
      >
        Back
      </button>

      {/* Save button to submit changes */}
      <button type="button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

EditPartners.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    pronouns: PropTypes.string,
    major: PropTypes.string,
    "grad-year": PropTypes.string,
    "profile-pic": PropTypes.arrayOf(PropTypes.number),
    bio: PropTypes.string,
    interests: PropTypes.string,
    classes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        status: PropTypes.string,
      }),
    ),
    partners: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
      }),
    ),
  }),
};
