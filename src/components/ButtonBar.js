/*
  ButtonBar.js

  The `ButtonBar` component is a simple collection of buttons.

  The bar has two states determined by `allowEdit`. If false, only an "Add" button is shown.
  If true, then "Add" and "Edit" are shown. 

  When a button is clicked, `handleClick` is called with "add", or "edit".

  props:
    allowEdit - a Boolean indicating if there is something that could be edited (required)
    handleClick - a function called when a button is clicked (required)
*/
import PropTypes from "prop-types";

export default function ButtonBar({ allowEdit, handleClick }) {
  const handleProfile = () => {
    handleClick("Edit Profile");
  };


  return (
    <div>
      <button type="button" onClick={handleProfile}>
        Edit Profile
      </button>
    </div>
  );
}

ButtonBar.propTypes = {
  allowEdit: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

