import "./styles/App.css";
import { Card, CardContent, Typography, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import ChatItem from "./components/ChatItem";
import data from './locations.json'

async function sendBotResponse(query) {
  console.log(JSON.stringify({ quer: query }));
  const response = await fetch("http://fordchat.franklinyin.com/quer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quer: query }),
  })
    .then((res) => {
      return res.json()
    })
    .then((msg) => {
      console.log("message", msg);
      return msg.response;
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
  const [messages, setMessages] = useState([]);
  const [blockQueries, setBlockQueries] = useState(false);

  useEffect(() => {
    if (blockQueries) {
      sendBotResponse(query).then((res) => {
        setMessages((m) => [...m, { msg: res, author: "Ford Chat" }]);
        setBlockQueries(false);
        setQuery("");
      });
    }
  }, [blockQueries, query]);

  return (
    <div className="App">
      <div className="ChatArea">
        <div className="MessagesArea">
          {messages.map((message) => {
            return <ChatItem message={message.msg} author={message.author} />;
          })}
        </div>
        <Card
          variant="outlined"
          style={{ maxWidth: "45%", flex: "none", marginBottom: "3%" }}
        >
          {introCardContent}
        </Card>
      </div>
      <div classname="InputArea">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setMessages((m) => [...m, { msg: query, author: "You" }]);
            setBlockQueries(true);
          }}
        >
          <TextField
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            style={{
              backgroundColor: "white",
              width: "90%",
              marginTop: "1%",
              marginLeft: "5%",
            }}
            label={"Enter your query here..."}
          />
        </form>
      </div>
    </div>
  );
}

export default App;
