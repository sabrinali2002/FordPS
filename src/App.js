import "./styles/App.css";
import { Card, TextField, InputAdornment, IconButton } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import ChatItem from "./components/ChatItem";
import { ThreeDots } from "react-loader-spinner";
import { Mic } from "react-bootstrap-icons";
import trims from "./jsons/trims.json";

import {
  Brightness4,
  Brightness7,
  TextFields,
  TextFieldsOutlined,
} from "@mui/icons-material";

import { extractFiveDigitString, findLocations, selectHandlerFn, locateDealershipsFn, calcButtonHandlerFn, appendSelectFn, changeFindFn } from "./modules/mapFunctions";
import {modelOptions, getTrimOptions} from './modules/tableFunctions'
import { handleCarInfo, handleCarComparison, onModelChange, onTrimChange } from "./modules/selectCarFunctions";
import { handleUserInputFn, handleUserFlow } from "./modules/userFlowFunctions";

import QuestionButton from "./components/QuestionButton";
import HamburgerMenu from "./components/Navbar.js";
import { IntroCardContent } from "./components/IntroCardContent";

const fixTrimQueryQuotation = (model, query) => {
    console.log("model: " + model, "original query: " + query);
    if(model !== "Transit Cargo Van" && model !== "E-Transit Cargo Van") {
        return query;
    }
    let trimStartIndex = query.indexOf('trim = "') + 8;
    if(trimStartIndex - 8 !== -1) {
        query = query.slice(0, trimStartIndex) + '\\"' + query.slice(trimStartIndex);
        trimStartIndex += 2;
        let trimName = query.substring(trimStartIndex, query.length - 1);
        let modified = trimName.replace(/"/g, '\\"\\"');
        query = query.replace(trimName, modified);
        query = query.slice(0,query.length - 1) + "\\" + query.slice(query.length - 1);
        query += '"';
    }
    return query;
}

function App() {
    const [query, setQuery] = useState("");
    const [queryText, setQueryText] = useState("");
    const [messages, setMessages] = useState([
      { msg: "What's your name?", author: "Bot" },
    ]);
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
  const [zipMode, setZipMode] = useState(0);
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [trimOptions, setTrimOptions] = useState([])

    // Car Info states
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedTrim, setSelectedTrim] = useState("");
    const [compareModel, setCompareModel] = useState("");
    const [compareTrim, setCompareTrim] = useState("");
    const [carInfoData, setCarInfoData] = useState({});
    const [carInfoMode, setCarInfoMode] = useState("single");
    const [questionnaireAnswers, setQuestionnaireAnswers] = useState([])

    const blockQueries = useRef(false);
    const recognition = useRef(null);
    //map functions -------------------------------------------------------->

  const [distance, setDistance] = useState("10");
  const [findMode, setFind] = useState(0);
  const [selectMode, setSelect] = useState(false);
  const s = new Set();
  const [dealerList, setDealers] = useState(s);
  const [selected, changeSelected] = useState({"Bronco": [],"Bronco Sport":[],"E-Transit Cargo Van":[],"Edge":[],"Escape":[],"Expedition":[],"Explorer":[],"F-150":[],"F-150 Lightning":[],"Mustang Mach-E":[],"Ranger":[],"Transit Cargo Van":[]})
  const handleMenuClick = (parameter) => {
    handleUserInput(parameter);
    setMenuButtons([]);
    // Perform any other logic or function in the parent component using the parameter
  };
  const origButtons = (
    <div className="buttons">
      <button className = "menu" onClick={()=>{
        setMessages(m=>{return [...m, {msg: "What info would you like to know?", author: "Ford Chat"}]})
        setMenuButtons(buyingFordButtons)
        }}>Buying a Ford</button>
      <button className = "menu">I'm an Existing Owner</button>
      <button className = "menu">Info about Ford</button>
      <button className = "menu">Negotiation Assistance</button>
    </div>
  );
  const buyingFordButtons = (
    <div className = "buttons">
       <button className = "menu" onClick={() => {
        handleUserInput('I');
        setMenuButtons([]);
        }}>Info about a specific car</button>
      <button className = "menu" onClick={() => {
        handleUserInput('A');
        setMenuButtons([]);
        }}>Car recommendation</button>
      <button className = "menu" onClick={() => {
        handleUserInput('D');
        setMenuButtons([]);
        }}>Car pricing estimator</button>
      <button className = "menu" onClick={() => {
        handleUserInput('B');
        setMenuButtons([]);
        }}>Find a dealership</button>
      <button className = "menu" onClick={() => {
        handleUserInput('C');
        setMenuButtons([]);
        }}>Schedule a test drive</button>
    </div>
  )
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
  const selectHandler = selectHandlerFn(setQuery, setModel, setCalcButtons, setFind);
  const locateDealerships = locateDealershipsFn(setDealers, setCalcButtons, setSelect, selected, setFind, changeSelected, zipCode, distance, setMessages, setZipMode);
  const changeFind = changeFindFn(setFind, setSelect, setCalcButtons, selectHandler);
  const appendSelect = appendSelectFn(selected, model, changeSelected);
  const calcButtonHandler = calcButtonHandlerFn(setQuery, setMessages, setCalcButtons);
    //Car Info functions  -------------------------------------------------------------

    let compareTrimOptions =
        compareModel === "" || compareModel === "no model" ? [{ value: "no trim", label: "Select A Model First" }] : trims[compareModel].map((trim) => ({ value: trim, label: trim }));

    const handleCarInfoButton = handleCarInfo(selectedModel, selectedTrim, carInfoMode, compareModel, compareTrim, carInfoData, messages, setCarInfoData, setForceUpdate, forceUpdate, fixTrimQueryQuotation)
    const handleCarInfoCompareButton = handleCarComparison(carInfoMode, setCarInfoMode, setSelectedModel, setSelectedTrim);
    const handleModelChange = onModelChange(setSelectedModel, setSelectedTrim, setCompareModel, setCompareTrim);
    const handleTrimChange = onTrimChange(setSelectedTrim, setCompareTrim);


    useEffect(()=>{
      setTrimOptions(getTrimOptions(selectedModel))
    }, [selectedModel])

    const dropDownOptions = [handleModelChange, handleTrimChange, modelOptions, trimOptions, handleCarInfoButton, handleCarInfoCompareButton, compareTrimOptions];

  // --------------------------------------------------------------------->
  //handler for button user clicks
  const handleUserInput = handleUserInputFn(setMessages, changeChoice, setMenuButtons, buyingFordButtons, buyACarButtons, setCalcButtons, model, calcButtonHandler, setCalcStep, trim, setQuery, blockQueries, setResponse);
    
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
        handleUserFlow(query, dealerList, carInfoData, setCarInfoData, extractFiveDigitString, findLocations, handleUserInput, blockQueries, choice, setQuery, zipMode, setZipCode, messages, setMessages, setZipMode, setDistance, setCalcButtons, calcButtonHandler, zipCode, distance, findMode, selectHandler, setFind, appendSelect, setSelect, questionnaireStep, setQuestionnaireAnswers, setQuestionnaireStep, questionnaireAnswers, setForceUpdate, forceUpdate, calcStep, model, setModel, setCalcStep, trim, setTrim, calcMode, setCalcMode, setLeaseStep, setFinanceStep, leaseStep, financeStep, changeChoice, history, setHistory);
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
    trim
  ]);

  return (
    <div className="ButtonContainer">
      <HamburgerMenu onClick = {handleMenuClick}/>
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
            {IntroCardContent}
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
              {
                selectMode && <button onClick= {changeFind}>back</button>
            }
            {calcButtons}
            {
                selectMode && <button onClick = {locateDealerships}>Locate my nearest dealerships</button>
            }
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