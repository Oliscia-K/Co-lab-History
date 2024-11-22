/* eslint-disable no-console */
import { TextField, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
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
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Search for Profiles</h1>
        <div>
          <Box
            sx={{ display: "flex", justifyContent: "center", margin: "auto" }}
          >
            {visibility === "hidden" && (
              <TextField
                label="Search"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={visibility === "visible"}
                sx={{ width: "50%" }}
                slotProps={{
                  input: { startAdornment: <SearchOutlinedIcon /> },
                }}
              />
            )}
          </Box>

          {visibility === "visible" && (
            <ClassesCheckBox
              classes={classes}
              filters={filters}
              setFilters={setFilters}
            />
          )}

          <Button
            sx={{
              fontSize: 8,
              paddingInline: 3,
              paddingBlock: 1,
              margin: "20px",
              backgroundImage: "linear-gradient(to right, #376DFE , #0ED7FE)",
              width: "90px",
              height: "30px",
            }}
            onClick={
              visibility === "visible" ? handleSearchClass : handleSearchName
            }
            variant="contained"
          >
            Search
          </Button>

          <Button
            sx={{
              fontSize: 8,
              paddingInline: 3,
              paddingBlock: 1,
              margin: "20px",
              color: "#376DFE",
              boxShadow: 3,
              width: "90px",
              height: "30px",
              padding: "8px",
            }}
            onClick={handleVisibility}
          >
            Toggle Filters
          </Button>
        </div>
      </div>

      <div>{profiles && <DisplaySearchResults profiles={profiles} />}</div>
    </div>
  );
}
