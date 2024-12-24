/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ClassesScrollBar from "../../../../components/ClassesScrollBar";
import styles from "../../../styles/editClasses.module.css";

export default function ProfileAddPartners() {
  const [user, setUserData] = useState();
  const [classesTaken, setClassesTaken] = useState([{}]);
  const [savedClasses, setSavedClasses] = useState([]);
  const [newClass, setNewClass] = useState("");
  const [allClasses, setAllClasses] = useState([{}]);
  const [progress, setProgress] = useState("");
  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const router = useRouter();

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
        setSavedClasses(data.classes || []);
      })
      .catch((error) => console.log(error));
  }, [userId]);

  // Handle adding a new class
  const handleAddClass = () => {
    if (newClass && progress) {
      const existingClassIndex = classesTaken.findIndex(
        (cls) => cls.name === newClass,
      );

      if (existingClassIndex !== -1) {
        // If the class already exists, update its progress
        setClassesTaken((prevClasses) =>
          prevClasses.map((cls, index) =>
            index === existingClassIndex
              ? { ...cls, progress: progress === "Completed" }
              : cls,
          ),
        );
      } else {
        // Add a new class if it doesn't already exist
        const selectedClass = allClasses.find((cls) => cls.name === newClass);
        if (selectedClass) {
          setClassesTaken((prevClasses) => [
            ...prevClasses,
            { ...selectedClass, progress: progress === "Completed" },
          ]);
        }
      }

      // Reset the dropdowns after adding or updating
      setNewClass("");
      setProgress("");
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

  // Check if there are unsaved changes
  const hasUnsavedChanges =
    JSON.stringify(classesTaken) !== JSON.stringify(savedClasses);

  return (
    <div className={styles.container}>
      {showSavedPopup && <div className={styles.savedPopup}>Saved!</div>}

      <div className={styles.classesContainer}>
        <h2 className={styles.title}>Add Classes</h2>
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
            {allClasses
              .sort((a, b) => a.number - b.number)
              .map((cls) => (
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
              Not Defined
            </option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={`${styles.button} ${styles.addButton}`}
            onClick={handleAddClass}
          >
            Add
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => router.push("/editProfile/classes")}
          >
            Back
          </button>
          <button
            onClick={fileUpdate}
            type="button"
            className={`${styles.button} ${!hasUnsavedChanges ? styles.disabledSaveButton : styles.enabledSaveButton}`}
            disabled={!hasUnsavedChanges}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
