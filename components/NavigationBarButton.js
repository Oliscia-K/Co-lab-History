import { useState } from "react";
import NavigationBar from "./NavigationBar";
import styles from "../src/styles/Navigation.module.css";

export default function NavigationBarButton() {
  const [isActive, setActive] = useState(false);

  const handleClick = () => {
    setActive((prevState) => !prevState);
  };

  return (
    <div className={styles.navwrapper}>
      <NavigationBar isActive={isActive} />
      <button type="button" className={styles.navbutton} onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="50"
          height="50"
          viewBox="0 0 50 50"
        >
          <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z" />
        </svg>
      </button>
    </div>
  );
}
