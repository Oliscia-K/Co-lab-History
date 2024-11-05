import PropTypes from "prop-types";
import styles from "../src/styles/Classes.module.css";
import ClassShape from "./ClassShape";
import { useState } from "react";
import { useRouter } from "next/router";

export default function ClassesScrollBar(classesTaken) {

  classesTaken.forEach((element) => {
    console.log(element.name);
  });

  if (classesTaken.length > 0) {
    return (
      <div className={styles.classesContainer}>
        <ul>
          {classesTaken.map((classes) => (
            <li key={classes.id}>{classes.name}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
  <div className={styles.classesContainer}>
    <ul>
      {classesTaken.map((classItem) => (
        <li key={classItem.id}>{classItem.name}</li>
      ))}
    </ul>
    
    <input
      type="text"
      value={newClass}
      onChange={(e) => setNewClass(e.target.value)}
      placeholder="Enter class name"
      className={styles.inputField}
    />
    
    <button onClick={handleAdd} className={styles.addButton}>Add</button>
    <button onClick={handleSave} className={styles.saveButton}>Save</button>
    <button onClick={handleCancel} className={styles.saveButton}>Cancel</button>
  </div>
  )
}
  
ClassesScrollBar.propTypes = {
  classesTaken: PropTypes.arrayOf(ClassShape).isRequired,
};