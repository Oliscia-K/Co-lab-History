/* eslint-disable @next/next/no-html-link-for-pages */
import Link from "next/link";
import ClassesScrollBar from "../../../../components/ClassesScrollBar";
// import { useRouter } from "next/router";

export default function EditClasses() {
  // const router = useRouter();

  const classesTaken = [
    { id: 1, name: "CS201" },
    { id: 2, name: "CS202" },
    { id: 3, name: "CS318" },
  ];

  // add complete function that works with data base

  return (
    <div>
      <h2>Edit Classes</h2>
      <ClassesScrollBar classesTaken={classesTaken} />
      <Link href="/editProfile/classes/add">
        <button type="button">Add</button>
      </Link>
      <Link href="/">
        <button type="button">Cancel</button>
      </Link>
      <Link href="/">
        <button type="button">Save</button>
      </Link>
    </div>
  );
}
