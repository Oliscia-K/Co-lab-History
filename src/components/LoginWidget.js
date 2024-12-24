import { signIn, signOut, useSession } from "next-auth/react";
import PropTypes from "prop-types";
import Image from "next/image";
import googleLogo from "../../public/googleLogo.svg";
import styles from "../styles/LoginWidget.module.css";

export default function LoginWidget({ size = "large" }) {
  const isLarge = size === "large";
  const { data: session } = useSession();

  const renderButton = () => {
    if (isLarge) {
      return (
        <div>
          <button
            className={styles.GoogleSignInButton}
            type="button"
            onClick={() => signIn("google")}
          >
            <Image
              src={googleLogo}
              alt="google logo"
              className={styles.GoogleLogo}
            />
            Sign in with Google
          </button>
        </div>
      );
    }
    return (
      <div>
        <button
          className={styles.signIn}
          type="button"
          onClick={() => signIn("google")}
        >
          Sign in
        </button>
      </div>
    );
  };

  if (session) {
    return (
      <div>
        <button className={styles.signOut} type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
    );
  }
  return renderButton();
}

LoginWidget.propTypes = {
  size: PropTypes.oneOf(["large", "small"]),
};
