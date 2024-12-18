import PropTypes from "prop-types";
import styles from "../src/styles/Partners.module.css";
import PartnerShape from "./PartnerShape";

export default function ScrollBar({ previousPartners }) {
  if (previousPartners.length > 0) {
    return (
      <div data-testid="scrollbar" className={styles.partnersContainer}>
        <ul>
          {previousPartners.map((partner) => (
            <li key={partner.id}>{partner.name}</li>
          ))}
        </ul>
      </div>
    );
  }

  return <div data-testid="scrollbar" className={styles.partnersContainer} />;
}

ScrollBar.propTypes = {
  previousPartners: PropTypes.arrayOf(PartnerShape).isRequired,
};
