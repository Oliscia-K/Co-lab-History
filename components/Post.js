import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Post({ title, content, creator, edited }) {
  const [user, setUser] = useState();

  useEffect(() => {
    if (!user) {
      fetch(`/api/login?email=${creator}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setUser(data[0]);
        })
        .catch((error) => console.error("Fetch error:", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <div>
      <h3>
        <Link href={`/user/${user?.id}/userProfile`}>
          {user?.name ?? "loading"}
        </Link>
      </h3>
      <h2>{title}</h2>
      <p>{content}</p>
      <p>{edited}</p>
    </div>
  );
}

Post.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  creator: PropTypes.string,
  edited: PropTypes.string,
};
