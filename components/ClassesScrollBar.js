/* eslint-disable no-console */
import PropTypes from "prop-types";
import styles from "../src/styles/Classes.module.css";
import ClassShape from "./ClassesShape";

export default function ClassesScrollBar({ classesTaken }) {
  classesTaken.forEach((element) => {
    console.log(
      `${element.name}: ${element.progress ? "completed" : "in progress"}`,
    );
    console.log(element.progress);
  });
  console.log("classesTaken:", classesTaken.length);

  if (classesTaken.length > 0) {
    return (
      <div data-testid="scrollbar" className={styles.classesContainer}>
        <ul>
          {classesTaken.map((classItem) => (
            <li key={classItem.name}>
              {classItem.name} -{" "}
              {classItem.progress ? "completed" : "in progress"}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <div className={styles.classesContainer}> </div>;
}

ClassesScrollBar.propTypes = {
  classesTaken: PropTypes.arrayOf(ClassShape).isRequired,
};
