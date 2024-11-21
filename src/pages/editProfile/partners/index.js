/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import ScrollBar from "../../../../components/ScrollBar";

export default function EditPartners({ currentUser }) {
  const router = useRouter();
  const { data: session } = useSession();
  if (!currentUser && session) {
    router.push("/");
  }
  const [previousPartners, setPreviousPartners] = useState([]);

  const userId = session?.user?.id;

  useEffect(() => {
    // fetch user data from the API, with useEffect to make sure the data is correctly displayed
    fetch(`/api/user/${userId}/userProfile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPreviousPartners(data.partners || []);
        console.log("Fetched partners:", data);
      })
      .catch((error) => console.log("Error fetching user profile:", error));
  }, [userId]);

  return (
    <div>
      <h2>Edit Partners</h2>
      {/* Pass previousPartners as props to the ScrollBar component */}
      <ScrollBar previousPartners={previousPartners} />

      {/* Button to navigate to the Add Partners page */}
      <button
        type="button"
        onClick={() => router.push("/editProfile/partners/add")}
      >
        Add
      </button>

      <button
        type="button"
        onClick={() => router.push("/editProfile/partners/delete")}
      >
        Delete
      </button>

      {/* Cancel button */}
      <a href={`/user/${userId}/userProfile`}>
        <button type="button">Back</button>
      </a>
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
  }).isRequired,
};
