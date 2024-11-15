/* eslint-disable no-console */
import { TextField, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import DisplaySearchResults from "./DisplaySearchResults";
import ClassesCheckBox from "./ClassesCheckBox";

export default function HomepageComponent() {
  const [name, setName] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [classes, setClasses] = useState([]);
  // create the props for checks
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    async function getClasses() {
      try {
        const response = await fetch("/api/classes");
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Fetching sections failed:", error);
        }
      }
    }
    if (!classes.length) {
      getClasses();
    }
  });

  // handle lowercase and uppercase search
  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/homepage?name=${name}`);
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setProfiles(null);
    }
  };

  // console.log(checked);

  return (
    <div>
      <div style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            flexGrow: 1, // Takes up all available space
            display: "flex", // Uses flexbox for its children
            flexDirection: "column", // Stacks children vertically
            alignItems: "center", // Centers children horizontally
          }}
        >
          <h1>Homepage</h1>
          <Box>
            <TextField
              label="Search by Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>

          <ClassesCheckBox
            classes={classes}
            filters={filters}
            setFilters={setFilters}
          />

          <Button onClick={handleSearch} variant="contained">
            Search
          </Button>
          {profiles && <DisplaySearchResults profiles={profiles} />}
        </div>
      </div>
    </div>
  );
}
