/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ClassesScrollBar from "../../../../components/ClassesScrollBar";
import styles from "../../../styles/editClasses.module.css";

export default function ProfileAddPartners() {
  const [user, setUserData] = useState();
  const [classesTaken, setClassesTaken] = useState([{}]);
  const [newClass, setNewClass] = useState("");
  const [allClasses, setAllClasses] = useState([{}]);
  const [progress, setProgress] = useState("");
  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fetch classes from the cs-courses.json file
  useEffect(() => {
    fetch("/api/classes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setAllClasses(data);
      })
      .catch((error) => console.log(error));

    fetch(`/api/user/${userId}/userProfile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
        setClassesTaken(data.classes || []);
      })
      .catch((error) => console.log(error));
  }, [userId]);

  // Handle adding a new class
  const handleAddClass = () => {
    if (
      newClass &&
      progress &&
      !classesTaken.some((cls) => cls.name === newClass)
    ) {
      const selectedClass = allClasses.find((cls) => cls.name === newClass);
      if (selectedClass) {
        setClassesTaken([
          ...classesTaken,
          { ...selectedClass, progress: progress === "Completed" },
        ]);
        setNewClass("");
        setProgress("");
      }
    }
  };

  // Update status for an existing class
  const handleStatusChange = (className, newProgress) => {
    setClassesTaken((prevClasses) =>
      prevClasses.map((cls) =>
        cls.name === className ? { ...cls, progress: newProgress } : cls,
      ),
    );
  };

  const fileUpdate = () => {
    // Prepare the updated classes for the /api/editUserClasses request
    const updatedClasses = classesTaken.map((cls) => ({
      classNumber: cls.number,
      userEmail: user?.email,
      completionStatus: cls.progress ? "completed" : "in progress",
    }));

    // Prepare the updated profile data
    const updatedProfile = {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      pronouns: user?.pronouns,
      major: user?.major,
      "grad-year": user?.["grad-year"],
      "profile-pic": user?.["profile-pic"],
      bio: user?.bio,
      interests: user?.interests,
      classes: classesTaken,
      partners: user?.partners,
    };

    // Perform both PUT requests in parallel using Promise.all
    Promise.all([
      // First PUT request for updating user profile
      fetch("/api/editProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      }),

      // Second PUT request for updating user classes
      fetch("/api/editUserClasses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newClasses: updatedClasses,
        }),
      }),
    ])
      .then((responses) =>
        // Check both responses
        Promise.all(responses.map((response) => response.json())),
      )
      .then((data) => {
        console.log(data);
        setShowSavedPopup(true); // Show the popup
        setTimeout(() => setShowSavedPopup(false), 3000); // Hide after 3 seconds
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  return (
    <div>
      <h2>Add Classes</h2>
      {showSavedPopup && <div className={styles.savedPopup}>Saved!</div>}
      <ClassesScrollBar
        classesTaken={classesTaken}
        className={styles.classesContainer}
      >
        {classesTaken.map((cls) => (
          <div key={cls.name} className={styles.classItem}>
            <span>{cls.name}</span>
            <select
              value={cls.progress || "In Progress"}
              onChange={(e) => handleStatusChange(cls.name, e.target.value)}
              className={styles.classSelect}
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        ))}
      </ClassesScrollBar>

      <div className={styles.actionContainer}>
        <label htmlFor="classDropdown">Choose a class: </label>
        <select
          id="classDropdown"
          onChange={(e) => setNewClass(e.target.value)}
          value={newClass}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Select a class
          </option>
          {allClasses.map((cls) => (
            <option key={cls.id} value={cls.name}>
              {cls.name}
            </option>
          ))}
        </select>
        <label htmlFor="progressDropdown">Progress Status: </label>
        <select
          id="progressDropdown"
          onChange={(e) => setProgress(e.target.value)}
          value={progress}
          className={styles.dropdown}
        >
          <option value="" disabled>
            In Progress?
          </option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button
        type="button"
        className={styles.addButton}
        onClick={handleAddClass}
      >
        Add
      </button>
      <Link href="/editProfile/classes">
        <button type="button" className={styles.addButton}>
          Back
        </button>
      </Link>
      <button onClick={fileUpdate} type="button">
        Save
      </button>
    </div>
  );
}
