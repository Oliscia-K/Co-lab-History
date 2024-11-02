import PropTypes from "prop-types";

const PartnerShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
});

export default PartnerShape;
