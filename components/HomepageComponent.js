/* eslint-disable no-console */
import { TextField, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import DisplaySearchResults from "./DisplaySearchResults";
import ClassesCheckBox from "./ClassesCheckBox";

export default function HomepageComponent() {
  const [name, setName] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState([]);
  const [visibility, setVisibility] = useState("hidden");

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

  // If visible, search by classes. Otherwise search by name
  const handleSearchClass = async () => {
    try {
      const response = await fetch("/api/searchByClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classes: filters }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfiles(data[0]);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleVisibility = () => {
    if (visibility === "visible") {
      setVisibility("hidden");
    } else {
      setVisibility("visible");
    }
  };

  // Search with name
  const handleSearchName = async () => {
    try {
      let response;
      // if empty, searches all names in database.
      if (name !== "") {
        response = await fetch(`/api/homepage?name=${name}`);
      } else {
        response = await fetch("/api/homepage");
      }
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setProfiles(null);
    }
  };

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

          <Button onClick={handleVisibility} variant="contained">
            Toggle Search By Class
          </Button>

          {visibility === "visible" && (
            <ClassesCheckBox
              classes={classes}
              filters={filters}
              setFilters={setFilters}
              visibility={visibility}
            />
          )}

          <Button
            onClick={
              visibility === "visible" ? handleSearchClass : handleSearchName
            }
            variant="contained"
          >
            Search
          </Button>
          {profiles && <DisplaySearchResults profiles={profiles} />}
        </div>
      </div>
    </div>
  );
}
