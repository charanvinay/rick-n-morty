// Importing icons from MUI
import { MyLocation, SatelliteAlt } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";

// Importing components from MUI
import {
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Slide,
    Stack,
    Typography
} from "@mui/material";

// Importing React and an image file
import React, { useEffect, useState } from "react";
import GradientBLACK from "../Assets/20210113_083213.png";

// Importing a color object from MUI
import { grey } from "@mui/material/colors";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// A React function component that renders a profile card
const ProfileCard = (props) => {
    // Extracting props from the input parameter
    let { name, status, species, gender, image, location, origin, episode } =
    props.character;

    // Setting up state variables using useState hook
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [originData, setOriginData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [episodesData, setEpisodesData] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState("All");

    // useEffect hook is used to handle the API calls
    useEffect(() => {
    // Only fetch data when the dialog box is open
        if (open) {
            getCharacterDetails();
        }
    }, [open]);

    // Async function to fetch data for individual resources (location, origin, episode)
    const getIndividualDetails = async (url) => {
        setLoading(true);
        try {
            const res = await fetch(url);
            const json = await res.json();
            setLoading(false);
            return json;
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // Async function to fetch data for all resources related to a character
    const getCharacterDetails = async () => {
        if (location.url) {
            let location_data = await getIndividualDetails(location.url);
            setLocationData(location_data);
        }
        if (origin.url) {
            let origin_data = await getIndividualDetails(origin.url);
            setOriginData(origin_data);
        }
        if (episode?.length > 0) {
            let episode_data = [];
            for (let i = 0; i < episode.length; i++) {
                let episode_obj = await getIndividualDetails(episode[i]);
                episode_data.push(episode_obj);
            }
            console.log(episode_data);
            const group = episode_data.reduce((acc, curr) => {
                let [s] = curr.episode.split("E");
                acc[s] = acc[s] ? [...acc[s], curr] : [curr];
                return acc;
            }, {});
            console.log(group);
            setEpisodesData({ ...group });
        }
    };

    // Click handlers for dialog box
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Object to hold status colors
    const statusColor = { Alive: "#00ff0e", Dead: "red" };

    // Object to hold type icons
    const typeIcon = {
        "space station": <SatelliteAlt sx={{ fontSize: "16px" }} />,
        planet: <PublicIcon sx={{ fontSize: "16px" }} />,
    };

    const returnLocationItem = (data, title, icon) => {
        return (
            <>
                {data && ( // If the character has some data, display it
                    <Grid item sm={12} md={5} className="w-100">
                        <Stack spacing={1} direction="column" className="bg-light">
                            <Typography
                                variant="h6"
                                sx={{
                                    textTransform: "capitalize",
                                }}
                            >
                                {title}
                            </Typography>
                            <Stack spacing={1} direction="row">
                                {icon}
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        textTransform: "capitalize",
                                        lineHeight: 1,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {origin.name}
                                </Typography>
                            </Stack>
                            {data?.dimension && (
                                <Stack spacing={1} direction="row" alignItems="center">
                                    {typeIcon[data?.type?.toLowerCase()] || (
                                        <LanguageIcon sx={{ fontSize: "16px" }} />
                                    )}
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {data?.dimension}
                                    </Typography>
                                </Stack>
                            )}
                            {data?.residents && (
                                <Stack spacing={1} direction="row">
                                    <GroupsIcon sx={{ fontSize: "16px" }} />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            textTransform: "capitalize",
                                            lineHeight: 1,
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        {data?.residents?.length}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                    </Grid>
                )}
            </>
        );
    };

    const handleClick = (season) => {
        console.log(season);
        setSelectedSeason(season);
    };
    return (
        <Box sx={{ position: "relative" }}>
            {/* Card Component */}
            <Card
                sx={{
                    borderRadius: "10px",
                    position: "relative",
                    cursor: "pointer",
                    boxShadow:
            "1px 2px 2px hsl(0deg 0% 50% / 0.2), 2px 4px 4px hsl(0deg 0% 50% / 0.2), 4px 8px 8px hsl(0deg 0% 50% / 0.2), 8px 16px 16px hsl(0deg 0% 50% / 0.2), 16px 32px 32px hsl(0deg 0% 50% / 0.2)",
                }}
                onClick={handleClickOpen}
            >
                <Box sx={{ height: 250 }}>
                    <img
                        src={image}
                        alt={name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                        loading="lazy"
                    />
                </Box>
                {/* Card Content */}
                <CardContent
                    sx={{
                        width: "90%",
                        padding: "12px",
                        zIndex: 1,
                        position: "absolute",
                        bottom: 0,
                    }}
                >
                    <Typography
                        variant="h6"
                        color="white"
                        className="text-overflow"
                        sx={{
                            textTransform: "capitalize",
                            fontWeight: "bold",
                        }}
                    >
                        {name}
                    </Typography>
                    <div className="d-flex">
                        <LocationOnIcon sx={{ color: "#cbcaca", fontSize: "16px" }} />
                        <Typography
                            variant="subtitle2"
                            color="#cbcaca"
                            sx={{ lineHeight: 1 }}
                            className="text-overflow"
                        >
                            {location.name}
                        </Typography>
                    </div>
                </CardContent>
                {/* Gradient Overlay */}
                <div
                    style={{
                        backgroundImage:
              "linear-gradient(rgb(0 0 0 / 90%) 0%, transparent 50%)",
                        height: "60%",
                        position: "absolute",
                        top: "-20px",
                        zIndex: 0,
                        width: "100%",
                    }}
                />
                {/* Black Gradient Image */}
                <img
                    style={{
                        height: "60%",
                        position: "absolute",
                        bottom: "0px",
                        zIndex: 0,
                        width: "100%",
                    }}
                    alt={"Gradient"}
                    loading="lazy"
                    src={GradientBLACK}
                />
                {/* Card Content */}
                <CardContent
                    className="d-flex"
                    sx={{
                        width: "90%",
                        padding: "10px",
                        zIndex: 1,
                        position: "absolute",
                        top: 0,
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        color="white"
                        className="text-overflow"
                        sx={{
                            textTransform: "capitalize",
                            lineHeight: 1,
                        }}
                    >
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor: statusColor[status] || "#ccc",
                                borderRadius: "50%",
                                display: "inline-block",
                                marginRight: "5px",
                            }}
                        ></div>
                        {`${status} ${species}`}
                    </Typography>
                </CardContent>
            </Card>
            <Dialog
                open={open} // A boolean that controls whether the Dialog is visible or not
                onClose={handleClose} // A function that will be called when the Dialog is closed
                fullWidth={true} // If true, the Dialog will take up the full width of the screen
                maxWidth="md" // Specifies the maximum width of the Dialog
                TransitionComponent={Transition} // Specifies a custom Transition component to use for the Dialog
                aria-labelledby="alert-dialog-title" // A string that identifies the Dialog title for accessibility purposes
                aria-describedby="alert-dialog-description" // A string that describes the Dialog content for accessibility purposes
            >
                {/* The title of the Dialog, taken from the 'name' variable */}
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        textAlign: "center",
                        color: "#176ede",
                        letterSpacing: 0,
                        fontWeight: "bold",
                    }}
                >
                    {name}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                {/* The content of the Dialog */}
                <DialogContent dividers={true}>
                    <Stack
                        spacing={2}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {/* A grid that contains the character's origin and location */}
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item sm={12} md={2} className="w-100" sx={{display: "flex", alignItems:"center", justifyContent: "center", flexDirection: "column"}}>
                                {/* A container for the character image and status circle */}
                                <Box sx={{ height: 100, width: 100, position: "relative" }}>
                                    <img
                                        src={image}
                                        alt={name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            overflow: "hidden",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                        }}
                                        // Hints the browser to load the image lazily for performance optimization
                                        loading="lazy"
                                    />
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "5px",
                                            right: 10,
                                            width: "15px",
                                            height: "15px",
                                            backgroundColor: statusColor[status] || "#ccc", // The color of the status circle, based on the character's status
                                            borderRadius: "50%",
                                        }}
                                    ></div>
                                </Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        textTransform: "capitalize",
                                        lineHeight: 1,
                                        marginTop: 2,
                                    }}
                                >
                                    {/* A string that displays the character's gender and species */}
                                    {`${gender} ${species}`}
                                </Typography>
                            </Grid>
                            {/* Origin grid item */}
                            {returnLocationItem(
                                originData,
                                "Origin",
                                <MyLocation sx={{ fontSize: "16px" }} />
                            )}
                            {/* Location grid item */}
                            {returnLocationItem(
                                locationData,
                                "Location",
                                <LocationOnIcon sx={{ fontSize: "16px" }} />
                            )}
                        </Grid>
                        {/* List of episodes if available */}
                        {loading ? (
                            <CircularProgress />
                        ) : episodesData && Object.keys(episodesData)?.length > 0 ? (
                            <Stack direction="column" spacing={2} className="w-100">
                                <Typography
                                    variant="h6"
                                    sx={{
                                        textTransform: "capitalize",
                                        color: "#176ede",
                                        lineHeight: 1,
                                    }}
                                >
                  Episodes
                                </Typography>
                                {Object.keys(episodesData).length > 1 && <Stack direction="row" spacing={1} flexWrap='wrap'>
                                    <Chip label={"All"} onClick={()=>handleClick("All")} variant={selectedSeason == "All" ? "filled" : "outlined"} color="primary" sx={{marginBottom: "5px"}}/>
                                    {Object.keys(episodesData).length > 0 && Object.keys(episodesData)?.map((season) => {
                                        return <Chip key={season} label={season} onClick={()=>handleClick(season)} variant={selectedSeason == season ? "filled" : "outlined"} color="primary" sx={{marginBottom: "5px"}}/>;
                                    })}
                                </Stack>}
                                {Object.keys(episodesData).length > 0 && Object.keys(episodesData)?.map((season) => {
                                    if(selectedSeason == season || selectedSeason=="All"){
                                        return (
                                            <Stack key={season}>
                                                {selectedSeason != season && <Typography
                                                    variant="h6"
                                                    sx={{
                                                        textTransform: "capitalize",
                                                        textAlign: "center",
                                                        lineHeight: 1.4,
                                                    }}
                                                >
                                                    Season {season.slice(1)}
                                                </Typography>}
                                                <Grid container alignItems="center">
                                                    {episodesData[season].length > 0 && episodesData[season]?.map((episode) => {
                                                        return (
                                                            <Grid
                                                                item
                                                                sm={12}
                                                                md={6}
                                                                className="w-100"
                                                                key={episode.id}
                                                            >
                                                                <Stack
                                                                    spacing={1}
                                                                    direction="row"
                                                                    justifyContent="start"
                                                                    alignItems="start"
                                                                    className="bg-terinary"
                                                                >
                                                                    <Typography
                                                                        variant="subtitle2"
                                                                        sx={{
                                                                            textTransform: "capitalize",
                                                                            lineHeight: 1,
                                                                        }}
                                                                    >
                                                                        E{episode.episode.split("E")[1]}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="subtitle2"
                                                                        sx={{
                                                                            textTransform: "capitalize",
                                                                            lineHeight: 1,
                                                                        }}
                                                                    >
                                                                        {episode.name}
                                                                    </Typography>
                                                                </Stack>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            </Stack>
                                        );
                                    }
                                })}
                            </Stack>
                        ) : (
                        // if no episodes found
                            <Typography
                                variant="body2"
                                sx={{ textAlign: "center", color: grey[400] }}
                            >
                No Episodes found
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ProfileCard;
