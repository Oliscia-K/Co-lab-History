/* eslint-disable no-nested-ternary */
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

  return (
    <div data-testid="scrollbar" className={styles.classesContainer}>
      {classesTaken && classesTaken.length > 0 ? (
        <ul>
          {classesTaken.map((classItem) => {
            // Only map classItem if classItem.name exists, so this will stop flashing of bullet points
            if (!classItem.name) return null; // Skip rendering if there is no class
            return (
              <li key={classItem.name}>
                {classItem.name}
                {classItem.name && classItem.name.length > 1 && (
                  <>
                    {" - "}
                    {classItem.progress ? "completed" : "in progress"}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

ClassesScrollBar.propTypes = {
  classesTaken: PropTypes.arrayOf(ClassShape).isRequired,
};
