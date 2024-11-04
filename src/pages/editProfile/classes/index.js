import PropTypes from "prop-types";
import { useRouter } from "next/router";
import ClassesEditor from "../../../../components/ClassesEditor";

export default function EditMain({ currentUser }) {
  const router = useRouter();

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
        router.push(`/api/user/${currentUser.id}/userProfile`);
      } catch (error) {
        console.error("Error updating article:", error);
      }
    } else {
      router.back();
    }
  };

  return (
    <ClassesEditor
      complete={handleComplete}
      currentUser={{
        id: currentUser.id,
        id: currentUser.classes,
      }}
    />
  );
}

EditMain.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    classesTaken: PropTypes.string,
  }),
  // setCurrentUser: PropTypes.func,
};

EditMain.defaultProps = {
  currentUser: {
    id: 1,
  },
};
