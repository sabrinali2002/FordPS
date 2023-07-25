import { Rating, Typography, Box } from "@mui/material";
import React from "react";
import { Button } from "react-bootstrap";

const satisfactionLabels = {
    1: "Not satisfied at all",
    2: "Slightly Disatisfied",
    3: "Moderately Satisfied",
    4: "Very Satisfied",
    5: "Extremely Satisfied",
};
const difficultyLabels = {
    1: "Extremely Difficult",
    2: "Difficult",
    3: "Moderately Easy",
    4: "Easy",
    5: "Extremely Easy",
};
const helpfulnessLabels = {
    1: "Not Helpful At All",
    2: "Slightly Helpful",
    3: "Moderately Helpful",
    4: "Very Helpful",
    5: "Extremely Helpful",
};
const speedLabels = {
    1: "Extremely Slow",
    2: "Somewhat Slow",
    3: "Somewhat Fast",
    4: "Fast",
    5: "Extremely Fast",
};

function getLabelText(value, question) {
    switch (question) {
        case "q1":
            return `${value} Star${value !== 1 ? "s" : ""}, ${satisfactionLabels[value]}`;
        case "q2":
            return `${value} Star${value !== 1 ? "s" : ""}, ${difficultyLabels[value]}`;
        case "q3":
            return `${value} Star${value !== 1 ? "s" : ""}, ${helpfulnessLabels[value]}`;
        case "q4":
            return `${value} Star${value !== 1 ? "s" : ""}, ${speedLabels[value]}`;
        default:
            return null;
    }
}

const Feedback = () => {
    const [q1Value, setQ1Value] = React.useState(0);
    const [q1Hover, setQ1Hover] = React.useState(-1);
    const [q2Value, setQ2Value] = React.useState(0);
    const [q2Hover, setQ2Hover] = React.useState(-1);
    const [q3Value, setQ3Value] = React.useState(0);
    const [q3Hover, setQ3Hover] = React.useState(-1);
    const [q4Value, setQ4Value] = React.useState(0);
    const [q4Hover, setQ4Hover] = React.useState(-1);
    return (
        <div style={{ justifyContent: "center", textAlign: "center", marginTop: "10px", marginBottom: "15px", width: "100%" }}>
            <div style={{ backgroundColor: "rgb(205, 220, 232)", borderRadius: "15px", boxShadow: "0 4px 2px -2px gray", width: "100%" }}>
                <div style={{ marginTop: "10px", color: "#322964", fontSize: "20px", fontWeight: "bold", lineHeight: "30px" }}>We appreciate your input!</div>
                <div style={{ color: "#322964", fontSize: "12px", fontWeight: "bold", lineHeight: "20px" }}>Please answer any of these questions below to help us help you next time.</div>
                <div style={{ textAlign: "left", marginLeft: "1rem", marginTop: "1.5rem", padding: "1rem" }}>
                    <div>
                        <Typography>How satisfied are you with your HenrAI experience?</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Rating
                                precision={1}
                                getLabelText={(value)=>{
                                    getLabelText(value, "q1")
                                }}
                                onChange={(event, newValue) => {
                                    setQ1Value(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setQ1Hover(newHover);
                                }}
                            />
                            {q1Value !== null && <Box sx={{ ml: 2 }}>{satisfactionLabels[q1Hover !== -1 ? q1Hover : q1Value]}</Box>}
                        </Box>
                    </div>
                    <div>
                        <Typography>How easy was it to navigate through getting help?</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Rating
                                precision={1}
                                getLabelText={(value)=>{
                                    getLabelText(value, "q2")
                                }}
                                onChange={(event, newValue) => {
                                    setQ2Value(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setQ2Hover(newHover);
                                }}
                            />
                            {q2Value !== null && <Box sx={{ ml: 2 }}>{difficultyLabels[q2Hover !== -1 ? q2Hover : q2Value]}</Box>}
                        </Box>
                    </div>
                    <div>
                        <Typography>How helpful was the chatbot for answering your questions and addressing your needs?</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Rating
                                precision={1}
                                getLabelText={(value)=>{
                                    getLabelText(value, "q3")
                                }}
                                onChange={(event, newValue) => {
                                    setQ3Value(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setQ3Hover(newHover);
                                }}
                            />
                            {q3Value !== null && <Box sx={{ ml: 2 }}>{helpfulnessLabels[q3Hover !== -1 ? q3Hover : q3Value]}</Box>}
                        </Box>
                    </div>
                    <div>
                        <Typography>How were the chatbot's response times?</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Rating
                                precision={1}
                                getLabelText={(value)=>{
                                    getLabelText(value, "q4")
                                }}
                                onChange={(event, newValue) => {
                                    setQ4Value(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setQ4Hover(newHover);
                                }}
                            />
                            {q4Value !== null && <Box sx={{ ml: 2 }}>{speedLabels[q4Hover !== -1 ? q4Hover : q4Value]}</Box>}
                        </Box>
                    </div>
                </div>
                <Button style={{marginBottom:"2rem", backgroundColor:"rgb(50, 41, 100)"}}>Submit Feedback</Button>
            </div>
        </div>
    );
};

export default Feedback;
