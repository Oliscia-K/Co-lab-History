/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ClassesScrollBar from "../../../../components/ClassesScrollBar";
import styles from "../../../styles/DeleteClasses.module.css"; // Import the styles

export default function ProfileDeleteClasses() {
  const [classesTaken, setClassesTaken] = useState([]);
  const [classToDelete, setClassToDelete] = useState(null); // Track class to delete
  const { data: session } = useSession(); // Session holds user info
  const userId = session?.user?.id; // Get the userId from session
  const userEmail = session?.user?.email; // Get user email for API request

  // Fetch user profile data and classes
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
          setClassesTaken(data.classes || []); // Set the user's classes
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    }
  }, [userId]);

  // Set the class to be deleted
  const handleDeleteClass = (className) => {
    const classToBeDeleted = classesTaken.find((cls) => cls.name === className);
    if (classToBeDeleted) {
      setClassToDelete(classToBeDeleted); // Store class to delete
    }
  };

  // Confirm delete and send DELETE request to both APIs
  const confirmDelete = () => {
    if (!classToDelete) return;

    // Send DELETE request to editProfile API to remove class from user profile
    fetch(`/api/editProfile`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId, // Send userId
        type: "class", // Specify class deletion
        classToDelete: classToDelete.name, // Send class name to delete
        email: userEmail, // Send email for identification
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete class from editProfile");
        }
        return response.json();
      })
      .then(() =>
        // Send DELETE request to editUserClasses API to remove class from UserClasses table
        fetch(
          `/api/editUserClasses?classNumber=${classToDelete.number}&userEmail=${userEmail}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              classNumber: classToDelete.number, // Send class number for UserClasses deletion
              userEmail: session?.user?.email, // Send email for identification
            }),
          },
        ),
      )
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to delete class from editUserClasses");
        }

        // Successfully deleted from both APIs
        console.log(
          "Class deleted successfully from both editProfile and editUserClasses",
        );

        // Update the classesTaken state by removing the deleted class
        setClassesTaken((prevClasses) =>
          prevClasses.filter((cls) => cls.name !== classToDelete.name),
        );
        setClassToDelete(null); // Reset the classToDelete state
      })
      .catch((error) => {
        console.error("Error deleting class:", error);
      });
  };

  // Cancel delete (reset state)
  const cancelDelete = () => {
    setClassToDelete(null); // Reset the classToDelete state
  };

  return (
    <div className={styles.deleteClassesContainer}>
      <div className={styles.deleteClassFormContainer}>
        <h2 className={styles.deleteClassTitle}>Delete Classes</h2>

        {/* ScrollBar component for displaying the classes */}
        <div className={styles.scrollbarContainer}>
          <ClassesScrollBar classesTaken={classesTaken} />
        </div>

        {/* Display classes with delete button */}
        <div className={styles.previousClassesList}>
          <ul>
            {classesTaken.map((classItem) => (
              <li key={classItem.name}>
                {classItem.name} -{" "}
                {classItem.progress ? "completed" : "in progress"}
                <button
                  type="button"
                  onClick={() => handleDeleteClass(classItem.name)} // Trigger handleDelete to select a class
                  className={styles.button}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* If a class is selected for deletion, show confirmation */}
        {classToDelete && (
          <div className={styles.confirmationBox}>
            <p>Are you sure you want to delete {classToDelete.name}?</p>
            <button
              type="button"
              onClick={confirmDelete} // Confirm the deletion
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
      </div>
      {/* Button to cancel and go back to Edit Classes page */}
      <div className={styles.backButtonContainer}>
        <Link href="/editProfile/classes">
          <button type="button" className={styles.backButton}>
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}
