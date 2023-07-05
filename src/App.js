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
    const response = await fetch("http://fordchat.franklinyin.com/quer", {
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
    const [response, setResponse] = useState('');
    const [choice, changeChoice] = useState('');
  const handleUserInput = (option) => {
    // Perform actions based on the selected option
    switch (option) {
      case 'A':
        setMessages((m) => [...m, { msg: "Ask a question to know more about our cars", author: "Ford Chat" }]);
        changeChoice('A');
        // Perform action for option A
        break;
      case 'B':
        setMessages((m) => [...m, { msg: "Type in your zip code to find the nearest dealership", author: "Ford Chat" }]);
        changeChoice('B');
        // Perform action for option B
        break;
      case 'C':
        setMessages((m) => [...m, { msg: "Type in the time and date you would like to schedule a test drive", author: "Ford Chat" }]);
        changeChoice('C');
        // Perform action for option C
        break;
      case 'D':
        setMessages((m) => [...m, { msg: "Type in the type of car you would like", author: "Ford Chat" }]);
        changeChoice('D');
        // Perform action for option D
        break;
      default:
        setResponse('Invalid input. Please select one of the options (A, B, C, or D).');
        break;
    }
  };
    const blockQueries = useRef(false);

    useEffect(() => {
        if (!blockQueries.current && query.length > 0) {
            blockQueries.current = true;
            setQuery("");
            sendBotResponse(query, history).then((res) => {
              switch(choice){
                case 'A':
                  setMessages((m) => [...m, { msg: res, author: "Ford Chat" }]);
                  break;
                case 'B':
                  setMessages((m) => [...m, { msg: "12189 publicis sapient road", author: "Ford Chat" }]);
                  break;
                case 'C':
                  setMessages((m) => [...m, { msg: "What time and date would you like?", author: "Ford Chat" }]);
                  break;
                default:
                  setMessages((m) => [...m, { msg: res, author: "Ford Chat" }]);
                  break;
              }
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
                <div>
      <p>{response}</p>
        <button onClick={() => handleUserInput('A')}>Learn more about our cars</button>
        <button onClick={() => handleUserInput('B')}>Find the closest dealership near me</button>
        <button onClick={() => handleUserInput('C')}>Schedule a test drive</button>
        <button onClick={() => handleUserInput('D')}>Find the car for you</button>
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
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Mic size="2rem" />
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
