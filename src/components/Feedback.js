import { Rating, Typography, Box } from "@mui/material";
import React, { Fragment } from "react";
import { Button } from "react-bootstrap";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { firebase } from "../firebase";
import { jsPDF } from "jspdf";

const database = getDatabase(firebase);

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

const Feedback = ({ messages, setMessages, setOptionButtons, setMenuButtons }) => {
    const [q1Value, setQ1Value] = React.useState(0);
    const [q1Hover, setQ1Hover] = React.useState(-1);
    const [q2Value, setQ2Value] = React.useState(0);
    const [q2Hover, setQ2Hover] = React.useState(-1);
    const [q3Value, setQ3Value] = React.useState(0);
    const [q3Hover, setQ3Hover] = React.useState(-1);
    const [q4Value, setQ4Value] = React.useState(0);
    const [q4Hover, setQ4Hover] = React.useState(-1);
    const [displaySurvey, setDisplaySurvey] = React.useState(true);

    
    const handleYes = () => {
        let transcript = "";
        for(const message of messages) {
            transcript = transcript + message.author + ":\n";
            transcript = transcript + message.msg + "\n\n";
        }
        const doc = new jsPDF();
        doc.text(transcript, 10, 10, {maxWidth:180});
        doc.save("transcript.pdf");
        setMessages((m) => {
            return [...m, { msg: "Transcript sent! Have a nice day!", author: "Ford Chat" }];
        });
        setOptionButtons([])
        setTimeout(()=>{window.location.href="javascript:history.back()"}, 3000)
    };

    const handleNo = () => {
        setMessages((m) => {
            return [...m, { msg: "Have a nice day!", author: "Ford Chat" }];
        });
        setOptionButtons([])
        setTimeout(()=>{window.location.href="javascript:history.back()"}, 3000)
    };
    
    const updateAverage = (arr) => {
        let satisfactionSum = 0;
        let difficultySum = 0;
        let helpfulnessSum = 0;
        let speedSum = 0;
        const len = arr.length;
        for(const item of arr) {
            satisfactionSum += item.satisfaction;
            difficultySum += item.difficulty;
            helpfulnessSum += item.helpfulness;
            speedSum += item.speed;
        }
        const average = {
            satisfaction: satisfactionSum / len,
            difficulty: difficultySum / len,
            helpfulness: helpfulnessSum / len,
            speed: speedSum / len
        }
        set(ref(database, "averageRatings/"), average);
    }
    const handleRatingSubmit = async (satisfaction, difficulty, helpfulness, speed) => {
        const ratingData = {
            satisfaction: satisfaction,
            difficulty: difficulty,
            helpfulness: helpfulness,
            speed: speed,
        };
        let oldArr = await get(child(ref(database), "ratings/")).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            }
        });
        console.log(oldArr);
        if (oldArr === undefined) {
            oldArr = [];
        }
        const newArr = [...oldArr, ratingData];
        updateAverage(newArr);
        set(ref(database, "ratings/"), newArr);
        setDisplaySurvey(false);
        setMessages((m) => {
            return [...m, { msg: "Thanks for chatting with me. Would you like to download a copy of our chat transcript?", author: "Ford Chat" }];
        });
        setOptionButtons(transcriptButtons);
        setMenuButtons([]);
    };
    const handleSkip = () => {
        setDisplaySurvey(false);
        setMessages((m) => {
            return [...m, { msg: "Thanks for chatting with me. Would you like to download a copy of our chat transcript?", author: "Ford Chat" }];
        });
        setOptionButtons(transcriptButtons);
        setMenuButtons([]);
    };

    
    const transcriptButtons = (
        <div className="option-buttons">
            <button className="button-small" onClick={handleYes}>
                Yes, please
            </button>
            <button className="button-small" onClick={handleNo}>
                No, thanks
            </button>
        </div>
    );
    return (
        <Fragment>
            {displaySurvey === true && (
                <div style={{ justifyContent: "center", textAlign: "center", marginTop: "10px", marginBottom: "100px", width: "100%" }}>
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
                                        getLabelText={(value) => {
                                            getLabelText(value, "q1");
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
                                        getLabelText={(value) => {
                                            getLabelText(value, "q2");
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
                                        getLabelText={(value) => {
                                            getLabelText(value, "q3");
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
                                        getLabelText={(value) => {
                                            getLabelText(value, "q4");
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
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline", justifyContent: "center", gap: "10px" }}>
                            <Button
                                style={{ marginBottom: "2rem", backgroundColor: "rgb(50, 41, 100)" }}
                                onClick={() => {
                                    handleRatingSubmit(q1Value, q2Value, q3Value, q4Value);
                                }}
                            >
                                Submit Feedback
                            </Button>
                            <u style={{ cursor: "pointer" }} onClick={handleSkip}>
                                Skip&gt;
                            </u>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default Feedback;
