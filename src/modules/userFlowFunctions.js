import trims from "../jsons/trims.json";
import vehicles from "../jsons/vehicleCategories.json"
import { sendBotResponse, sendRecommendRequestToServer } from "./botResponseFunctions";
import handleDealerFlow from "./user_flows/handleDealerFlow";
import handlePaymentFlow from "./user_flows/handlePaymentFlow";
import handleInfoFlow from "./user_flows/handleInfoFlow"

export function handleUserInputFn(setMessages, changeChoice, setMenuButtons, buyingFordButtons, buyACarButtons, setCalcButtons, model, calcButtonHandler, setCalcStep, trim, setQuery, blockQueries, setResponse, setShowCalcButtons, setCalcHeadingText) {
    return (option) => {
      // Outputs a response to based on input user selects
      switch (option) {
        case 'I':
          setMessages((m) => [...m, { msg: "Info on a specific car", author: "You"}]);
          setMessages((m) => [...m, { msg: "Please select 1-3 models/trims of the specific cars you're looking for", author: "Ford Chat", line: true, zip: "" }]);
          setCalcButtons(Object.keys(vehicles).map(vehicle => (<button className='calc-button' key={vehicle} value={vehicle} onClick = {()=>setQuery(vehicle)}>{vehicle}</button>)));
          // setMessages((m) => [...m, { msg: "", author: "DropDown", line: false, zip: "" }]);
          // setMessages((m) => [...m, { msg: "", author: "Table", line: false, zip: "" }]);
          changeChoice('I');
          break;
        case "A":
          setMessages((m) => [...m, { msg: "Car recommendation", author: "You"}]);
          setMessages((m) => [
            ...m,
            {
              msg: "Happy to help! Do you have specific needs in mind, or would you like to fill out our questionnaire?",
              author: "Ford Chat",
              line: true,
              zip: {},
            },
          ]);
          setMenuButtons([buyACarButtons]);
          break;
          case 'B':
            setMessages((m) => [...m, { msg: "Find a dealership", author: "You" }]);
            setMessages((m) => [...m, { msg: "Please enter your zipcode below:", author: "Ford Chat", line:true,zip:{} }]);
            changeChoice('B');
            break;
          case 'C':
            setMessages((m) => [...m, { msg: "Schedule a test drive", author: "You"}]);
            setMessages((m) => [...m, { msg: "Please enter your zipcode or enable location to continue:", author: "Ford Chat", line:true,zip:{} }]);
            changeChoice('C');
            break;
        case "D":
          if (model === "") {
            setMessages((m) => [
              ...m,
              { msg: "What model are you interested in?", author: "Ford Chat" },
            ]);
            setCalcHeadingText("Choose specific model");
            setShowCalcButtons(true);
            setCalcButtons(
              Object.keys(trims).map((model) => (
                <button
                  className="model-button"
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
  }

  export function handleUserFlow(query, dealerList, carInfoData, setCarInfoData, extractFiveDigitString, findLocations, handleUserInput, blockQueries, choice, setQuery, zipMode, setZipCode, messages, setMessages, setZipMode, setDistance, setCalcButtons, calcButtonHandler, zipCode, distance, findMode, selectHandler, setFind, appendSelect, setSelect, questionnaireStep, setQuestionnaireAnswers, setQuestionnaireStep, questionnaireAnswers, setForceUpdate, forceUpdate, calcStep, model, setModel, setCalcStep, trim, setTrim, calcMode, setCalcMode, setLeaseStep, setFinanceStep, leaseStep, financeStep, changeChoice, history, setHistory, infoMode, setInfoMode, vehicle, setVehicle, showCalcButtons, setShowCalcButtons, calcHeadingText, setCalcHeadingText, payment, setPayment) {
    if (!blockQueries.current && query.length > 0) {
        blockQueries.current = true;
        switch (choice) {
          case "I":
            setMessages((m) => [
              ...m,
              { msg: "Info about a specific car", author: "You", line: true },
            ]);
            if(infoMode === 0){
              setCalcButtons(Object.keys(vehicles[query]).map(model => (<button className='calc-button' key={model} value={model} onClick={()=>setQuery(model)}>{model}</button>)));
              setVehicle(query);
              setInfoMode(1);
            }
            else if(infoMode === 1){
              setModel(query);
              setCalcButtons(vehicles[vehicle][query].map(trim => (<button className='calc-button' key={trim} value={trim} onClick={()=>{
                handleInfoFlow(model,trim, setMessages, setModel, setQuery, setInfoMode, setCalcButtons);
                setInfoMode(2);
              }}>{trim}</button>)));
            }
            else{
              setMessages((m)=>[...m,{msg: "hihihihihi", author: "Ford Chat", line:true,zip:""}]);
            }
            blockQueries.current = false;
            break;
          case 'A':
            setMessages((m) => [
              ...m,
              { msg: "Car recommendation", author: "You", line: true },
            ]);
            setQuery("");
            sendRecommendRequestToServer(query, history, carInfoData, messages, forceUpdate, blockQueries, setCarInfoData, setMessages, setForceUpdate, setHistory);
            break;
          case "B": {
            setMessages((m) => [
              ...m,
              { msg: "Find a dealership", author: "You", line: true },
            ]);
            handleDealerFlow(zipMode, dealerList, setZipCode, query, setMessages, extractFiveDigitString, setZipMode, setDistance, findLocations, zipCode, distance);
            blockQueries.current = false;
            break;
          }
          case "C":
            setMessages((m) => [
              ...m,
              { msg: "Schedule a test drive", author: "You", line: true },
            ]);
            {
              if(findMode === 0){
                setZipCode(query)
                setMessages((m)=>[...m,{msg: "Please select 1-3 models/trims of the specific cars you are looking for.", author: "Ford Chat", line:true,zip:""}]);
                setCalcButtons(Object.keys(trims).map(model => (<button className='model-button' key={model} value={model} onClick={selectHandler}>{model}</button>)));
                setFind(1);
              }
              else if(findMode === 1){
                  setCalcButtons(trims[query].map(trim => (<button className='model-button' key={trim} value={trim} onClick={appendSelect}>{trim}</button>)));
                  setSelect(true);
              }
              blockQueries.current = false;
              break;
          }
          case "Q":
            switch (questionnaireStep) {
              case 1:
                setMessages(m => [...m, { msg: "Are you interested in a specific type of vehicle, such as a cargo van, SUV, hatchback, or pickup truck?", author: "Ford Chat" }]);
                setQuestionnaireAnswers(q => [...q, query]);
                setQuestionnaireStep(2);
                blockQueries.current = false;
                break;
              case 2:
                setMessages(m => [...m, { msg: "How do you plan to use the car? Will it be primarily for commuting, family use, off-roading, or business purposes?", author: "Ford Chat" }]);
                setQuestionnaireAnswers(q => [...q, query]);
                setQuestionnaireStep(3);
                blockQueries.current = false;
                break;
              case 3:
                setMessages(m => [...m, { msg: "How many passengers do you need to accommodate regularly? ", author: "Ford Chat" }]);
                setQuestionnaireAnswers(q => [...q, query]);
                setQuestionnaireStep(4);
                blockQueries.current = false;
                break;
              case 4:
                //setQuestionnaireAnswers(q=>[...q, query])
                let questionnaireAnswersCopy = [...questionnaireAnswers, query];
                setForceUpdate(!forceUpdate);
                const ultimateQueryString = "Here is my budget: " + questionnaireAnswersCopy[0] + ". I am looking for a " + questionnaireAnswersCopy[1] + ". I will primarily use it for the following: " + questionnaireAnswersCopy[2] + ". I need a seating capacity of at least: " + questionnaireAnswersCopy[3];
                sendRecommendRequestToServer(ultimateQueryString, history, carInfoData, messages, forceUpdate, blockQueries, setCarInfoData, setMessages, setForceUpdate, setHistory);
            }
            break;
          case "D":
            setQuery("");
            setMessages((m) => [
              ...m,
              { msg: "Car pricing estimator", author: "You", line: true },
            ]);
            handlePaymentFlow(calcStep, model, setModel, query, setMessages, setCalcButtons, calcButtonHandler, blockQueries, setCalcStep, trim, setTrim, calcMode, setCalcMode, setLeaseStep, setFinanceStep, leaseStep, financeStep, changeChoice, showCalcButtons, setShowCalcButtons, calcHeadingText, setCalcHeadingText, payment, setPayment,handleUserInput);
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