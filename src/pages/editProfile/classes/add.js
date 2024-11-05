/* eslint-disable @next/next/no-html-link-for-pages */
import ClassesScrollBar from "../../../../components/ClassesScrollBar";

export default function ProfileAddPartners() {
  const classesTaken = [
    { id: 1, name: "CS201" },
    { id: 2, name: "CS202" },
    { id: 3, name: "CS318" },
  ];

  return (
    <div>
      <h2>Add Classes</h2>
      <ClassesScrollBar classesTaken={classesTaken} />
      <input placeholder="Class name (ex: CS145)" />
      <a href="/editProfile/classes">
        <button type="button">Cancel</button>
      </a>
    </div>
  );
}
