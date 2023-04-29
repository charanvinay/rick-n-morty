import CloseIcon from "@mui/icons-material/Close"; // Importing CloseIcon component from MUI icons library
import SearchIcon from "@mui/icons-material/Search"; // Importing SearchIcon component from MUI icons library
import { IconButton, InputBase, Paper } from "@mui/material"; // Importing IconButton, InputBase, and Paper components from MUI
import React, { useEffect, useState } from "react"; // Importing React, useEffect, and useState hooks

const SearchBar = ({ getCharacters }) => {
    // Declaring SearchBar functional component with a props object destructured to getCharacters function
    const [searchText, setSearchText] = useState(null); // Using useState hook to create searchText state and setSearchText state setter

    useEffect(() => {
    // Using useEffect hook to debounce API calls while the user types in the search bar
        let debounceTimer; // Defining a debounce timer variable
        if (searchText === "") {
            // If the search bar is empty, make the API call with an empty search string
            getCharacters(searchText);
        } else if (searchText != null) {
            // If the search bar is not empty, debounce the API call by waiting 400ms after the user stops typing
            debounceTimer = setTimeout(() => {
                console.log(searchText); // Logging the search string to the console
                getCharacters(searchText);
            }, 400);
        }
        return () => clearTimeout(debounceTimer); // Clearing the debounce timer when the component unmounts or the search string changes
    }, [searchText]); // Re-running the useEffect hook whenever searchText state changes

    return (
        <Paper
            component="form"
            elevation={0}
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                position: "sticky",
                zIndex: 2,
                top: "5px"
            }}
        >
            {/* Adding a search button with an icon using MUI's IconButton component */}
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                {/* Adding a search icon using MUI's SearchIcon component */}
                <SearchIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Character"
                inputProps={{ "aria-label": "search character" }}
                value={searchText}
                onKeyUp={(e) => {
                    setSearchText(e.target.value); // Updating the searchText state whenever the user types in the search bar
                }}
                onChange={(e) => {
                    e.preventDefault(); // Preventing the default form submission behavior
                    setSearchText(e.target.value); // Updating the searchText state whenever the user types in the search bar
                }}
            />
            {searchText && ( // If searchText is not empty, add a close button to clear the search bar
                <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                    onClick={() => setSearchText("")}
                >
                    {/* Adding a close icon using MUI's CloseIcon component */}
                    <CloseIcon />
                </IconButton>
            )}
        </Paper>
    );
};

export default SearchBar; // Exporting SearchBar component as default
