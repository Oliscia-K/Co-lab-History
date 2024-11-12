import React from "react";
import PropTypes from "prop-types";
import { FormControlLabel, Checkbox, FormGroup, Box } from "@mui/material";
import ClassShape from "./ClassesShape";

export default function ClassesCheckBox({ classes }) {
  if (classes.length > 0) {
    return (
      <Box sx={{ minWidth: 120 }}>
        <FormGroup>
          {classes.map((cls) => (
            <FormControlLabel
              key={cls.id} // Assuming each class has a unique 'id' property
              control={<Checkbox />}
              label={`CSCI ${cls.number}: ${cls.name}`}
            />
          ))}
        </FormGroup>
      </Box>
    );
  }

  return (
    <div>
      <p>No classes available.</p>
    </div>
  );
}

ClassesCheckBox.propTypes = {
  classes: PropTypes.arrayOf(ClassShape),
};
