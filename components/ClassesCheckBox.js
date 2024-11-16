import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
  Box,
} from "@mui/material";
import ClassShape from "./ClassesShape";

export default function ClassesCheckBox({
  classes,
  filters,
  setFilters,
  visibility,
}) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setFilters(
      // On autofill we get a stringified value.
      // typeof value === "string" ? value.split(",") : value,
      value,
    );
  };

  // This has to be refactored
  if (classes.length > 0) {
    return (
      <Box sx={{ visibility: { visibility } }}>
        <FormControl>
          <InputLabel>Filters</InputLabel>
          <Select onChange={handleChange} value={filters} multiple>
            {classes.map((cls) => (
              <MenuItem key={`${cls.id}`} value={cls.number}>
                <Checkbox checked={filters.includes(cls.number)} />
                <ListItemText primary={`CSCI ${cls.number}: ${cls.name}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
  filters: PropTypes.arrayOf(String),
  setFilters: PropTypes.func,
  visibility: PropTypes.string,
};
