import "./styles/App.css";
import { Card, CardContent, Typography, TextField } from "@mui/material";
import { Fragment, useEffect, useState, useRef } from "react";
import ChatItem from "./components/ChatItem";
import { ThreeDots } from "react-loader-spinner";

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
  const [queryText, setQueryText] = useState("")
  const [messages, setMessages] = useState([]);

  const blockQueries = useRef(false);

  useEffect(() => {
    if (!blockQueries.current && query.length>0) {
      blockQueries.current=true
      setQuery("")
      sendBotResponse(query).then((res) => {
        setMessages((m) => [...m, { msg: res, author: "Ford Chat" }]);
        blockQueries.current=false
      });
    }
  }, [query]);

  return (
    <div className="App">
      <div className="ChatArea">
      <ThreeDots 
          height="50" 
          width="50" 
          radius="7"
          color="#8080ff" 
          ariaLabel="three-dots-loading"
          wrapperStyle={{marginLeft: '5vw'}}
          wrapperClassName=""
          visible={blockQueries.current}
          />
        <div className="MessagesArea">
          {messages.map((message) => {
            return <ChatItem message={message.msg} author={message.author} />;
          })}
        </div>
        <Card
          variant="outlined"
          style={{ maxWidth: "45%", flex: "none", marginBottom: "3%", alignSelf: 'center' }}
        >
          {introCardContent}
        </Card>
      </div>
      <div classname="InputArea">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if(queryText.length>0 && !blockQueries.current){
              setQuery(queryText);
              setMessages((m) => [...m, { msg: queryText, author: "You" }]);
              setQueryText("")
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
            helperText={blockQueries.current?"Please wait!":"Press enter to send."}
          />
        </form>
      </div>
    </div>
  );
}

export default App;
