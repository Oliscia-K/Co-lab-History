/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ClassesScrollBar from "../../../../components/ClassesScrollBar";

export default function ProfileAddPartners() {
  const [user, setUserData] = useState();
  const [classesTaken, setClassesTaken] = useState([{}]);
  const [newClass, setNewClass] = useState("");
  const [allClasses, setAllClasses] = useState([{}]);
  const [progress, setProgress] = useState({});
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
    fetch("/api/editProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
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
      {showSavedPopup && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor: "lightgreen",
            padding: "10px",
            borderRadius: "5px",
            color: "green",
            fontWeight: "bold",
          }}
        >
          Saved!
        </div>
      )}
      <ClassesScrollBar classesTaken={classesTaken}>
        {classesTaken.map((cls) => (
          <div key={cls.name} style={{ display: "flex", alignItems: "center" }}>
            <span>{cls.name}</span>
            <select
              value={cls.status}
              onChange={(e) => handleStatusChange(cls.name, e.target.value)}
              style={{ marginLeft: "10px" }}
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        ))}
      </ClassesScrollBar>

      <div>
        <label htmlFor="classDropdown">Choose a class: </label>
        <select
          id="classDropdown"
          onChange={(e) => setNewClass(e.target.value)}
          value={newClass}
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
        >
          <option value="" disabled>
            In Progress?
          </option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="button" onClick={handleAddClass}>
          Add
        </button>
      </div>
      <Link href="/editProfile/classes">
        <button type="button">Cancel</button>
        <button onClick={fileUpdate} type="button">
          Save
        </button>
      </Link>
      <button
        onClick={fileUpdate}
        type="button"
        disabled={!newClass || !progress}
        style={{
          backgroundColor: !newClass || !progress ? "grey" : "blue",
          cursor: !newClass || !progress ? "not-allowed" : "pointer",
          color: "white",
        }}
      >
        Save
      </button>
    </div>
  );
}
