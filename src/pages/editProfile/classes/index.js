/* eslint-disable no-console */
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import ClassesScrollBar from "../../../../components/ClassesScrollBar";
import styles from "../../../styles/editClasses.module.css"; // Import the updated CSS file

export default function EditClasses({ currentUser }) {
  const [classesTaken, setClassesTaken] = useState([{}]);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!currentUser && session) {
    router.push("/");
  }

  useEffect(() => {
    fetch(`/api/user/${userId}/userProfile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setClassesTaken(data.classes);
      })
      .catch((error) => console.log(error));
  }, [userId]);

  const linkRefReturn = useRef(null); // Create a ref for the <a> tag for the return button

  // Handle the return button click to simulate the <a> tag click
  const handleReturnClick = () => {
    if (linkRefReturn.current) {
      linkRefReturn.current.click(); // Trigger the click on the hidden <a> tag
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.classesContainer}>
        <h2 className={styles.title}>Edit Classes</h2>
        <ClassesScrollBar classesTaken={classesTaken} />
        <div className={styles.buttonContainer}>
          {/* Add button */}
          <button
            className={`${styles.button} ${styles.addButton}`}
            data-testid="add"
            type="button"
            onClick={() => router.push("/editProfile/classes/add")} // Direct navigation on button click
          >
            Add
          </button>

          {/* Delete button */}
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            data-testid="delete"
            type="button"
            onClick={() => router.push("/editProfile/classes/delete")} // Direct navigation on button click
          >
            Delete
          </button>

          {/* Back Button */}
          <button
            className={`${styles.button} ${styles.returnButton}`}
            data-testid="Return to Profile"
            type="button"
            onClick={handleReturnClick} // Trigger the hidden <a> tag click
          >
            Back
          </button>

          {/* Hidden <a> tag for Return to Profile button */}
          <a
            ref={linkRefReturn} // Attach the ref to the hidden <a> tag
            href={`/user/${userId}/userProfile`} // Navigate to the user profile
            style={{ display: "none" }} // Hide the <a> tag
          >
            Return to Profile
          </a>
        </div>
      </div>
    </div>
  );
}

EditClasses.propTypes = {
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
      }),
    ),
  }),
};
