import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import styles from "../src/styles/Editor.module.css";

const UserShape = {
  id: PropTypes.number.isRequired,
  userName: PropTypes.string,
  userPronoun: PropTypes.string,
  userMajor: PropTypes.string,
  userGradYear: PropTypes.string,
  userBio: PropTypes.string,
  userProjectInterests: PropTypes.string,
};

const majors = ["Undeclared", "Computer Science"];
const gradYears = [
  "2024",
  "2024.5",
  "2025",
  "2025.5",
  "2026",
  "2026.5",
  "2027",
  "2027.5",
  "2028",
  "2028.5",
];

export default function Editor({ currentUser, complete }) {
  const [name, setName] = useState(currentUser?.name || "");
  const [pronouns, setPronouns] = useState(currentUser?.pronouns || "");
  const [major, setMajor] = useState(currentUser?.major || "");
  const [gradYear, setGradYear] = useState(currentUser?.gradYear || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [interests, setInterests] = useState(currentUser?.interests || "");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser?.name);
      setPronouns(currentUser?.pronouns);
      setMajor(currentUser?.major);
      setGradYear(currentUser?.["grad-year"]);
      setBio(currentUser?.bio);
      setInterests(currentUser?.interests);
    } else {
      setName("");
      setPronouns("");
      setMajor("");
      setGradYear("");
      setBio("");
      setInterests("");
    }
  }, [currentUser]);

  const handleSave = () => {
    const newUser = {
      id: currentUser?.id,
      name,
      email: currentUser?.email,
      pronouns,
      major,
      "grad-year": gradYear,
      bio,
      interests,
    };
    complete(newUser);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.topContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.basics}>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.basics}>
            Pronouns:
            <input
              type="text"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.basics}>
            Major:
            <select value={major} onChange={(e) => setMajor(e.target.value)}>
              <option value="">Select your major</option>
              {majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.basics}>
            Graduation Year:
            <select
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
            >
              <option value="">Select your graduation year</option>
              {gradYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.middleSection}>
          <div className={styles.bio}>
            <label className={styles.sectionHeader}>
              <h3>Bio:</h3>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </label>
          </div>
          <div className={styles.projectInterests}>
            <label className={styles.sectionHeader}>
              <h3>Project Interests:</h3>
              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
      <div>
        <button
          className={styles.submitButton}
          type="button"
          onClick={handleSave}
          disabled={!name}
        >
          Save
        </button>
        <button
          className={styles.cancelButton}
          type="button"
          onClick={() => complete()}
        >
          Cancel
        </button>
      </div>
      {!name && <p style={{ color: "red" }}>Name is required.</p>}{" "}
    </div>
  );
}

Editor.propTypes = {
  currentUser: PropTypes.shape(UserShape),
  complete: PropTypes.func.isRequired,
};
