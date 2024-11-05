/* eslint-disable @next/next/no-html-link-for-pages */
import ClassesScrollBar from "../../../../components/ClassesScrollBar";
// import { useRouter } from "next/router";

export default function EditPartners() {
  // const router = useRouter();

  const classesTaken = [
    { id: 1, name: "CS201" },
    { id: 2, name: "CS202" },
    { id: 3, name: "CS318" },
  ];

  // add complete function that works with data base

  return (
    <div>
      <h2>Edit Partners</h2>
      <ClassesScrollBar classesTaken={classesTaken} />
      <a href="/editProfile/classes/add">
        <button type="button">Add</button>
      </a>
      <a href="/">
        <button type="button">Cancel</button>
      </a>
      <a href="/">
        <button type="button">Save</button>
      </a>
    </div>
  );
}
