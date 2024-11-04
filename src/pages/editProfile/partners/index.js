/* eslint-disable @next/next/no-html-link-for-pages */
import ScrollBar from "../../../../components/ScrollBar";
// import { useRouter } from "next/router";

export default function EditPartners() {
  // const router = useRouter();

  const previousPartners = [
    { id: 1, name: "Previous Partner 1" },
    { id: 2, name: "Previous Partner 2" },
    { id: 3, name: "Previous Partner 3" },
  ];

  // add complete function that works with data base

  return (
    <div>
      <h2>Edit Partners</h2>
      <ScrollBar previousPartners={previousPartners} />
      <a href="/editProfile/partners/add">
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