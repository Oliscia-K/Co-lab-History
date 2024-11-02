import ScrollBar from "../../../../../components/ScrollBar";

export default function ProfileAddPartners() {
  const previousPartners = [
    { id: 1, name: "Previous Partner 1" },
    { id: 2, name: "Previous Partner 2" },
    { id: 3, name: "Previous Partner 3" },
  ];

  return (
    <div>
      <h2>Edit Partners</h2>
      <ScrollBar previousPartners={previousPartners} />
      <input />
      <input />
      <button type="button">Cancel</button>
      <button type="button">Save</button>
    </div>
  );
}
