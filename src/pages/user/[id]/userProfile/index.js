/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../../../styles/ProfilePage.module.css";
import ProfileComponent from "../../../../../components/ProfileComponent";
import NavigationBarButton from "../../../../../components/NavigationBarButton";
import profileIcon from "../../../../../public/profile_image.svg";
import messageIcon from "../../../../../public/createPost_image.svg";

export default function UserProfile({ currentUser, setCurrentUser }) {
  const { data: session } = useSession({ required: true });
  const [displayUser, setDisplayUser] = useState();
  const router = useRouter();
  const { id } = router.query;
  const [isUser, setIsUser] = useState(true);
  const [registeredPartners, setRegisteredPartners] = useState({});

  useEffect(() => {
    if (session && currentUser === undefined) {
      fetch(`/api/login?email=${session.user.email}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          setCurrentUser(result[0]);
          if (id === result[0].id) {
            setDisplayUser(result[0]);
          }
        })
        .catch((error) => console.log(error));
    }
    if (Number(id) !== session?.user?.id) {
      fetch(`/api/user/${id}/userProfile`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setDisplayUser(data);
          setIsUser(false);
        })
        .catch((error) => console.log(error));
    } else {
      setDisplayUser(currentUser);
      setIsUser(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser, session]);

  useEffect(() => {
    const checkRegisteredPartners = async () => {
      if (displayUser?.partners) {
        console.log("displayUser.partners:", displayUser.partners);
        try {
          const registrationStatus = await Promise.all(
            displayUser.partners.map(async (partner) => {
              try {
                const response = await fetch(
                  `/api/login?email=${partner.email}`,
                );
                const data = await response.json();
                return { [partner.email]: data[0] };
              } catch (error) {
                console.error("Error checking partner registration:", error);
                return { [partner.email]: false };
              }
            }),
          );
          setRegisteredPartners(
            registrationStatus.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          );
          console.log("Registered partners:", registeredPartners);
        } catch (error) {
          console.error("Error in checkRegisteredPartners:", error);
        }
      }
    };

    checkRegisteredPartners();
  }, [displayUser?.partners]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div styles={{ display: "absolute", left: "0" }}>
        <NavigationBarButton />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <ProfileComponent size="large" user={displayUser} />
        <div className={styles.container}>
          {/* Middle Section: Bio and Project Interests with Edit Buttons */}
          <div className={styles.middleSection}>
            <div className={styles.bio}>
              <div className={styles.sectionHeader}>
                <h3>Bio:</h3>
                {isUser && (
                  <Link href="/editProfile/main/" className={styles.editButton}>
                    Edit
                  </Link>
                )}
              </div>
              <p>{displayUser ? displayUser.bio : "Loading bio..."}</p>
            </div>
            <div className={styles.projectInterests}>
              <div className={styles.sectionHeader}>
                <h3>Project Interests:</h3>
                {isUser && (
                  <Link href="/editProfile/main/" className={styles.editButton}>
                    Edit
                  </Link>
                )}
              </div>
              <p>
                {displayUser ? displayUser.interests : "Loading interests..."}
              </p>
            </div>
          </div>

          {/* Bottom Section: Classes and Past Partners with Edit Buttons */}
          <div className={styles.bottomSection}>
            <div className={styles.classes}>
              <div className={styles.sectionHeader}>
                <h3>Classes:</h3>
                {isUser && (
                  <Link
                    href="/editProfile/classes/"
                    className={styles.editButton}
                  >
                    Edit
                  </Link>
                )}
              </div>
              <ul>
                {displayUser ? (
                  displayUser.classes?.map((classItem) => (
                    <li
                      key={classItem.name}
                    >{`${classItem.name} - ${classItem.progress ? "completed" : "in progress"}`}</li>
                  ))
                ) : (
                  <li>Loading classes...</li>
                )}
              </ul>
            </div>
            <div className={styles.partner}>
              <div className={styles.sectionHeader}>
                <h3>Past Partners:</h3>
                {isUser && (
                  <Link
                    href="/editProfile/partners/"
                    className={styles.editButton}
                  >
                    Edit
                  </Link>
                )}
              </div>
              <ul>
                {displayUser ? (
                  displayUser.partners?.map((partner) => (
                    <li
                      key={partner.email}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <span>{partner.name}</span>
                      <a
                        href={`mailto:${partner.email}`}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <button
                          type="button"
                          style={{
                            padding: "2px 8px",
                            fontSize: "14px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          <Image
                            style={{
                              width: "2vh",
                              height: "2vh",
                              transition: "box-shadow 0.3s ease",
                              border: "none",
                              background: "none",
                              padding: "0",
                            }}
                            src={messageIcon}
                            alt="Email"
                          />
                        </button>
                      </a>
                      {registeredPartners[partner.email] && (
                        <button
                          type="button"
                          onClick={() => {
                            router.push(
                              `/user/${registeredPartners[partner.email].id}/userProfile`,
                            );
                          }}
                          style={{
                            padding: "2px 8px",
                            fontSize: "14px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          <Image
                            style={{
                              width: "2vh",
                              height: "2vh",
                              transition: "box-shadow 0.3s ease",
                              border: "none",
                              background: "none",
                              padding: "0",
                            }}
                            src={profileIcon}
                            alt="Profile"
                          />
                        </button>
                      )}
                    </li>
                  ))
                ) : (
                  <li>Loading partners...</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserProfile.propTypes = {
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
        id: PropTypes.number,
        name: PropTypes.string,
        email: PropTypes.string,
      }),
    ),
  }),
  setCurrentUser: PropTypes.func,
  otherUser: PropTypes.shape({
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
        id: PropTypes.number,
        name: PropTypes.string,
        email: PropTypes.string,
      }),
    ),
  }),
};
