import "./styles/App.css";
import OptionButton from "./components/OptionButton";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Fragment, useEffect, useState, useRef } from "react";
import ChatItem from "./components/ChatItem";
import Homepage from "./components/Homepage";
import FordSite from "./components/FordSite";
import carPrices from './jsons/carPrices.json';
import { ThreeDots } from "react-loader-spinner";
import { Mic } from "react-bootstrap-icons";
import EV from './EV.json';
import trims from './trims.json';
import { Brightness4, Brightness7, QueueRounded, TextFields, TextFieldsOutlined } from "@mui/icons-material"
import { extractFiveDigitString, findLocations } from "./mapFunctions"
import QuestionButton from './components/QuestionButton';
import HamburgerMenu from './components/Navbar.js';
import data from './jsons/zipLocations.json';


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
            <Typography variant="h5" component="div" className="welcome">
                Welcome to Ford Chat! 👋
            </Typography>
            <Typography variant="body2" className="introduction">
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
    const [response, setResponse] = useState("");
    const [recording, setRecording] = useState(false);
    // ACCESSIBILITY
    const [textSize, setTextSize] = useState("small");
    const [darkMode, setDarkMode] = useState(false);
    const [zipCode, setZipCode] = useState("");

    const mosToAPR = { 36: .009, 48: .019, 60: .029, 72: .049, 84: .069 };

    const toggleTextSize = () => {
        setTextSize((prevSize) => (prevSize === "small" ? "medium" : (prevSize === "medium" ? "large" : "small")));
    };

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    // PAYMENT CALCULATOR

    //homepage control
    const [showApp, setShowApp] = useState(false);
    const [showHomepage, setShowHomepage] = useState(false);
    const handleClick = () => {
        if (!showHomepage) {
            setShowHomepage(true);
            setShowApp(false);
        } else {
            setShowApp(true);
            setShowHomepage(false);
        }
    };
    //which state the bot is in: closest dealership, calculator, etc.
    const [choice, changeChoice] = useState("");

    // which step of the payment calculator the bot is in: [1]model,[2]trim,[3]lease/finance/buy,[4]price
    const [calcStep, setCalcStep] = useState(0);
    // [1]lease, [2]finance, [3]buy
    const [calcMode, setCalcMode] = useState(0);
    // [1]down payment, [2]trade-in, [3]months, [4]expected miles
    const [leaseStep, setLeaseStep] = useState(0);
    // [1]down payment, [2]trade-in, [3]months, [4]annual %
    const [financeStep, setFinanceStep] = useState(0);
    const [calcButtons, setCalcButtons] = useState([]);
    const [showCalcButtons, setShowCalcButtons] = useState(false);
    const [calcHeadingText, setCalcHeadingText] = useState('');
    const [payment, setPayment] = useState(0);
    const [zipMode, setZipMode] = useState(0);
    const [model, setModel] = useState("");
    const [trim, setTrim] = useState("");
    const [distance, setDistance] = useState('10');
    const [findMode, setFind] = useState(0);
    const [selectMode, setSelect] = useState(false);

    const [selected, changeSelected] = useState({ "Bronco": [], "Bronco Sport": [], "E-Transit Cargo Van": [], "Edge": [], "Escape": [], "Expedition": [], "Explorer": [], "F-150": [], "F-150 Lightning": [], "Mustang Mach-E": [], "Ranger": [], "Transit Cargo Van": [] })
    const origButtons = (
        <div className="buttons">
            <button onClick={() => handleUserInput("A")} className="menu">
                Learn more about our cars
            </button>
            <button onClick={() => handleUserInput("B")} className="menu">
                Dealership finder
            </button>
            <button onClick={() => handleUserInput("C")} className="menu">
                Schedule a test drive
            </button>
            <button onClick={() => handleUserInput("D")} className="menu">
                Payment calculator
            </button>
        </div>
    );
    const [menuButtons, setMenuButtons] = useState(origButtons);
    //map functions -------------------------------------------------------->
    const locateDealerships = () => {
        //go through the dealerships that have the cars we want
        //pass in the list of dealership names
        const dealers = new Set();
        for (const model in selected) {
            for (const t in selected[model]) {

            }
        }
        findLocations(zipCode, distance).then(loc => {
            const places = loc.split('..');
            console.log("places: ")
            console.log(places);
            for (let i = 0; i < places.length - 1; i++) {
                if (i === 0) {
                    setMessages((m) => [...m, { msg: places[i], author: "Ford Chat.", line: false, zip: { zipcode: extractFiveDigitString(zipCode), dist: distance } }]);
                }
                else if (i === places.length - 2) {
                    setMessages((m) => [...m, { msg: places[i], author: "", line: true, zip: {} }]);
                }
                else {
                    setMessages((m) => [...m, { msg: places[i], author: "", line: false, zip: {} }]);
                }
            }
            setZipMode(0);
        })
    }
    const changeFind = () => {
        setFind(0);
        setSelect(false);
        setCalcButtons(Object.keys(trims).map(model => (<button className='model-button' style={{width:'140px',height:'100px', textAlign:'center',wordWrap:'wrap',overflowWrap:'wrap'}} key={model} value={model} onClick={selectHandler}>{model}</button>)));
    }
    const appendSelect = (event) => {
        let val = event.target.getAttribute('value');
        console.log(val);
        console.log(selected[model]);
        if (val in selected[model]) {
            let copy = selected[model]
            delete copy[val];
            let copy2 = selected
            delete copy2[model]
            copy2[model] = copy
            changeSelected(copy2);
        }
        else {
            let copy = selected[model]
            copy.push(val)
            let copy2 = selected
            delete copy2[model]
            copy2[model] = copy
            changeSelected(copy2)
        }
        console.log(selected);
    }
    const calcButtonHandler = (event) => {
        let val = event.target.getAttribute('value');
        setQuery(val);
        setMessages((m) => [...m, { msg: val, author: "You" }]);
        setCalcButtons([]);
        setShowCalcButtons(false);
    }
    const selectHandler = (event) => {
        let val = event.target.getAttribute('value');
        setQuery(val);
        setModel(val);
        setCalcButtons([]);
        setShowCalcButtons(false);
        setFind(1);
    }

    const handleUserInput = (option) => {
        // Outputs a response to based on input user selects
        switch (option) {
            case 'A':
                setMessages((m) => [...m, { msg: "Ask a question to know more about our cars", author: "Ford Chat", line: true, zip: {} }]);
                changeChoice('A');
                break;
            case 'B':
                setMessages((m) => [...m, { msg: "Please enter your zipcode below:", author: "Ford Chat", line: true, zip: {} }]);
                changeChoice('B');
                setMenuButtons([]);
                break;
            case 'C':
                setMessages((m) => [...m, { msg: "Please select 1-3 models/trims of the specific cars you are looking for.", author: "Ford Chat", line: true, zip: "" }]);
                setCalcButtons(Object.keys(trims).map(model => (<button className='model-button' style={{width:'140px',height:'100px', textAlign:'center',wordWrap:'wrap',overflowWrap:'wrap'}} key={model} value={model} onClick={selectHandler}>{model}</button>)));
                setShowCalcButtons(true);
                changeChoice('C');
                setMenuButtons([]);
                break;
            case "D":
                if (model === "") {
                    setMessages((m) => [
                        ...m,
                        { msg: "What model are you interested in?", author: "Ford Chat" },
                    ]);
                    setCalcHeadingText('Choose specific model');
                    setShowCalcButtons(true);
                    setCalcButtons(
                        Object.keys(trims).map((model) => (
                            <button
                                className="model-button"
                                style={{width:'140px',height:'100px', textAlign:'center',wordWrap:'wrap',overflowWrap:'wrap'}}
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
                    setMessages((m) => [
                        ...m,
                        { msg: `Ford ${model}`, author: "You" },
                    ]);
                    setQuery(model);
                    setCalcStep(1);
                    blockQueries.current = false;
                } else {
                    setMessages((m) => [
                        ...m,
                        { msg: `Ford ${model} ${trim}`, author: "You" },
                    ]);
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

    // const blockQueries = useRef(false);
    const recognition = useRef(null);

    useEffect(() => {
        // Check if speech recognition is supported
        if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
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
        if (query.toLowerCase() === 'a' || query.toLowerCase() === 'b' || query.toLowerCase() === 'c' || query.toLowerCase() === 'd') {
            handleUserInput(query.toUpperCase());
        }
        else {
            if (!blockQueries.current && query.length > 0) {
                blockQueries.current = true;
                switch (choice) {
                    case 'A':
                        setQuery("");
                        sendBotResponse(query, history).then((res) => {
                            setMessages((m) => [...m, { msg: res, author: "Ford Chat", line: true, zip: {} }]);
                            setHistory((h) => [...h.slice(-4), { q: query, a: res }]);
                            blockQueries.current = false;
                        })
                        break;
                    case 'B':
                        {
                            if (zipMode != "") {
                                findLocations(zipCode, query).then(loc => {
                                    const places = loc.split('..');
                                    for (let i = 0; i < places.length - 1; i++) {
                                        if (i === 0) {
                                            setMessages((m) => [...m, { msg: places[i], author: "Ford Chat.", line: false, zip: { zipcode: extractFiveDigitString(zipCode), dist: query } }]);
                                        }
                                        else if (i === places.length - 2) {
                                            setMessages((m) => [...m, { msg: places[i], author: "", line: true, zip: {} }]);
                                        }
                                        else {
                                            setMessages((m) => [...m, { msg: places[i], author: "", line: false, zip: {} }]);
                                        }
                                    }
                                    setZipMode("");
                                })
                            }
                            else {
                                setZipCode(query)
                                setMessages((m) => [...m, { msg: "Select the radius of dealerships you would like to look for in miles", author: "Ford Chat", line: true, zip: "" }]);
                                setZipMode("query");
                            }
                            blockQueries.current = false;
                            break;
                        }
                    case 'C':
                        {
                            {
                                if (zipMode != "") {
                                    findLocations(zipCode, query).then(loc => {
                                        const places = loc.split('..');
                                        setMessages((m) => [...m, { msg: "", author: "Ford Chat..", line: false, zip: { zipcode: "", dist: "" }, locs: places.slice(0, places.length - 1) }]);
                                        for (let i = 0; i < places.length - 1; i++) {
                                            if (i === 0) {
                                                setMessages((m) => [...m, { msg: places[i], author: "Ford Chat.", line: false, zip: { zipcode: extractFiveDigitString(zipCode), dist: query } }]);
                                            }
                                            else if (i === places.length - 2) {
                                                setMessages((m) => [...m, { msg: places[i], author: "", line: true, zip: {} }]);
                                            }
                                            else {
                                                setMessages((m) => [...m, { msg: places[i], author: "", line: false, zip: {} }]);
                                            }
                                        }
                                        setZipMode("");
                                    })
                                }
                                else {
                                    setZipCode(query)
                                    setMessages((m) => [...m, { msg: "Select the radius of dealerships you would like to look for in miles", author: "Ford Chat", line: true, zip: "" }]);
                                    setZipMode("query");
                                }
                                blockQueries.current = false;
                            }
                        }
                        break;
                    case 'D':
                        setQuery("");
                        switch (calcStep) {
                            case 1: //trim 
                                if (model === '') {
                                    setModel(query);
                                }
                                setCalcHeadingText('Choose specific trim');
                                setMessages((m) => [...m, { msg: "What trim are you interested in?", author: "Ford Chat", line: true }]);
                                setShowCalcButtons(true);
                                setCalcButtons(trims[query].map(trim => (<button className='model-button' style={{width:'140px',height:'100px', textAlign:'center',wordWrap:'wrap',overflowWrap:'wrap'}} key={trim} value={trim} onClick={calcButtonHandler}>{trim}</button>)));
                                blockQueries.current = false;
                                setCalcStep(2);
                                break;
                            case 2: //lease,finance,buy
                                if (trim === '') {
                                    setTrim(query);
                                }
                                setCalcHeadingText('Choose purchase type');
                                const options = ['Lease', 'Finance', 'Buy'];
                                setMessages((m) => [...m, { msg: "Would you like to lease, finance, or buy?", author: "Ford Chat", line: true }]);
                                setShowCalcButtons(true);
                                setCalcButtons(options.map(option => (<button className='calc-button' key={option} value={option} onClick={calcButtonHandler}>{option}</button>)));
                                blockQueries.current = false;
                                setCalcStep(3);
                                break;
                            case 3:
                                setPayment(carPrices[model][trim]);
                                switch (calcMode) {
                                    case 0:
                                        if (query === "Lease") {
                                            setMessages((m) => [...m, { msg: "Please enter your down payment (enter 0 for none)", author: "Ford Chat", line: true }]);
                                            setCalcMode(1);
                                            setLeaseStep(1);
                                        }
                                        else if (query === "Finance") {
                                            setMessages((m) => [...m, { msg: "Please enter your down payment (enter 0 for none)", author: "Ford Chat", line: true }]);
                                            setCalcMode(2);
                                            setFinanceStep(1);
                                        }
                                        else if (query === "Buy") {
                                            setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                                            setCalcStep(4);
                                            setCalcMode(3);
                                        }
                                        blockQueries.current = false;
                                        break;
                                    case 1: // lease
                                        switch (leaseStep) {
                                            case 1: // trade-in
                                                setPayment(payment => {return (payment - query)});
                                                setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                                                blockQueries.current = false;
                                                setLeaseStep(2);
                                                break;
                                            case 2: // months
                                                setPayment(payment => {return (payment - query)});
                                                let durations = [24, 36, 39, 48];
                                                setCalcHeadingText('Choose lease duration (months)');
                                                setMessages((m) => [...m, { msg: "Please select the desired lease duration, in months", author: "Ford Chat", line: true }]);
                                                setShowCalcButtons(true);
                                                setCalcButtons(durations.map(dur => (<button className='calc-button' key={dur.toString()} value={dur} onClick={calcButtonHandler}>{dur.toString()}</button>)));
                                                blockQueries.current = false;
                                                setLeaseStep(3);
                                                break;
                                            case 3: // miles
                                                setMessages((m) => [...m, { msg: "Please enter the expected miles driven annually", author: "Ford Chat", line: true }]);
                                                blockQueries.current = false;
                                                setLeaseStep(0);
                                                setCalcStep(4);
                                                break;
                                        }
                                        break;
                                    case 2: // finance
                                        switch (financeStep) {
                                            case 1: // trade-in
                                                setPayment(payment => {return (payment - query)});
                                                setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                                                blockQueries.current = false;
                                                setFinanceStep(2);
                                                break;
                                            case 2: // months
                                                setPayment(payment => {return (payment - query)});
                                                let durations = [36, 48, 60, 72, 84];
                                                setCalcHeadingText('Choose loan duration (months)');
                                                setMessages((m) => [...m, { msg: "Please select the desired loan duration, in months", author: "Ford Chat", line: true }]);
                                                setShowCalcButtons(true);
                                                setCalcButtons(durations.map(dur => (<button className='calc-button' key={dur.toString()} value={dur} onClick={calcButtonHandler}>{dur.toString()}</button>)));
                                                blockQueries.current = false;
                                                setFinanceStep(0);
                                                setCalcStep(4);
                                                break;
                                        }
                                        break;
                                }
                                break;
                            case 4:
                                let final = 0;
                                switch (calcMode) {
                                    case 1: // lease
                                        setPayment('0');
                                        final = payment;
                                        break;
                                    case 2: // finance 
                                        let apr = mosToAPR[query];
                                        setPayment(payment => {return (((apr/12)*payment)/(1-((1+(apr/12))**(0-query))))});
                                        final = ((apr/12)*payment)/(1-((1+(apr/12))**(0-query)));
                                        break;
                                    case 3: // buy
                                        setPayment(payment => { return (payment - query)});
                                        final = payment - query;
                                        break;
                                }
                                setMessages((m) => [...m, { msg: `Your expected monthly payment is ${Math.round(final)}`, author: "Ford Chat", line: true }]);
                                blockQueries.current = false;
                                setCalcStep(5);
                            case 5:
                                if (model in Object.keys(EV)) {
                                    if (trim in EV[model]) {
                                        setMessages((m) => [...m, { msg: "Would you like car delivery or pickup?", author: "Ford Chat", line: true }]);
                                        setCalcStep(6);
                                    }
                                }
                                else {
                                    setMessages((m) => [...m, { msg: "Would you like to send a request to the dealer?", author: "Ford Chat", line: true }]);
                                    // send to negotiation assistance
                                }
                                blockQueries.current = false;
                            case 6:
                                if (query.includes('deliver')) {
                                    setMessages((m) => [...m, { msg: "Enter your delivery address", author: "Ford Chat", line: true }]);
                                }
                                else if (query.includes('pick')) {
                                    setMessages((m) => [...m, { msg: "Type in your zip code to find the nearest dealership", author: "Ford Chat", line: true }]);
                                    changeChoice('B');
                                    blockQueries.current = false;
                                    setCalcStep(0);
                                    setCalcMode(0);  
                                }
                                break;
                        }
                        break;
                    default:
                        setQuery("");
                        sendBotResponse(query, history).then((res) => {
                            setMessages((m) => [...m, { msg: res, author: "Ford Chat", line: true, zip: {} }]);
                            setHistory((h) => [...h.slice(-4), { q: query, a: res }]);
                            blockQueries.current = false;
                        })
                        break;

                }

            }
        }
    }, [query, history, calcStep, calcMode, leaseStep, financeStep, choice, menuButtons, model, trim]);

    return showApp ? (
        <div className="ButtonContainer">
            <HamburgerMenu />
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
                                    line={message.line}
                                    darkMode={darkMode}
                                    textSize={textSize}
                                    zip={message.zip}
                                    locs={message.locs}
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
                    <div style={{display:'flex',justifyContent:'center',textAlign:'center'}}>
                        {showCalcButtons && <div className='model-box'>
                                <div style={{marginTop:'5px',color:'#322964',fontSize:'18px',fontWeight:'bold',lineHeight:'60px'}}>{calcHeadingText}</div>
                                <div className='button-container'>{calcButtons}</div>
                            </div>}
                        </div>
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
                                selectMode && <button onClick={changeFind}>back</button>
                            }
                            {
                                selectMode && <button onClick={locateDealerships}>Locate my nearest dealerships</button>
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
                            label={"Enter your query here..."}
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
        </div>
    ) : showHomepage ? (
        <Homepage handleClick={handleClick} />
    ) : (
        <FordSite handleClick={handleClick} />
    );
}

export default App;
