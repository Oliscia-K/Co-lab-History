/* eslint-disable @next/next/no-html-link-for-pages */
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import ClassesScrollBar from "../../../../components/ClassesScrollBar";
import Link from "next/link";

export default function EditClasses({ currentUser }) {
  const router = useRouter();
  const { data: session } = useSession();

  if (!currentUser && session) {
    router.push("/");
    return <div>Redirecting...</div>;
  }

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

EditClasses.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    pronouns: PropTypes.string,
    major: PropTypes.string,
    "grad-year": PropTypes.string,
    "profile-pic": PropTypes.arrayOf(PropTypes.number),
    bio: PropTypes.string,
    interests: PropTypes.string,
    classes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        status: PropTypes.string,
      }),
    ),
    partners: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
      }),
    ),
  }).isRequired,
};
