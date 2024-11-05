import PropTypes from "prop-types";
import styles from "../src/styles/Classes.module.css";
import ClassShape from "./ClassShape";

export default function ClassesScrollBar( {classesTaken} ) {

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
  <div className={styles.classesContainer}> </div>
  )
}
  
ClassesScrollBar.propTypes = {
  classesTaken: PropTypes.arrayOf(ClassShape).isRequired,
};