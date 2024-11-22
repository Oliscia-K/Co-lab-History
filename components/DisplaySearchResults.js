import PropTypes from "prop-types";
import ProfileComponent from "./ProfileComponent";

export default function DisplaySearchResults({ profiles }) {
  if (profiles.length > 0) {
    return (
      <div
        style={{
          height: "50vh",
          width: "50%",
          overflowY: "auto",
          borderRadius: 10,
          border: "1px solid #C4C4C4",
          margin: "auto",
          backgroundColor: "#F8F8F8",
          paddingLeft: 2,
        }}
      >
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {profiles.map((profile) => (
            <li key={profile.id} data-testid="profile">
              <a
                style={{ textDecoration: "none" }}
                href={`/user/${profile.id}/userProfile`}
              >
                <ProfileComponent size="small" user={profile} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

DisplaySearchResults.propTypes = {
  profiles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      pronouns: PropTypes.string,
      email: PropTypes.string,
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
    }),
  ),
};
