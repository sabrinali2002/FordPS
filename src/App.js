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
import data from './zipLocations.json';

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
    //map functions -------------------------------------------------------->
    //finding the distance between user input and dealerships
    function calculateDistance(lat1, lon1, lat2, lon2) {
      function toRadians(degrees) {
        return degrees * (Math.PI / 180);
      }
      const R = 6371; // Radius of the Earth in kilometers
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
    
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
    
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
      const distance = R * c;
      return distance;
    }
    //finds the longitude and latitude of the user
    const findLatLong = (zip) => {
      const s = "http://api.weatherapi.com/v1/current.json?key=c722ececb1094322a31191318231606&q="+zip;
      return fetch(s).then((response)=>response.json()).then((data) => {
          let latitude = data.location.lat;
          let longitude = data.location.lon;
          const res = {latitude,longitude};
          return res;
        });
    }
    //extracts the zip code from the user input for map
    function extractFiveDigitString(inputString) {
      const regex = /\b\d{5}\b/g;
      const matches = inputString.match(regex);
      if (matches && matches.length > 0) {
        return matches[0];
      }
      return null;
    }
    const findLocations = async () => {
      const zip = extractFiveDigitString(query);
      try{
        const result = await findLatLong(zip);
        const distances = {}
      const l = [result.latitude,result.longitude];
      for (const coords in data){
        const [lat,lon] = coords.split(" ");
        const address = data[coords].name + ": " + data[coords].address + ", " + data[coords].city + " " + lat + " " + lon;
        const distance = calculateDistance(l[0],l[1],parseFloat(lat),parseFloat(lon));
        distances[address] = distance;
      }
      const sortedLocations = Object.entries(distances).sort((a,b)=>a[1]-b[1]);
      const closestLocations = sortedLocations.slice(0,5);
      let string = ""
      for(let i = 0; i < closestLocations.length; i++){
        const arr = closestLocations[i][0].split(", ");
        console.log(arr);
        let shortStr = ""
        for(let i = 0; i < arr.length-1; i++){
            console.log(arr[i]);
            shortStr += arr[i] + ", ";
        }
        console.log(shortStr);
        string += shortStr+arr[arr.length-2] + "..";
        // const location = arr[arr.length-1].split(" ");
        // topLatLongs.push([location[1],location[2]]);
      }
      return string;
      }
      catch(err){
        return "Invalid zip";
      }
    }
    // --------------------------------------------------------------------->
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
        setMessages((m) => [...m, { msg: "Choose the time and day you would prefer", author: "Ford Chat" }]);
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
    const [recording, setRecording] = useState(false);

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
              findLocations().then(loc=>{
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
              setMessages((m) => [...m, { msg: "Monday 4:30", author: "Ford Chat" }]);
              blockQueries.current = false;
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
        <button onClick={() => handleUserInput('A')}>A. Learn more about our cars</button>
        <button onClick={() => handleUserInput('B')}>B. Find the closest dealership near me</button>
        <button onClick={() => handleUserInput('C')}>C. Schedule a test drive</button>
        <button onClick={() => handleUserInput('D')}>D. Cost estimate</button>
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