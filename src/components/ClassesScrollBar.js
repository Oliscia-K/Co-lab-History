import PropTypes from "prop-types";
import styles from "../../src/styles/Classes.module.css";
import ClassShape from "./ClassShape";

export default function ClassesScrollBar({ classesTaken: initialClassesTaken }) {
    const [classesTaken, setClassesTaken] = useState(initialClassesTaken);
    const [newClass, setNewClass] = useState("");

    const handleAdd = () => {
        if (newClass.trim()) {
            const newClassObject = {
                id: Date.now(),
                name: newClass,
            };
            setClassesTaken([...classesTaken, newClassObject]);
            setNewClass("")
        }
    }

  const handleSave = () => {
    console.log("Classes Taken:", classesTaken);
  };
  
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
    </div>
    )
  }
  
  ScrollBar.propTypes = {
    classesTaken: PropTypes.arrayOf(ClassShape).isRequired,
  };