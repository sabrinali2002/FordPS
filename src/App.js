import "./styles/App.css";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import ChatItem from "./components/ChatItem";
import AccessibilityButton from "./components/AccessibilityButton";
import { ThreeDots } from "react-loader-spinner";
import { Mic } from "react-bootstrap-icons";
import Autofill from './components/Autofill';
import trims from "./jsons/trims.json";
import TopBar from "./components/TopBar";

import {
  Brightness4,
  Brightness7,
  TextFields,
  TextFieldsOutlined,
} from "@mui/icons-material";
import { extractFiveDigitString, findLocations, selectHandlerFn, locateDealershipsFn, calcButtonHandlerFn, appendSelectFn, changeFindFn } from "./modules/mapFunctions";
import { modelOptions, getTrimOptions } from "./modules/tableFunctions";
import { handleCarInfo, handleCarComparison, onModelChange, onTrimChange, onCheckBoxSelect, onCompare, onTableBack} from "./modules/selectCarFunctions";
import { handleUserInputFn, handleUserFlow } from "./modules/userFlowFunctions";

import QuestionButton from "./components/QuestionButton";
import HamburgerMenu from "./components/Navbar.js";

const fixTrimQueryQuotation = (model, query) => {
    console.log("model: " + model, "original query: " + query);
    if (model !== "Transit Cargo Van" && model !== "E-Transit Cargo Van") {
        return query;
    }
    let trimStartIndex = query.indexOf('trim = "') + 8;
    if (trimStartIndex - 8 !== -1) {
        query = query.slice(0, trimStartIndex) + '\\"' + query.slice(trimStartIndex);
        trimStartIndex += 2;
        let trimName = query.substring(trimStartIndex, query.length - 1);
        let modified = trimName.replace(/"/g, '\\"\\"');
        query = query.replace(trimName, modified);
        query = query.slice(0, query.length - 1) + "\\" + query.slice(query.length - 1);
        query += '"';
    }
    return query;
};

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
    const [optionButtons, setOptionButtons] = useState("")
    const toggleTextSize = () => {
        setTextSize((prevSize) => (prevSize === "small" ? "medium" : prevSize === "medium" ? "large" : "small"));
    };

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    // PAYMENT CALCULATOR

    //which state the bot is in:
    const [choice, changeChoice] = useState("");
    const [forceUpdate, setForceUpdate] = useState(true);
    // which step of the payment calculator the bot is in: [1]model,[2]trim,[3]lease/finance/buy,[4]price
    const [calcStep, setCalcStep] = useState(0);
    const [questionnaireStep, setQuestionnaireStep] = useState(0);
    // [1]lease, [2]finance, [3]buy
    const [calcMode, setCalcMode] = useState(0);
    // [1]down payment, [2]trade-in, [3]months, [4]expected miles
    const [leaseStep, setLeaseStep] = useState(0);
    // [1]down payment, [2]trade-in, [3]months, [4]annual %
    const [financeStep, setFinanceStep] = useState(0);
    const [calcButtons, setCalcButtons] = useState([]);
    const [zipMode, setZipMode] = useState(0);
    const [trimOptions, setTrimOptions] = useState([]);
    const [infoMode, setInfoMode] = useState(0);
    const [vehicle, setVehicle] = useState("");
    const [cat, setCat] = useState("");
    const [showCalcButtons, setShowCalcButtons] = useState(false);
    const [calcHeadingText, setCalcHeadingText] = useState("");
    const [payment, setPayment] = useState(0);

    // Car Info states
    const [model, setModel] = useState("");
    const [trim, setTrim] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedTrim, setSelectedTrim] = useState("");
    const [selectedCar, setSelectedCar] = useState(0);
    const [compareModel, setCompareModel] = useState("");
    const [compareTrim, setCompareTrim] = useState("");
    const [carInfoData, setCarInfoData] = useState({});
    const [carInfoMode, setCarInfoMode] = useState("single");
    const [questionnaireAnswers, setQuestionnaireAnswers] = useState([]);
    const [tableForceUpdate, setTableForceUpdate] = useState(false);
    const [selectedCars, setSelectedCars] = useState([]);

    const blockQueries = useRef(false);
    const recognition = useRef(null);
    //map functions -------------------------------------------------------->

  const [distance, setDistance] = useState("10");
  const [findMode, setFind] = useState(0);
  const [selectMode, setSelect] = useState(false);
  const s = new Set();
  const [dealerList, setDealers] = useState(s);
  const [selected, changeSelected] = useState({"Bronco": [],"Bronco Sport":[],"E-Transit Cargo Van":[],"Edge":[],"Escape":[],"Expedition":[],"Explorer":[],"F-150":[],"F-150 Lightning":[],"Mustang Mach-E":[],"Ranger":[],"Transit Cargo Van":[]})
  
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages]);
  
  const handleMenuClick = (parameter) => {
    handleUserInput(parameter);
    if(parameter!=="A")
    setMenuButtons([]);
    // Perform any other logic or function in the parent component using the parameter
  };
  const origButtons = (
    <div className="buttons">
      <button className = "menu button-standard" onClick={()=>{
        setMessages(m=>{return [...m, {msg: "Buying a Ford", author: "You"}]})
        setMessages(m=>{return [...m, {msg: "What info would you like to know?", author: "Ford Chat"}]})
        setMenuButtons(buyingFordButtons)
        }}>Buying a Ford</button>
      <button className = "menu button-standard" onClick={()=>{
        setMessages(m=>{return [...m, {msg: "I'm an Existing Owner", author: "You"}]})
        setMessages(m=>{return [...m, {msg: "", author: "Login"}]})
        }}>I'm an Existing Owner</button>
      <button className = "menu button-standard" onClick={()=>{
        setMessages(m=>{return [...m, {msg: "Info about Ford", author: "You"}]})
        }}>Info about Ford</button>
      <button className = "menu button-standard" onClick={()=>{
        setMessages(m=>{return [...m, {msg: "Negotiation Assistance", author: "You"}]})
        }}>Negotiation Assistance</button>
    </div>
  );
  const buyingFordButtons = (
    <div className = "buttons">
       <button className = "menu button-standard" onClick={() => {
        handleUserInput('I');
        setMenuButtons([]);
        }}>Info about a specific car</button>
      <button className = "menu button-standard" onClick={() => {
        handleUserInput('A');
        }}>Car recommendation</button>
      <button className = "menu button-standard" onClick={() => {
        handleUserInput('D');
        setMenuButtons([]);
        }}>Car pricing estimator</button>
      <button className = "menu button-standard" onClick={() => {
        handleUserInput('B');
        setMenuButtons([]);
        }}>Find a dealership</button>
      <button className = "menu button-standard" onClick={() => {
        handleUserInput('C');
        setMenuButtons([]);
        }}>Schedule a test drive</button>
    </div>
  )
  const buyACarButtons = (
    <div className="buttons">
      <button className="menu button-standard" onClick={()=>{
        setMessages(m=>{return [...m, {msg: "Great! What kind of car are you looking for?", author: "Ford Chat"}]})
        changeChoice("A");
        setMenuButtons([])
        }}>Ask my own questions</button>
      <button className="menu button-standard" onClick={()=>{
        setMessages((m) => [...m,{ msg: "Take questionnaire", author: "You", line: true }]);
        setMessages(m=>{return [...m, {msg: "Great! What is your budget range for purchasing a car?", author: "Ford Chat"}]})
        changeChoice("Q");
        setMenuButtons([])
        setQuestionnaireStep(1)
      }}>Take questionnaire</button>
    </div>
  );
  const [menuButtons, setMenuButtons] = useState(origButtons);
    //map functions -------------------------------------------------------->
    const selectHandler = selectHandlerFn(setQuery, setModel, setCalcButtons, setFind);
    const locateDealerships = locateDealershipsFn(setDealers, setCalcButtons, setSelect, selected, setFind, changeSelected, zipCode, distance, setMessages, setZipMode);
    const changeFind = changeFindFn(setFind, setSelect, setCalcButtons, selectHandler);
    const appendSelect = appendSelectFn(selected, model, changeSelected);
    const calcButtonHandler = calcButtonHandlerFn(setQuery, setMessages, setCalcButtons, setShowCalcButtons);
    //Car Info functions  -------------------------------------------------------------
    let compareTrimOptions =
        compareModel === "" || compareModel === "no model" ? [{ value: "no trim", label: "Select A Model First" }] : trims[compareModel].map((trim) => ({ value: trim, label: trim }));
    const handleCarInfoButton = handleCarInfo(tableForceUpdate, setTableForceUpdate,model, trim, carInfoMode, compareModel, compareTrim, carInfoData, messages, setCarInfoData, setForceUpdate, forceUpdate, fixTrimQueryQuotation, setSelectedCars);
    const handleCarInfoCompareButton = handleCarComparison(carInfoMode, setCarInfoMode, setSelectedModel, setSelectedTrim);
    const handleModelChange = onModelChange(setSelectedModel, setSelectedTrim, setCompareModel, setCompareTrim, trims);
    const handleTrimChange = onTrimChange(setSelectedTrim, setCompareTrim);
    const handleCheckboxSelect = onCheckBoxSelect(selectedCars, setSelectedCars, carInfoData, setCarInfoData);
    const handleCompareButton = onCompare(setCarInfoMode);
    const handleTableBackButton = onTableBack(setCarInfoMode);

    useEffect(() => {
        setTrimOptions(getTrimOptions(model));
    }, [model]);

    const dropDownOptions = [handleModelChange, handleTrimChange, modelOptions, trimOptions, handleCarInfoButton, handleCarInfoCompareButton, compareTrimOptions];
    const tableFunctions = [handleCheckboxSelect, handleCompareButton, handleTableBackButton];

    // --------------------------------------------------------------------->
    //handler for button user clicks
    const handleUserInput = handleUserInputFn(
        setMessages,
        changeChoice,
        setMenuButtons,
        buyACarButtons,
        setCalcButtons,
        model,
        setModel,
        calcButtonHandler,
        setCalcStep,
        trim,
        setQuery,
        blockQueries,
        setResponse,
        setShowCalcButtons,
        setCalcHeadingText,
        setInfoMode,
        cat,
        setCat
    );

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

    const handleMoreInfo = () => {
      setMessages((m) => [...m, { msg: "", author: "Table" }]);
    };

    // useEffect(()=>{handleMoreInfo()}, [tableForceUpdate]);

    useEffect(() => {
        handleUserFlow(
            tableForceUpdate, 
            setTableForceUpdate,
            handleMoreInfo,
            handleCarInfoButton,
            fixTrimQueryQuotation,
            query,
            dealerList,
            carInfoData,
            setCarInfoData,
            extractFiveDigitString,
            findLocations,
            handleUserInput,
            blockQueries,
            choice,
            setQuery,
            zipMode,
            setZipCode,
            messages,
            setMessages,
            setZipMode,
            setDistance,
            setCalcButtons,
            calcButtonHandler,
            zipCode,
            distance,
            findMode,
            selectHandler,
            setFind,
            appendSelect,
            setSelect,
            questionnaireStep,
            setQuestionnaireAnswers,
            setQuestionnaireStep,
            questionnaireAnswers,
            setForceUpdate,
            forceUpdate,
            calcStep,
            model,
            setModel,
            setCalcStep,
            trim,
            setTrim,
            calcMode,
            setCalcMode,
            setLeaseStep,
            setFinanceStep,
            leaseStep,
            financeStep,
            changeChoice,
            history,
            setHistory,
            infoMode,
            setInfoMode,
            vehicle,
            setVehicle,
            showCalcButtons,
            setShowCalcButtons,
            calcHeadingText,
            setCalcHeadingText,
            payment,
            setPayment,
            setMenuButtons,
            locateDealershipsFn,
            changeSelected,
            setDealers,
            selected,
            cat,
            setCat,
            origButtons,
            setOptionButtons
        );
    }, [query, history, calcStep, calcMode, leaseStep, financeStep, choice, menuButtons, model, trim]);

  return (
    <div style={{width: '100%', height: '100vh', overflow:'hidden'}}>
      <div className="topbar"><TopBar handleClick={()=>{
        setMessages([]);
        setMenuButtons([origButtons]);
        setCalcButtons([]);
        }}/></div>
      <div className="topbarback"></div>
      <div className="divider"></div>
      <div className="burger"><HamburgerMenu onClick = {handleMenuClick}/></div>
      <AccessibilityButton 
          toggleTextSize={toggleTextSize} 
          toggleDarkMode={toggleDarkMode} 
          queryText={queryText} 
          setQueryText={setQueryText}
          darkMode={darkMode}
          textSize={textSize}/>
      <div className="fullpage"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: darkMode ? "#000080" : "white",
          color: darkMode ? "#ffffff" : "#000000",
          width: '100%',
          height: '100%',
          fontSize:
            textSize === "large"
              ? "25px"
              : textSize === "small"
              ? "19px"
              : "22px",
        }}
      >
        <div className="ChatArea">

        <div className="MessagesArea">
            <div>
              <p>{response}</p>
            </div>
            {messages.map((message, index) => {
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
                setMessages={setMessages}
                setMenuButtons={setMenuButtons}
                handleUserInput={handleUserInput}
                carSpecInfo = {message.carInfo}
                selectedCar = {selectedCar}
                setSelectedCar = {setSelectedCar}
                                    tableFunctions={tableFunctions}
                                    messageIndex={index}
                                    selectedCars={selectedCars}
              />
              );
            })}
            {optionButtons}
          </div>
            {showCalcButtons && <div style={{display:'flex',justifyContent:'center',textAlign:'center',marginTop:'10px',marginBottom:'15px'}}>
                <div className='model-box'>
                    <div style={{marginTop:'10px',color:'#322964',fontSize:'20px',fontWeight:'bold',lineHeight:'30px'}}>{calcHeadingText}</div>
                    <div style={{color:'#322964',fontSize:'12px',fontWeight:'bold',lineHeight:'20px'}}>Select from the options to specify which cars you are looking for</div>
                    <div className='button-container'>{calcButtons}</div>
                    {vehicle !== "" && <button style = {{position: "relative", bottom: 0, alignSelf:'start', marginLeft:-40, alignSelf:'start'}} onClick = {() => {
                      if(infoMode === 1){
                        handleUserInput('I')
                      }
                      else{
                        setQuery(cat);
                        setInfoMode(infoMode-1)
                        handleUserFlow(
                            tableForceUpdate,
                            setTableForceUpdate,
                            handleMoreInfo,
                            handleCarInfoButton,
                            fixTrimQueryQuotation,
                            query,
                            dealerList,
                            carInfoData,
                            setCarInfoData,
                            extractFiveDigitString,
                            findLocations,
                            handleUserInput,
                            blockQueries,
                            choice,
                            setQuery,
                            zipMode,
                            setZipCode,
                            messages,
                            setMessages,
                            setZipMode,
                            setDistance,
                            setCalcButtons,
                            calcButtonHandler,
                            zipCode,
                            distance,
                            findMode,
                            selectHandler,
                            setFind,
                            appendSelect,
                            setSelect,
                            questionnaireStep,
                            setQuestionnaireAnswers,
                            setQuestionnaireStep,
                            questionnaireAnswers,
                            setForceUpdate,
                            forceUpdate,
                            calcStep,
                            model,
                            setModel,
                            setCalcStep,
                            trim,
                            setTrim,
                            calcMode,
                            setCalcMode,
                            setLeaseStep,
                            setFinanceStep,
                            leaseStep,
                            financeStep,
                            changeChoice,
                            history,
                            setHistory,
                            infoMode,
                            setInfoMode,
                            vehicle,
                            setVehicle,
                            showCalcButtons,
                            setShowCalcButtons,
                            calcHeadingText,
                            setCalcHeadingText,
                            payment,
                            setPayment,
                            setMenuButtons,
                            locateDealershipsFn,
                            changeSelected,
                            setDealers,
                            selected,
                            cat,
                            setCat,
                            origButtons,
                            setOptionButtons);
                      }
                    }
                    }><u style={{position:'relative',marginLeft:'0px',bottom:'0px',fontSize:'12px'}}>Back</u></button>}
                    </div>
                </div>}
          <ThreeDots
            height="50"
            width="50"
            radius="7"
            color="#8080ff"
            ariaLabel="three-dots-loading"
            wrapperStyle={{ marginLeft: "10%" }}
            wrapperClassName=""
            visible={blockQueries.current}
            style={{flex: 'none'}}
          />
          <div ref={messagesEndRef}/>
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
            {
                selectMode && <button onClick = {locateDealerships}>Locate the nearest dealerships</button>
            }
            </div>
            <div className="textfield">
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
                fontFamily: 'Antenna, sans-serif',
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
            </div>
          </form>
        </div>
        <div className="bottom">
          </div>
      </div>
    </div>)
}

export default App;
