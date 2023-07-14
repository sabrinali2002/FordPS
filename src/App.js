import "./styles/App.css";
import { Card, CardContent, Typography, TextField, InputAdornment, IconButton } from "@mui/material";
import { Fragment, useEffect, useState, useRef } from "react";
import ChatItem from "./components/ChatItem";
import { ThreeDots } from "react-loader-spinner";
import { Mic } from "react-bootstrap-icons";
import EV from "./jsons/EV.json";
import trims from "./jsons/trims.json";
import {
  Brightness4,
  Brightness7,
  TextFields,
  TextFieldsOutlined,
} from "@mui/icons-material";
import Navbar from "./components/Navbar.js";
import { extractFiveDigitString, findLocations } from "./mapFunctions";
import QuestionButton from "./components/QuestionButton";
import HamburgerMenu from "./components/Navbar.js";

import { createRecommendTable } from "./models/recommend";

async function sendBotResponse(query, history, mode) {
  console.log(JSON.stringify({ debug: true, quer: query }));
  let newQuery=""
  if(mode==="chat"){
    newQuery += "Here's our conversation before:\n";
    history.forEach((h) => {
      newQuery += `Q: ${h.q}\nA: ${h.a}\n`;
    });
    newQuery += `Here's my new question: ${query}`;
  } else
    newQuery=query
  console.log(newQuery);
  const response = await fetch("http://fordchat.franklinyin.com/quer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mode: mode, quer: newQuery }),
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
            <Typography variant="h5" component="div" className="welcome">
                Welcome to Ford Chat! 👋
            </Typography>
            <Typography variant="body2" className="introduction">
                I am a chatbot that can answer any questions you have about Ford vehicles. I can help you with the following:
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
    const [response, setResponse] = useState("");
    const [recording, setRecording] = useState(false);
    // ACCESSIBILITY
    const [textSize, setTextSize] = useState("small");
    const [darkMode, setDarkMode] = useState(false);
    const [zipCode, setZipCode] = useState("");
    const toggleTextSize = () => {
        setTextSize((prevSize) => (prevSize === "small" ? "medium" : prevSize === "medium" ? "large" : "small"));
    };

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    // PAYMENT CALCULATOR

  //which state the bot is in: closest dealership, calculator, etc.
  const [choice, changeChoice] = useState("");
  const [forceUpdate, setForceUpdate] = useState(true)
  // which step of the payment calculator the bot is in: [1]model,[2]trim,[3]lease/finance/buy,[4]price
  const [calcStep, setCalcStep] = useState(0);
  const [questionnaireStep, setQuestionnaireStep] = useState(0)
  // [1]lease, [2]finance, [3]buy
  const [calcMode, setCalcMode] = useState(0);
  // [1]down payment, [2]trade-in, [3]months, [4]expected miles
  const [leaseStep, setLeaseStep] = useState(0);
  // [1]down payment, [2]trade-in, [3]months, [4]annual %
  const [financeStep, setFinanceStep] = useState(0);
  const [calcButtons, setCalcButtons] = useState("");
  const [zipMode, setZipMode] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");

    // Car Info states
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedTrim, setSelectedTrim] = useState("");
    const [compareModel, setCompareModel] = useState("");
    const [compareTrim, setCompareTrim] = useState("");
    const [carInfoData, setCarInfoData] = useState({});
    const [carInfoMode, setCarInfoMode] = useState("single");
    const [questionnaireAnswers, setQuestionnaireAnswers] = useState([])
    //map functions -------------------------------------------------------->

  const origButtons = (
    <div className="buttons">
    <button onClick={() => handleUserInput('I') } className = "menu">Get info about our cars</button>
      <button onClick={() => handleUserInput("A")} className="menu">
        Help me buy a car
      </button>
      <button onClick={() => handleUserInput("B")} className="menu">
        Find the closest dealerships near me
      </button>
      <button onClick={() => handleUserInput("C")} className="menu">
        Schedule a test drive
      </button>
      <button onClick={() => handleUserInput("D")} className="menu">
        Payment calculator
      </button>
    </div>
  );
  const buyACarButtons = (
    <div className="buttons">
      <button className="menu" onClick={()=>{
        setMessages(m=>{return [...m, {msg: "Great! What kind of car are you looking for?", author: "Ford Chat"}]})
        changeChoice("A");
        setMenuButtons([])
        }}>Ask my own questions</button>
      <button className="menu" onClick={()=>{
        setMessages(m=>{return [...m, {msg: "Great! What is your budget range for purchasing a car?", author: "Ford Chat"}]})
        changeChoice("Q");
        setMenuButtons([])
        setQuestionnaireStep(1)
      }}>Take questionnaire</button>
    </div>
  )
  const [menuButtons, setMenuButtons] = useState(origButtons);

    //map functions -------------------------------------------------------->

    //finds the longitude and latitude of the user
    const findLatLong = (zip) => {
        const s = "http://api.weatherapi.com/v1/current.json?key=c722ececb1094322a31191318231606&q=" + zip;
        return fetch(s)
            .then((response) => response.json())
            .then((data) => {
                let latitude = data.location.lat;
                let longitude = data.location.lon;
                const res = { latitude, longitude };
                return res;
            });
    };

    // map icon hover handler
    const mapIconHandler = (event) => {
        console.log(event);
        // access dealer
        let dealer = "Sunny King Ford";
    };

    const calcButtonHandler = (event) => {
        let val = event.target.getAttribute("value");
        setQuery(val);
        setMessages((m) => [...m, { msg: val, author: "You" }]);
        setCalcButtons([]);
    };
    //Car Info functions  -------------------------------------------------------------
    const handleModelChange = (event) => {
        const id = event.target.parentNode.id;
        if (id === "firstCar") {
            setSelectedModel(event.target.value);
            setSelectedTrim("");
        }
        if (id === "secondCar") {
            setCompareModel(event.target.value);
            setCompareTrim("");
        }
    };

    const handleTrimChange = (event) => {
        const id = event.target.parentNode.id;
        if (id === "firstCar") {
            setSelectedTrim(event.target.value);
        }
        if (id === "secondCar") {
            setCompareTrim(event.target.value);
        }
    };

    let modelOptions = Object.keys(trims).map((model) => ({ value: model, label: model }));
    modelOptions.unshift({ value: "no model", label: "Select Model" });

    let trimOptions = selectedModel === "" || selectedModel === "no model" ? [{ value: "no trim", label: "Select A Model First" }] : trims[selectedModel].map((trim) => ({ value: trim, label: trim }));
    if (trimOptions[0].value !== "no trim") {
        trimOptions.unshift({ value: "all trim", label: "View All Trims" });
    }

    let compareTrimOptions =
        compareModel === "" || compareModel === "no model" ? [{ value: "no trim", label: "Select A Model First" }] : trims[compareModel].map((trim) => ({ value: trim, label: trim }));

    const handleCarInfoButton = async () => {
        let sqlQuery = "";
        if (selectedModel !== "no model") {
            sqlQuery += `SELECT * FROM car_info WHERE model = "${selectedModel}" `;
        }
        if (selectedTrim !== "no trim" && selectedTrim !== "all trim" && selectedTrim !== "") {
            sqlQuery += `AND trim = "${selectedTrim}"`;
        }
        console.log(sqlQuery);
        let dataArr = []
        let data = await fetch(`http://fordchat.franklinyin.com/data?query=${sqlQuery}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            return res.json();
        })
        
        let data2 = [];
        if(carInfoMode === "compare") {
            sqlQuery = `SELECT * FROM car_info WHERE model = "${compareModel}" AND trim = "${compareTrim}"`
            data2 = await fetch(`http://fordchat.franklinyin.com/data?query=${sqlQuery}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                return res.json();
            });
        }
        console.log("compare trim:" + compareTrim);
        dataArr = [data, data2]
        let carInfoCopy=carInfoData
        carInfoCopy[""+(messages.length-1)]=dataArr;
        console.log(messages.length-1, carInfoCopy[""+(messages.length-1)])
        console.log(dataArr);
        setCarInfoData(carInfoCopy);
        setForceUpdate(!forceUpdate)
    }

    const handleCarInfoCompareButton = () => {
        if (carInfoMode === "single") {
            setCarInfoMode("compare");
            setSelectedModel("");
            setSelectedTrim("");
        } else {
            setCarInfoMode("single");
            setSelectedModel("");
            setSelectedTrim("");
        }
    };

    const dropDownOptions = [handleModelChange, handleTrimChange, modelOptions, trimOptions, handleCarInfoButton, handleCarInfoCompareButton, compareTrimOptions];

  const categories = [
    {
      name: "Category 1",
      subcategories: ["Subcategory 1.1", "Subcategory 1.2"],
    },
    {
      name: "Category 2",
      subcategories: ["Subcategory 2.1", "Subcategory 2.2"],
    },
  ];

  // --------------------------------------------------------------------->
  //handler for button user clicks
  const handleUserInput = (option) => {
    // Outputs a response to based on input user selects
    switch (option) {
        case 'I':
            setMessages((m) => [...m, { msg: "What specific car do you want information about?", author: "Ford Chat", line:true, zip:"" }]);
            setMessages((m) => [...m, { msg: "", author: "DropDown", line : false, zip : ""}]);
            setMessages((m) => [...m, { msg: "", author: "Table", line : false, zip : ""}]);
            changeChoice('I');
            break;
      case "A":
        setMessages((m) => [
          ...m,
          {
            msg: "Happy to help! Do you have specific needs in mind, or would you like to fill out our questionnaire?",
            author: "Ford Chat",
            line: true,
            zip: {},
          },
        ]);
        setMenuButtons([buyACarButtons])
        break;
      case "B":
        setMessages((m) => [
          ...m,
          {
            msg: "Please enter your zipcode below:",
            author: "Ford Chat",
            line: true,
            zip: {},
          },
        ]);
        changeChoice("B");
        break;
      case "C":
        setMessages((m) => [
          ...m,
          {
            msg: "Please enter your zipcode below:",
            author: "Ford Chat",
            line: true,
            zip: {},
          },
        ]);
        changeChoice("C");
        break;
      case "D":
        if (model === "") {
          setMessages((m) => [
            ...m,
            { msg: "What model are you interested in?", author: "Ford Chat" },
          ]);
          setCalcButtons(
            Object.keys(trims).map((model) => (
              <button
                className="calc-button"
                key={model}
                value={model}
                onClick={calcButtonHandler}
              >
                {model}
              </button>
            ))
          );
          setCalcStep(1);
        } else if (trim === "") {
          setQuery(model);
          setCalcStep(1);
          blockQueries.current = false;
        } else {
          setQuery(trim);
          setCalcStep(2);
          blockQueries.current = false;
        }
        changeChoice("D");
        setMenuButtons([]);
        break;
      default:
        setResponse(
          "Invalid input. Please select one of the options (A, B, C, or D)."
        );
        break;
    }
  };
    const blockQueries = useRef(false);
    const recognition = useRef(null);
    const sendRecommendRequestToServer = (query)=>{
      sendBotResponse(query, history, "recommend").then((res) => {
        if(res.includes("RECOMMEND_TABLE")){
          let finalTableData=[]
          let promises=[]
          createRecommendTable(res).forEach(car=>{
            console.log(car.model, car.trim)
            const query=`SELECT * FROM car_info WHERE model = \"${car.model}\" AND trim = \"${car.trim}\" AND msrp = \"${car.msrp}\" LIMIT 2`
            promises.push(fetch(`http://fordchat.franklinyin.com/data?query=${query}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
            }).then((res) => {
                return res.json();
            }).then(data=>{
              finalTableData=[...finalTableData, ...data]
            }))
          })
          Promise.all(promises).then(()=>{
            let carInfoCopy=carInfoData
            carInfoCopy[""+messages.length]=[finalTableData,[]]
            setCarInfoData(carInfoCopy);
            setMessages((m) => [...m, { msg: "Sure! Here are some cars I recommend for you. Feel free to ask for more info about any of these cars, or why I recommended them.", author: "Table", line : false, zip : ""}]);
            setForceUpdate(!forceUpdate)
          })
        }
        else{
          setMessages((m) => [
            ...m,
            { msg: res, author: "Ford Chat", line: true, zip: {} }
          ]);
          setHistory((h) => [...h.slice(-4), { q: query, a: res }]);
        }
        blockQueries.current = false;
      });
    }
    useEffect(() => {
        // Check if speech recognition is supported
        if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
            const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognitionInstance.continuous = true;
            recognitionInstance.lang = "en-US";

            recognitionInstance.onresult = function (event) {
                const recognizedText = event.results[event.results.length - 1][0].transcript;
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
        if (query.toLowerCase() === "a" || query.toLowerCase() === "b" || query.toLowerCase() === "c" || query.toLowerCase() === "d") {
            handleUserInput(query.toUpperCase());
        } else {
            if (!blockQueries.current && query.length > 0) {
                blockQueries.current = true;
                switch (choice) {
                    case "I":
                        //Car info dialogues

            break;
        case 'A':
            setQuery("");
            sendRecommendRequestToServer(query)
        break;
          case "B":
            {
              if (zipMode != "") {
                findLocations(zipCode, query).then((loc) => {
                  const places = loc.split("..");
                  for (let i = 0; i < places.length - 1; i++) {
                    if (i === 0) {
                      setMessages((m) => [
                        ...m,
                        {
                          msg: places[i],
                          author: "Ford Chat.",
                          line: false,
                          zip: {
                            zipcode: extractFiveDigitString(zipCode),
                            dist: query,
                          },
                        },
                      ]);
                    } else if (i === places.length - 2) {
                      setMessages((m) => [
                        ...m,
                        { msg: places[i], author: "", line: true, zip: {} },
                      ]);
                    } else {
                      setMessages((m) => [
                        ...m,
                        { msg: places[i], author: "", line: false, zip: {} },
                      ]);
                    }
                  }
                  setZipMode("");
                });
              } else {
                setZipCode(query);
                setMessages((m) => [
                  ...m,
                  {
                    msg: "Select the radius of dealerships you would like to look for in miles",
                    author: "Ford Chat",
                    line: true,
                    zip: "",
                  },
                ]);
                setZipMode("query");
              }
              blockQueries.current = false;
            }
            break;
          case "C":
            {
              {
                if (zipMode != "") {
                  findLocations(zipCode, query).then((loc) => {
                    const places = loc.split("..");
                    setMessages((m) => [
                      ...m,
                      {
                        msg: "",
                        author: "Ford Chat..",
                        line: false,
                        zip: { zipcode: "", dist: "" },
                        locs: places.slice(0, places.length - 1),
                      },
                    ]);
                    for (let i = 0; i < places.length - 1; i++) {
                      if (i === 0) {
                        setMessages((m) => [
                          ...m,
                          {
                            msg: places[i],
                            author: "Ford Chat.",
                            line: false,
                            zip: {
                              zipcode: extractFiveDigitString(zipCode),
                              dist: query,
                            },
                          },
                        ]);
                      } else if (i === places.length - 2) {
                        setMessages((m) => [
                          ...m,
                          { msg: places[i], author: "", line: true, zip: {} },
                        ]);
                      } else {
                        setMessages((m) => [
                          ...m,
                          { msg: places[i], author: "", line: false, zip: {} },
                        ]);
                      }
                    }
                    setZipMode("");
                  });
                } else {
                  setZipCode(query);
                  setMessages((m) => [
                    ...m,
                    {
                      msg: "Thank you - I will look for dealerships in the area",
                      author: "Ford Chat",
                      line: true,
                      zip: "",
                    },
                    {
                      msg: "Please enter your preferred radius to find a dealership.",
                      author: "Ford Chat",
                      line: true,
                      zip: "",
                    },
                  ]);
                  setZipMode("query");
                }
                blockQueries.current = false;
              }
            }
            break;
          case "Q":
            switch(questionnaireStep){
              case 1:
                setMessages(m=>[...m, {msg: "Are you interested in a specific type of vehicle, such as a cargo van, SUV, hatchback, or pickup truck?", author: "Ford Chat"}])
                setQuestionnaireAnswers(q=>[...q, query])
                setQuestionnaireStep(2)
                blockQueries.current=false;
                break;
              case 2:
                setMessages(m=>[...m, {msg: "How do you plan to use the car? Will it be primarily for commuting, family use, off-roading, or business purposes?", author: "Ford Chat"}])
                setQuestionnaireAnswers(q=>[...q, query])
                setQuestionnaireStep(3)
                blockQueries.current=false;
              break;
              case 3:
                setMessages(m=>[...m, {msg: "How many passengers do you need to accommodate regularly? ", author: "Ford Chat"}])
              setQuestionnaireAnswers(q=>[...q, query])
              setQuestionnaireStep(4)
              blockQueries.current=false;
              break;
              case 4:
                //setQuestionnaireAnswers(q=>[...q, query])
                let questionnaireAnswersCopy=[...questionnaireAnswers, query]
                setForceUpdate(!forceUpdate)
                const ultimateQueryString="Here is my budget: "+questionnaireAnswersCopy[0]+". I am looking for a "+questionnaireAnswersCopy[1]+". I will primarily use it for the following: "+questionnaireAnswersCopy[2]+". I need a seating capacity of at least: "+questionnaireAnswersCopy[3]
                sendRecommendRequestToServer(ultimateQueryString)
            }
            break;
          case "D":
            setQuery("");
            switch (calcStep) {
              case 1: //trim
                if (model === "") {
                  setModel(query);
                }
                setMessages((m) => [
                  ...m,
                  {
                    msg: "What trim are you interested in?",
                    author: "Ford Chat",
                  },
                ]);
                setCalcButtons(
                  trims[query].map((trim) => (
                    <button
                      className="calc-button"
                      key={trim}
                      value={trim}
                      onClick={calcButtonHandler}
                    >
                      {trim}
                    </button>
                  ))
                );
                blockQueries.current = false;
                setCalcStep(2);
                break;
              case 2: //lease,finance,buy
                if (trim === "") {
                  setTrim(query);
                }
                const options = ["Lease", "Finance", "Buy"];
                setMessages((m) => [
                  ...m,
                  {
                    msg: "Would you like to lease, finance, or buy?",
                    author: "Ford Chat",
                  },
                ]);
                setCalcButtons(
                  options.map((option) => (
                    <button
                      className="calc-button"
                      style={{ fontSize: "14px" }}
                      key={option}
                      value={option}
                      onClick={calcButtonHandler}
                    >
                      {option}
                    </button>
                  ))
                );
                blockQueries.current = false;
                setCalcStep(3);
                break;
              case 3:
                switch (calcMode) {
                  case 0:
                    if (query === "Lease") {
                      setMessages((m) => [
                        ...m,
                        {
                          msg: "Please enter your down payment, or 0",
                          author: "Ford Chat",
                        },
                      ]);
                      setCalcMode(1);
                      setLeaseStep(1);
                    } else if (query === "Finance") {
                      setMessages((m) => [
                        ...m,
                        {
                          msg: "Please enter your down payment, or 0",
                          author: "Ford Chat",
                        },
                      ]);
                      setCalcMode(2);
                      setFinanceStep(1);
                    } else if (query === "Buy") {
                      setMessages((m) => [
                        ...m,
                        {
                          msg: "Please enter your trade-in value, or 0",
                          author: "Ford Chat",
                        },
                      ]);
                      setCalcStep(4);
                    }
                    blockQueries.current = false;
                    break;
                  case 1: // lease
                    switch (leaseStep) {
                      case 1: // trade-in
                        setMessages((m) => [
                          ...m,
                          {
                            msg: "Please enter your trade-in value, or 0",
                            author: "Ford Chat",
                          },
                        ]);
                        blockQueries.current = false;
                        setLeaseStep(2);
                        break;
                      case 2: // months
                        let durations = [24, 36, 39, 48];
                        setMessages((m) => [
                          ...m,
                          {
                            msg: "Please enter the desired duration of the lease, in months",
                            author: "Ford Chat",
                          },
                        ]);
                        setCalcButtons(
                          durations.map((dur) => (
                            <button
                              className="calc-button"
                              style={{ fontSize: "14px" }}
                              key={dur.toString()}
                              value={dur}
                              onClick={calcButtonHandler}
                            >
                              {dur.toString()}
                            </button>
                          ))
                        );
                        blockQueries.current = false;
                        setLeaseStep(3);
                        break;
                      case 3: // miles
                        setMessages((m) => [
                          ...m,
                          {
                            msg: "Please enter the expected miles driven annually",
                            author: "Ford Chat",
                          },
                        ]);
                        blockQueries.current = false;
                        setLeaseStep(0);
                        setCalcStep(4);
                        break;
                    }
                    break;
                  case 2: // finance
                    switch (financeStep) {
                      case 1: // trade-in
                        setMessages((m) => [
                          ...m,
                          {
                            msg: "Please enter your trade-in value, or 0",
                            author: "Ford Chat",
                          },
                        ]);
                        blockQueries.current = false;
                        setFinanceStep(2);
                        break;
                      case 2: // months
                        let durations = [36, 48, 60, 72, 84];
                        setMessages((m) => [
                          ...m,
                          {
                            msg: "Please enter the desired duration of the loan, in months",
                            author: "Ford Chat",
                          },
                        ]);
                        setCalcButtons(
                          durations.map((dur) => (
                            <button
                              className="calc-button"
                              style={{ fontSize: "14px" }}
                              key={dur.toString()}
                              value={dur}
                              onClick={calcButtonHandler}
                            >
                              {dur.toString()}
                            </button>
                          ))
                        );
                        blockQueries.current = false;
                        setFinanceStep(3);
                        break;
                      case 3: // percentage
                        setMessages((m) => [
                          ...m,
                          {
                            msg: "Please enter the desired annual percentage rate",
                            author: "Ford Chat",
                          },
                        ]);
                        blockQueries.current = false;
                        setFinanceStep(0);
                        setCalcStep(4);
                        break;
                    }
                    break;
                }
                break;
              case 4:
                let payment = 10;
                setMessages((m) => [
                  ...m,
                  {
                    msg: `Your expected monthly payment is ${payment}`,
                    author: "Ford Chat",
                  },
                ]);
                blockQueries.current = false;
                setCalcStep(5);
                break;
              case 5:
                console.log("here");
                //console.log(json_data);
                if (model in Object.keys(EV)) {
                  if (trim in EV[model]) {
                    setMessages((m) => [
                      ...m,
                      {
                        msg: "Would you like car delivery or pickup?",
                        author: "Ford Chat",
                      },
                    ]);
                  }
                }
                setCalcStep(6);
                blockQueries.current = false;
                break;
              case 6: // go to dealership finder
                setMessages((m) => [
                  ...m,
                  {
                    msg: "Type in your zip code to find the nearest dealership",
                    author: "Ford Chat",
                    line: true,
                  },
                ]);
                changeChoice("B");
                blockQueries.current = false;
                setCalcStep(0);
                setCalcMode(0);
                //changeChoice('A');
                break;
            }
            break;
          default:
            setQuery("");
            sendBotResponse(query, history, "chat").then((res) => {
              setMessages((m) => [
                ...m,
                { msg: res, author: "Ford Chat", line: true, zip: {} },
              ]);
              setHistory((h) => [...h.slice(-4), { q: query, a: res }]);
              blockQueries.current = false;
            });
            break;
        }
      }
    }
  }, [
    query,
    history,
    calcStep,
    calcMode,
    leaseStep,
    financeStep,
    choice,
    menuButtons,
    model,
    trim,
  ]);

  return (
    <div className="ButtonContainer">
      <HamburgerMenu categories={categories} />
      <div
        className="App"
        style={{
          backgroundColor: darkMode ? "#000080" : "#f4f3f3",
          color: darkMode ? "#ffffff" : "#000000",
          fontSize:
            textSize === "large"
              ? "22px"
              : textSize === "small"
              ? "16px"
              : "19px",
        }}
      >
        <QuestionButton />
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
            {messages.map((message, index) => {
              console.log(index, message.msg)
              return (
                <ChatItem
                message={message.msg}
                author={message.author}
                line = {message.line}
                darkMode={darkMode}
                textSize={textSize}
                zip = {message.zip}
                locs={message.locs}
                dropDownOptions={dropDownOptions}
                carInfoData={carInfoData[""+(index)]?carInfoData[""+(index)]:[[],[]]}
                carInfoMode={carInfoMode}
            />
              );
            })}
          </div>
          <Card
            variant="outlined"
            className="CardOutline"
            style={{
              maxWidth: "45%",
              flex: "none",
              marginBottom: "3%",
              alignSelf: "center",
              textSize: { textSize },
            }}
          >
            {introCardContent}
          </Card>
        </div>
        <div>
          {menuButtons}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (queryText.length > 0 && !blockQueries.current) {
                setQuery(queryText);
                setMessages((m) => [
                  ...m,
                  { msg: queryText, author: "You", line: true },
                ]);
                setQueryText("");
              }
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {calcButtons}
            </div>
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
                textSize: { textSize },
              }}
              label={"Ask me anything..."}
              helperText={
                blockQueries.current ? "Please wait!" : "Press enter to send."
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
        <div className="bottom">
          <IconButton
            onClick={toggleTextSize}
            color="blue"
            aria-label="Toggle Text Size"
          >
            {textSize === "medium" ? <TextFieldsOutlined /> : <TextFields />}
          </IconButton>
          <IconButton
            onClick={toggleDarkMode}
            color="blue"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <QuestionButton />
        </div>
      </div>
    </div>)
}

export default App;
