/* eslint-disable @next/next/no-html-link-for-pages */
import ScrollBar from "../../../../components/ScrollBar";

export default function ProfileAddPartners() {
  const previousPartners = [
    { id: 1, name: "Previous Partner 1" },
    { id: 2, name: "Previous Partner 2" },
    { id: 3, name: "Previous Partner 3" },
  ];

  return (
    <div>
      <h2>Add Partners</h2>
      <ScrollBar previousPartners={previousPartners} />
      <input placeholder="Full Name" />
      <input placeholder="email@middlebury.edu" />
      <a href="/">
        <button type="button">Cancel</button>
      </a>
      <a href="/">
        <button type="button">Save</button>
      </a>
    </div>
  );
}
