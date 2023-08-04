import { Fragment, useState } from "react";
import data from "../images/image_link.json";
import dealerships from "../jsons/trimToDealer.json";
import { Rating, Box } from "@mui/material";
import DisplayReview from "./DisplayReview";
import reviewData from "../jsons/reviews.json"

export default function DisplayInfo({ info, handler }) {
    const [screen, setScreen] = useState("info");
    console.log("info:", info);
    let reviews = reviewData[info.model];
    let starCount = [0, 0, 0, 0, 0];
    let length = reviews.length;
    for (let review of reviews) {
        let star = review["star"];
        starCount[star - 1]++;
    }
    let average = (starCount[0] + starCount[1] * 2 + starCount[2] * 3 + starCount[3] * 4 + starCount[4] * 5) / length;
    const moneyFormatter = new Intl.NumberFormat('en-US', {
      style: "currency",
      currency: "USD"
  })
    return (
        <Fragment>
            {screen === "info" && (
                <div
                    style={{
                        width: "100%", // Increase width to desired value
                        display: "flex",
                        float: "left",
                        borderRadius: "15px", // Add this for rounded corners
                        backgroundColor: "#d4e3fa",
                        flexDirection: "column",
                        margin: "10px",
                        marginLeft:'80px',
                        boxShadow: "0 4px 2px -2px gray",
                    }}
                >
                    <div>
                        <div style={{ padding: "10px" }}>
                            <div
                                style={{
                                    float: "right",
                                    width: "40%",
                                    height: "20%",
                                    margin: "20px",
                                    backgroundColor: "white",
                                    borderRadius: "15px",
                                    boxShadow: "0 4px 2px -2px gray",
                                }}
                            >
                                <img src={data[info.model][info.trim]} alt={info.model} style={{ width: "100%" }}></img>
                                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" marginTop="1rem">
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <Rating value={average} precision={0.01} readOnly />
                                        <span>{average}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setScreen("review");
                                        }}
                                    >
                                        <u style={{fontSize:'15px'}}>View Customer Reviews</u>
                                    </button>
                                </Box>
                            </div>
                            <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                                <h2 style={{ marginBottom: "20px", marginLeft: "10px", fontSize:'22px'}}>
                                    {"2023 "}
                                    {info.model} &reg; {info.trim} &reg;
                                </h2>
                                <div style={{ marginBottom: "25px", marginLeft: "10px" }}>
                                    <h3 style={{ fontSize: "18px" }}>
                                        Estimated net price {moneyFormatter.format(info.msrp)}
                                        <button
                                            style={{
                                                marginLeft: "10px",
                                                background: "none",
                                                border: "none",
                                                color: "blue",
                                                cursor: "pointer",
                                                fontSize: "18px" 
                                            }}
                                        >
                                            ...more
                                        </button>
                                    </h3>
                                    <h3 style={{ fontSize: "18px" }}>
                                        Available at {" " + dealerships[info.model][info.trim][0] + ", " + dealerships[info.model][info.trim][1] + ","}
                                        <button
                                            style={{
                                                marginLeft: "10px",
                                                background: "none",
                                                border: "none",
                                                color: "blue",
                                                cursor: "pointer",
                                                fontSize: "18px" 
                                            }}
                                        >
                                            ...more
                                        </button>
                                    </h3>
                                </div>
                                <div style={{ marginLeft: "10px" }}>
                                    <h2 style={{ fontSize: "18px" }}>
                                        Your Vehicle
                                    </h2>
                                    <h3 style={{ fontSize: "15px" }}>
                                        Engine:
                                        {" " + info["engine_aspiration"]}
                                    </h3>
                                    <h3 style={{ fontSize: "15px" }}>
                                        Drivetrain:
                                        {" " + info["drivetrain"]}
                                    </h3>
                                    <h3 style={{ fontSize: "15px" }}>
                                        Transmission:
                                        {" " + info["transmission"]}
                                    </h3>
                                    <h3 style={{ fontSize: "15px", marginBottom: "12px" }}>
                                        Body Style:
                                        {" " + info["body_style"]}
                                    </h3>
                                </div>
                                <div style={{ textAlign: "left", margin: "3px" }}>
                                    <button
                                        style={{ float: "left", fontSize:'15px', textDecoration:'none'}}
                                        onClick={() => {
                                            handler("I");
                                        }}
                                    >
                                        <u>Back</u>
                                    </button>
                                </div>
                                <div style={{ textAlign: "right", paddingRight: "10px", margin: "3px" }}>
                                    {/* <button style={{ float: "right" }}>
          <u>Detailed info</u>&#10148;
        </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {screen === "review" && <DisplayReview data={info} setScreen={setScreen} reviews={reviews} starCount={starCount} average={average}/>}
        </Fragment>
    );
}
