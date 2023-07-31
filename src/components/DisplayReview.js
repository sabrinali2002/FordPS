import React, { useState } from "react";
import images from "../images/image_link.json";
import { Rating, Box, LinearProgress, Typography, Grid, Stack, Avatar, Divider } from "@mui/material";
import ReviewItem from "./ReviewItem";
import { ChevronLeft } from "react-bootstrap-icons";

export default function DisplayReview({ data, setScreen, reviews, starCount, average }) {
    let length = reviews.length;
    const [filteredReviews, setFilteredReviews] = useState(reviews);
    const [filteredStar, setFilteredStar] = useState(null);

    const handleFilterReview = (star) => {
        let filtered = reviews.filter((review) => review.star === star);
        setFilteredReviews(filtered);
        setFilteredStar(star);
    };

    return (
        <div
            style={{
                width: "950px", // Increase width to desired value
                display: "flex",
                borderRadius: "15px", // Add this for rounded corners
                backgroundColor: "#d4e3fa",
                flexDirection: "column",
                margin: "10px",
                boxShadow: "0 4px 2px -2px gray",
            }}
        >
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div style={{ margin: "20px", width: "50%" }}>
                    <div
                        style={{ display: "flex", cursor: "pointer", width: "auto" }}
                        onClick={() => {
                            setScreen("info");
                        }}
                    >
                        <ChevronLeft size="1.5rem" />
                        <h4>Back</h4>
                    </div>
                    <h2>
                        {"2023 "}
                        <strong>{data.model}</strong> &#x24C7;
                    </h2>
                    <h4>Ratings</h4>
                    <Box display="flex" gap="0.5rem">
                        <p>
                            <strong>{average}</strong>/5 Stars
                        </p>
                        <Rating value={average} precision={0.01} readOnly />
                        <p>{length} reviews</p>
                    </Box>
                    <Grid spacing={1} container alignItems="center" marginTop="-25px" onClick={() => handleFilterReview(5)}>
                        <Grid xs={2} item>
                            <p style={{ cursor: "pointer", textDecoration: "underline" }}>5 stars</p>
                        </Grid>
                        <Grid xs item paddingBottom="15px">
                            <LinearProgress variant="determinate" style={{ cursor: "pointer" }} value={(starCount[4] / length) * 100} />
                        </Grid>
                    </Grid>
                    <Grid spacing={1} container alignItems="center" marginTop="-25px" onClick={() => handleFilterReview(4)}>
                        <Grid xs={2} item>
                            <p style={{ cursor: "pointer", textDecoration: "underline" }}>4 stars</p>
                        </Grid>
                        <Grid xs item paddingBottom="15px">
                            <LinearProgress variant="determinate" style={{ cursor: "pointer" }} value={(starCount[3] / length) * 100} />
                        </Grid>
                    </Grid>
                    <Grid spacing={1} container alignItems="center" marginTop="-25px" onClick={() => handleFilterReview(3)}>
                        <Grid xs={2} item>
                            <p style={{ cursor: "pointer", textDecoration: "underline" }}>3 stars</p>
                        </Grid>
                        <Grid xs item paddingBottom="15px">
                            <LinearProgress variant="determinate" style={{ cursor: "pointer" }} value={(starCount[2] / length) * 100} />
                        </Grid>
                    </Grid>
                    <Grid spacing={1} container alignItems="center" marginTop="-25px" onClick={() => handleFilterReview(2)}>
                        <Grid xs={2} item>
                            <p style={{ cursor: "pointer", textDecoration: "underline" }}>2 stars</p>
                        </Grid>
                        <Grid xs item paddingBottom="15px">
                            <LinearProgress variant="determinate" style={{ cursor: "pointer" }} value={(starCount[1] / length) * 100} />
                        </Grid>
                    </Grid>
                    <Grid spacing={1} container alignItems="center" marginTop="-25px" onClick={() => handleFilterReview(1)}>
                        <Grid xs={2} item>
                            <p style={{ cursor: "pointer", textDecoration: "underline" }}>1 stars</p>
                        </Grid>
                        <Grid xs item paddingBottom="15px">
                            <LinearProgress variant="determinate" style={{ cursor: "pointer" }} value={(starCount[0] / length) * 100} />
                        </Grid>
                    </Grid>
                </div>
                <div
                    style={{
                        width: "356px",
                        height: "200px",
                        margin: "20px",
                        backgroundColor: "white",
                        borderRadius: "15px",
                        boxShadow: "0 4px 2px -2px gray",
                        textAlign: "center",
                        alignItems: "center",
                        display: "flex",
                    }}
                >
                    <img src={images["Default"][data.model]} alt={data.model} style={{ width: "340px" }}></img>
                </div>
            </div>
            <div style={{ marginLeft: "20px", marginTop: "-20px", height: "300px", overflowY: "scroll" }}>
                <h4>Reviews</h4>
                {filteredStar !== null && <div style={{ display: "flex" }}>
                    <p style={{ textDecoration: "underline" }}>Filter: {filteredStar} stars</p>
                    <p
                        style={{ color: "blue", marginLeft: "10px", cursor: "pointer" }}
                        onClick={() => {
                            setFilteredStar(null);
                            setFilteredReviews(reviews);
                        }}
                    >
                        Clear filter
                    </p>
                </div>}
                {filteredReviews.map((review) => (
                    <ReviewItem key={review.date} date={review.date} name={review.name} review={review.review} star={review.star} />
                ))}
                {filteredReviews.length === 0 && <h4>No Reviews To Show</h4>}
            </div>
        </div>
    );
}
