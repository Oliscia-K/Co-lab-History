import PropTypes from "prop-types";
import styles from "../src/styles/Partners.module.css";

export default function DisplaySearchResults({ profiles }) {
  if (profiles.length > 0) {
    return (
      <div className={styles.partnersContainer}>
        <ul>
          {profiles.map((profile) => (
            <li key={profile.id} data-testid="profile">
              {profile.name}
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
