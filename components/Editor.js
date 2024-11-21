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
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.smallName}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <label className={styles.pronouns}>
          Pronouns:
          <input
            type="text"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
          />
        </label>
        <label className={styles.major}>
          Major:
          <select value={major} onChange={(e) => setMajor(e.target.value)}>
            <option value="">Select your major</option>
            {majors.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label>
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
        </label>
      </div>
      <div className={styles.middleSection}>
        <div className={styles.sectionHeader}>
          <label className={styles.bio}>
            <h3>Bio:</h3>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </label>
        </div>
        <div className={styles.sectionHeader}>
          <label className={styles.projectInterests}>
            <h3>Project Interests:</h3>
            <textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div>
        <a href={`/user/${currentUser.id}/userProfile`}>
          <button type="button" onClick={handleSave} disabled={!name}>
            Save
          </button>
        </a>
        <a href={`/user/${currentUser.id}/userProfile`}>
          <button type="button" onClick={() => complete()}>
            Cancel
          </button>
        </a>
      </div>
      {!name && <p style={{ color: "red" }}>Name is required.</p>}{" "}
    </div>
  );
}

Editor.propTypes = {
  currentUser: PropTypes.shape(UserShape),
  complete: PropTypes.func.isRequired,
};
