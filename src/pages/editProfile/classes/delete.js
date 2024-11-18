/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ClassesScrollBar from "../../../../components/ClassesScrollBar";

export default function ProfileDeleteClasses() {
  const [classesTaken, setClassesTaken] = useState([]);
  const [classToDelete, setClassToDelete] = useState(null); // State variable to track class to delete
  const { data: session } = useSession(); // Session holds user info
  const userId = session?.user?.id; // Get the userId from session

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
          console.log(data);
          setClassesTaken(data.classes || []); // Set the user's classes
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    }
  }, [userId]);

  // Set the class to be deleted
  const handleDeleteClass = (className) => {
    const classToBeDeleted = classesTaken.find((cls) => cls.name === className); // Renamed to `classToBeDeleted`
    if (classToBeDeleted) {
      setClassToDelete(classToBeDeleted); // Store the class to delete
    }
    console.log(classToBeDeleted);
  };

  // Confirm delete and send DELETE request to backend
  const confirmDelete = () => {
    if (!classToDelete) return;
    console.log(classToDelete);

    // Send DELETE request to API to remove the class or partner
    fetch(`/api/editProfile`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        type: "class", // Specify whether it's a class or partner
        classToDelete: classToDelete.name, // Send class name if deleting class
        email: classToDelete.email, // Send email if deleting partner
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Delete successful:", data);
        setClassesTaken((prevClasses) =>
          prevClasses.filter((cls) => cls.name !== classToDelete.name),
        );
        setClassToDelete(null);
      })
      .catch((error) => console.error("Error deleting:", error));
  };

  // Cancel delete (reset state)
  const cancelDelete = () => {
    setClassToDelete(null);
  };

  return (
    <div>
      <h2>Delete Classes</h2>

      {/* Display the list of classes using ClassesScrollBar */}
      <ClassesScrollBar classesTaken={classesTaken} />

      {/* Display classes with delete button */}
      <ul>
        {classesTaken.map((classItem) => (
          <li
            key={classItem.name}
            style={{ display: "flex", alignItems: "center" }}
          >
            <span>
              {classItem.name} -{" "}
              {classItem.progress ? "completed" : "in progress"}
            </span>
            <button
              type="button"
              onClick={() => handleDeleteClass(classItem.name)} // Trigger handleDelete to select a class
              style={{ margin: "10px" }} // Add margin to the button for spacing
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* If a class is selected for deletion, show confirmation */}
      {classToDelete && (
        <div>
          <p>Are you sure you want to delete {classToDelete.name}?</p>
          <button
            type="button"
            onClick={confirmDelete} // Confirm the deletion
            style={{ marginRight: "10px" }} // margin to space out buttons
          >
            Confirm Delete
          </button>
          <button type="button" onClick={cancelDelete}>
            Cancel
          </button>
        </div>
      )}

      {/* Button to cancel and go back to Edit Classes page */}
      <Link href="/editProfile/classes">
        <button
          type="button"
          style={{ marginTop: "20px" }} // margin to space out the back button
        >
          Back
        </button>
      </Link>
    </div>
  );
}
