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
  Chip,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
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

    setFilters(value);
  };

  if (classes.length > 0) {
    return (
      <Box sx={{ visibility: { visibility }, marginTop: "10px" }}>
        <FormControl fullWidth sx={{ margin: "auto", width: "50%" }}>
          <InputLabel>Filters</InputLabel>
          <Select
            onChange={handleChange}
            value={filters}
            multiple
            slotProps={{ input: { startAdornment: <FilterAltOutlinedIcon /> } }}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map(
                  (value) =>
                    classes.find((cls) => cls.number === value) && (
                      <Chip
                        key={value}
                        label={`CSCI ${value}: ${classes.find((cls) => cls.number === value)?.name}`}
                      />
                    ),
                )}
              </Box>
            )}
          >
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.number}>
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
