/* eslint-disable no-console */
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Editor from "../../../../components/Editor";

export default function EditMain({ currentUser }) {
  const router = useRouter();
  const { data: session } = useSession();

  if (!currentUser && session) {
    router.push("/");
    return <div>Redirecting...</div>;
  }

  const handleComplete = async (newUser) => {
    if (newUser) {
      try {
        // const response = await fetch(`/api/user/${currentUser.id}/userProfile`, {
        const response = await fetch(`/api/editProfile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: 1, // currentUser.id,
            name: newUser.name,
            email: "test@middlebury.edu",
            pronouns: newUser.pronouns,
            major: "Computer Science",
            "grad-year": newUser.gradYear,
            "profile-pic": [],
            bio: newUser.bio,
            interests: newUser.projectInterests,
            classes: [
              {
                name: "CSCI 318",
                status: "in progress",
              },
            ],
            partners: [
              {
                name: "Oliscia Thornton",
                email: "okthornton@middlebury.edu",
              },
              {
                name: "Seunghwan Oh",
                email: "seunghwano@middlebury.edu",
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // const updatedUser = await response.json();

        // setCurrentUser(updatedUser);

        router.push(`/user/${currentUser.id}/userProfile`);
      } catch (error) {
        console.error("Error updating article:", error);
      }
    } else {
      router.back();
    }
  };

  return (
    <Editor
      complete={handleComplete}
      currentUser={{
        id: currentUser?.id,
        name: currentUser?.name,
        pronouns: currentUser?.pronouns,
        major: currentUser?.major,
        gradYear: currentUser?.["grad-year"],
        bio: currentUser?.bio,
        projectInterests: currentUser?.interests,
      }}
    />
  );
}

EditMain.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
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
