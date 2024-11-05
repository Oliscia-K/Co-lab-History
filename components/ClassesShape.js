import PropTypes from "prop-types";

const ClassShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
});

export default ClassShape;
