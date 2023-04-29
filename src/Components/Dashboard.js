// Importing necessary components from Material UI and other components
import {
    Box,
    Container,
    Grid,
    Pagination,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import SearchBar from "./SearchBar";

// Defining the Dashboard component
const Dashboard = () => {
    // Defining state variables using the useState hook
    const [page, setPage] = useState(1); // current page number
    const [resInfo, setResInfo] = useState(null); // info about the fetched data
    const [loading, setLoading] = useState(true); // loading state
    const [characters, setCharacters] = useState([]); // array of characters
    const [showPagination, setShowPagination] = useState(true); // boolean to determine whether to show pagination or not
    const [noDataText, setNoDataText] = useState("No Characters found"); // displays the no data text

    // Fetching characters data on component mount and when page number changes
    useEffect(() => {
        getCharacters();
    }, [page]);

    // Function to fetch characters data using the Rick and Morty API
    const getCharacters = async (searchText) => {
    // Resetting state variables
        setCharacters([]);
        setLoading(true);
        setShowPagination(!searchText);
        try {
            let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
            if (searchText) {
                url = `https://rickandmortyapi.com/api/character/?name=${searchText}`;
            }
            // Fetching data from API
            const res = await fetch(url);
            const json = await res.json();
            // Updating state variables with fetched data
            if(json.info && json.results){
                setResInfo(json.info);
                setCharacters(json.results);
            }else {
                setNoDataText(json.error);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    // Function to handle pagination change
    const handleChange = (e, value) => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        setPage(value);
    };

    // Rendering the Dashboard component
    return (
        <Container maxWidth="lg" sx={{ paddingX: 3, paddingY: 4 }}>
            <Typography
                variant="h1"
                sx={{
                    fontSize: "40px",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    textAlign: "center",
                    letterSpacing: 1,
                    color: "#176ede",
                }}
            >
               Rick N Morty
            </Typography>
            {/* Search bar component */}
            <SearchBar getCharacters={getCharacters} />
            {/* Loading state */}
            {loading ? (
                <Grid container spacing={3} sx={{ marginY: 4 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((loader) => (
                        <Grid item xs={6} sm={4} md={3} key={loader}>
                            <Skeleton variant="rounded" height={250} />
                        </Grid>
                    ))}
                </Grid>
            ) : characters?.length > 0 ? ( // Displaying characters data if it exists
                <Box sx={{ marginY: 4 }}>
                    <Grid container spacing={3}>
                        {characters?.map((character) => {
                            return (
                                <Grid item xs={6} sm={4} md={3} key={character.id}>
                                    <ProfileCard character={character} />
                                </Grid>
                            );
                        })}
                    </Grid>
                    {/* Pagination */}
                    {showPagination && (
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ marginTop: 4 }}
                        >
                            <Pagination
                                count={resInfo?.pages}
                                variant="outlined"
                                shape="rounded"
                                color="primary"
                                page={page}
                                onChange={handleChange}
                            />
                        </Stack>
                    )}
                </Box>
            ) : ( // if no characters found
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        height: "50vh",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ textAlign: "center", color: grey[400] }}
                    >
                        {noDataText}
                    </Typography>
                </Box>
            )}
        </Container>
    );
};
  
export default Dashboard;
  