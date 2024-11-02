import ClassesScrollBar from "../components/ClassesScrollBar";

export default function MainApp() {
  const classesTaken = [
    { id: 1, name: "CSCI 201" },
    { id: 2, name: "CSCI 202" },
    { id: 3, name: "CSCI 318" },
  ];

  return (
    <div>
        <h2>Edit Classes</h2>
        <ClassesScrollBar classesTaken={classesTaken} />
        <button type="button">Add</button>
        <button type="button">Cancel</button>
        <button type="button" onClick={handleSave} disabled={!title}>Save</button>
    </div>
    
  );
}
