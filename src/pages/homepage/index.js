/* eslint-disable no-console */
import { TextField, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import DisplaySearchResults from "../../../components/DisplaySearchResults";
import ClassesCheckBox from "../../../components/ClassesCheckBox";

export default function Homepage() {
  const [name, setName] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [classes, setClasses] = useState([]);
  const list = ["hi", "bye"];
  console.log(list.includes("hi"));

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
  }, [classes]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/searchByName?name=${name}`);
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
            <Select label="Filters">
              <ClassesCheckBox classes={classes} />
            </Select>
          </Box>

          <Button onClick={handleSearch} variant="contained">
            Search
          </Button>
          {profiles && <DisplaySearchResults profiles={profiles} />}
        </div>
      </div>
    </div>
  );
}
