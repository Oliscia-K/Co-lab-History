/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import PropTypes from "prop-types";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [currentUser, setCurrentUser] = useState();
  const props = {
    ...pageProps,
    currentUser,
    setCurrentUser,
  };
  return (
    <SessionProvider session={session}>
      <Component {...props} />
    </SessionProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};
