/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
// import PropTypes from "prop-types";
// import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

/* App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}),
}; */
