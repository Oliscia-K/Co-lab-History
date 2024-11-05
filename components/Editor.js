import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import styles from "../src/styles/Editor.module.css";

const UserShape = {
  id: PropTypes.number.isRequired,
  userName: PropTypes.string,
  userPronoun: PropTypes.string,
  userBasics: PropTypes.string,
  userBio: PropTypes.string,
  userProjectInterests: PropTypes.string,
};

const majors = ["Undeclared", "Computer Science"];
const gradYears = ["2025", "2026", "2027", "2028"];

export default function Editor({ currentUser, complete }) {
  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [major, setMajor] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [bio, setBio] = useState("");
  const [projectInterests, setProjectInterests] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setPronouns(currentUser.pronouns || "");
      setMajor(currentUser.major || "");
      setGradYear(currentUser.gradYear || "");
      setBio(currentUser.bio || "");
      setProjectInterests(currentUser.projectInterests || "");
    } else {
      setName("");
      setPronouns("");
      setMajor("");
      setGradYear("");
      setBio("");
      setProjectInterests("");
    }
  }, [currentUser]);

  const handleSave = () => {
    const newUser = {
      id: currentUser?.id,
      name,
      email: "",
      pronouns,
      major,
      gradYear,
      bio,
      projectInterests,
    };
    complete(newUser);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.nameSection}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <label className={styles.pronouns}>
          Pronoun:
          <input
            type="text"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
          />
        </label>
        <label>
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
        <label className={styles.bio}>
          Bio:
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <label className={styles.projectInterests}>
          Project Interests:
          <textarea
            value={projectInterests}
            onChange={(e) => setProjectInterests(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button
          type="button"
          onClick={handleSave}
          disabled={
            !name || !pronouns
            /*
            !major ||
            !gradYear ||
            !bio ||
            !projectInterests
            */
          }
        >
          Save
        </button>
        <button type="button" onClick={() => complete()}>
          Cancel
        </button>
      </div>
      {!name && <p style={{ color: "red" }}>Name is required.</p>}{" "}
      {!pronouns && <p style={{ color: "red" }}>Pronoun is required.</p>}{" "}
      {!major && <p style={{ color: "red" }}>Major is required.</p>}{" "}
      {!gradYear && (
        <p style={{ color: "red" }}>Graduation Year is required.</p>
      )}{" "}
      {!bio && <p style={{ color: "red" }}>Bio is required.</p>}{" "}
      {!projectInterests && (
        <p style={{ color: "red" }}>Project Interests is required.</p>
      )}{" "}
    </div>
  );
}

Editor.propTypes = {
  currentUser: PropTypes.shape(UserShape),
  complete: PropTypes.func.isRequired,
};
