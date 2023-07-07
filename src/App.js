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
import { Mic } from "react-bootstrap-icons";
import DatePicker from "react-datepicker";
import data from './zipLocations.json';
import "react-datepicker/dist/react-datepicker.css";
import {calculateDistance, extractFiveDigitString, findLatLong, findLocations} from "./mapFunctions.js"

async function sendBotResponse(query, history) {
    console.log(JSON.stringify({ debug: true, quer: query }));
    let newQuery = "Here's our conversation before:\n";
    history.forEach((h) => {
        newQuery += `Q: ${h.q}\nA: ${h.a}\n`;
    });
    newQuery += `Here's my new question: ${query}`;
    console.log(newQuery);
    const response = await fetch("http://fordchat.franklinyin.com/quer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ debug: false, quer: newQuery }),
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
    const [response, setResponse] = useState('');
    //which state the bot is in: closest dealership, calculator, etc.
    const [choice, changeChoice] = useState('');
    const [recording, setRecording] = useState(false);
    //handler for button user clicks
  const handleUserInput = (option) => {
    // Outputs a response to based on input user selects
    switch (option) {
      case 'A':
        setMessages((m) => [...m, { msg: "Ask a question to know more about our cars", author: "Ford Chat" }]);
        changeChoice('A');
        break;
      case 'B':
        setMessages((m) => [...m, { msg: "Type in your zip code to find the nearest dealership", author: "Ford Chat" }]);
        changeChoice('B');
        break;
      case 'C':
        setMessages((m) => [...m, { msg: "Please input the name of the car you would like to test and your current zip so we can find the location best for you", author: "Ford Chat" }]);
        changeChoice('C');
        break;
      case 'D':
        setMessages((m) => [...m, { msg: "Describe the car you would like an estimate of", author: "Ford Chat" }]);
        changeChoice('D');
        break;
      default:
        setResponse('Invalid input. Please select one of the options (A, B, C, or D).');
        break;
    }
  };
    const blockQueries = useRef(false);

    // const blockQueries = useRef(false);
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
      if(query.toLowerCase() === 'a' || query.toLowerCase() === 'b' || query.toLowerCase() === 'c' || query.toLowerCase() === 'd'){
        handleUserInput(query.toUpperCase());
        console.log("reached");
      }
      else{
        if (!blockQueries.current && query.length > 0) {
          blockQueries.current = true;
          switch(choice){
            case 'A', '':
              setQuery("");
              sendBotResponse(query, history).then((res) => {
                setMessages((m) => [...m, { msg: res, author: "Ford Chat" }]);
                setHistory((h) => [...h.slice(-4), { q: query, a: res }]);
                blockQueries.current = false;
              })
              break;
            case 'B':
              findLocations(query).then(loc=>{
                const places = loc.split('..');
                console.log(places);
                for(let i = 0; i < places.length-1; i++){
                    if(i === 0){
                        setMessages((m) => [...m, { msg: places[i], author: "Ford Chat" }]);
                    }
                    else{
                        setMessages((m) => [...m, { msg: places[i], author: "" }]);
                    }
                }
                blockQueries.current = false;
              });
            break;
            case 'C':
            findLocations(query).then(loc=>{
              const places = loc.split('..');
              setMessages((m) => [...m, { msg: "This car is available in the following locations: ", author: "Ford Chat" }]);
              for(let i = 0; i < places.length-1; i++){
                setMessages((m) => [...m, { msg: places[i], author: "" }]);
              }
              setMessages((m) => [...m, { msg: "Please select the dealership most convenient for you", author: "Ford Chat" }]);
              blockQueries.current = false;
            })
              break;
            case 'D':
              setMessages((m) => [...m, { msg: "$500", author: "Ford Chat" }]);
              blockQueries.current = false;
              break;
          }
      }
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
                <div>
      <p>{response}</p>
    </div>
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
            <div className = "buttons">
        <button onClick={() => handleUserInput('A') } className = "menu">A. Learn more about our cars</button>
        <button onClick={() => handleUserInput('B')} className = "menu">B. Find the closest dealerships near me</button>
        <button onClick={() => handleUserInput('C')} className = "menu">C. Schedule a test drive</button>
        <button onClick={() => handleUserInput('D')} className = "menu">D. Cost estimate</button>
        </div>
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