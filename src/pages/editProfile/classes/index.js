/* eslint-disable @next/next/no-html-link-for-pages */
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ClassesScrollBar from "../../../../components/ClassesScrollBar";
import Link from "next/link";

export default function EditClasses({ currentUser }) {
  const [classesTaken, setClassesTaken] = useState([{}]);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!currentUser && session) {
    router.push("/");
    return <div>Redirecting...</div>;
  }

  useEffect(() => {
    fetch(`/api/user/${userId}/userProfile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setClassesTaken(data.classes);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h2>Edit Classes</h2>
      <ClassesScrollBar classesTaken={classesTaken} />
      <Link href="/editProfile/classes/add">
        <button type="button">Add</button>
      </Link>
      <Link href={`/user/${userId}/userProfile`}>
        <button type="button">Back</button>
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
