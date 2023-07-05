import "./styles/App.css";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";
import { Fragment, useEffect, useState, useRef } from "react";
import ChatItem from "./components/ChatItem";
import { ThreeDots } from "react-loader-spinner";
import data from "./locations.json";
import { Mic } from "react-bootstrap-icons";

async function sendBotResponse(query, history) {
    console.log(JSON.stringify({ quer: query }));
    let newQuery = "Here's our conversation before:\n";
    history.forEach((h) => {
        newQuery += `Q: ${h.q}\nA: ${h.a}\n`;
    });
    newQuery += `Here's my new question: ${query}`;
    console.log(newQuery);
    const response = await fetch("http://localhost:5000/quer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quer: newQuery }),
    })
        .then((res) => {
            return res.json();
        })
        .then((msg) => {
            console.log("message", msg);
            return msg.response.replaceAll("A: ", "");
        })
        .catch((err) => {
            console.log(err.message);
        });
    return response;
}

const introCardContent = (
    <Fragment>
        <CardContent>
            <Typography variant="h5" component="div">
                Welcome to Ford Chat! 👋
            </Typography>
            <Typography variant="body2">
                I am a chatbot that can answer any questions you have about Ford
                vehicles. I can help you with the following:
                <br />
                <ul>
                    <li>Get information about a specific model</li>
                    <li>Find nearby dealerships to schedule a test drive</li>
                    <li>Get redirected to a relevant payments estimator</li>
                </ul>
            </Typography>
        </CardContent>
    </Fragment>
);

function App() {
    const [query, setQuery] = useState("");
    const [queryText, setQueryText] = useState("");
    const [messages, setMessages] = useState([]);
    const [history, setHistory] = useState([]);
    const [recording, setRecording] = useState(false);

    const blockQueries = useRef(false);
    const recognition = useRef(null);

    useEffect(() => {
        // Check if speech recognition is supported
        if (
            "SpeechRecognition" in window ||
            "webkitSpeechRecognition" in window
        ) {
            const recognitionInstance = new (window.SpeechRecognition ||
                window.webkitSpeechRecognition)();
            recognitionInstance.continuous = true;
            recognitionInstance.lang = "en-US";

            recognitionInstance.onresult = function (event) {
                const recognizedText =
                    event.results[event.results.length - 1][0].transcript;
                setQueryText(recognizedText);
            };

            recognitionInstance.onerror = function (event) {
                console.error("Speech recognition error:", event.error);
            };

            recognition.current = recognitionInstance;
        } else {
            console.error("Speech recognition not supported in this browser.");
        }
    }, []);

    const toggleRecording = () => {
        if (blockQueries.current) {
            recognition.current.stop();
            setRecording(false);
        } else {
            recognition.current.start();
            setRecording(true);
        }
        blockQueries.current = !blockQueries.current;
    };

    useEffect(() => {
        if (!blockQueries.current && query.length > 0) {
            blockQueries.current = true;
            setQuery("");
            sendBotResponse(query, history).then((res) => {
                setMessages((m) => [...m, { msg: res, author: "Ford Chat" }]);
                setHistory((h) => [...h.slice(-4), { q: query, a: res }]);
                blockQueries.current = false;
            });
        }
    }, [query, history]);

    return (
        <div className="App">
            <div className="ChatArea">
                <ThreeDots
                    height="50"
                    width="50"
                    radius="7"
                    color="#8080ff"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{ marginLeft: "5vw" }}
                    wrapperClassName=""
                    visible={blockQueries.current}
                />
                <div className="MessagesArea">
                    {messages.map((message) => {
                        return (
                            <ChatItem
                                message={message.msg}
                                author={message.author}
                            />
                        );
                    })}
                </div>
                <Card
                    variant="outlined"
                    style={{
                        maxWidth: "45%",
                        flex: "none",
                        marginBottom: "3%",
                        alignSelf: "center",
                    }}
                >
                    {introCardContent}
                </Card>
            </div>
            <div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (queryText.length > 0 && !blockQueries.current) {
                            setQuery(queryText);
                            setMessages((m) => [
                                ...m,
                                { msg: queryText, author: "You" },
                            ]);
                            setQueryText("");
                        }
                    }}
                >
                    <TextField
                        value={queryText}
                        error={blockQueries.current}
                        onChange={(e) => {
                            setQueryText(e.target.value);
                        }}
                        style={{
                            accentColor: "white",
                            width: "90%",
                            marginTop: "1%",
                            marginLeft: "5%",
                        }}
                        label={"Enter your query here..."}
                        helperText={
                            blockQueries.current
                                ? "Please wait!"
                                : "Press enter to send."
                        }
                        InputProps={{
                            endAdornment: recording ? (
                                <div
                                    className="pulsing-blob"
                                    onClick={() => {
                                        toggleRecording();
                                    }}
                                ></div>
                            ) : (
                                <InputAdornment position="end">
                                    <Mic
                                        className="mic-icon"
                                        size="2rem"
                                        onClick={() => {
                                            toggleRecording();
                                        }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                </form>
            </div>
        </div>
    );
}

export default App;
