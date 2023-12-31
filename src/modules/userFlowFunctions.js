import trims from "../jsons/trims.json";
import vehicles from "../jsons/vehicleCategories.json";
import {
  sendBotResponse,
  sendRecommendRequestToServer,
} from "./botResponseFunctions";
import evs from "../jsons/EV.json";
import handleDealerFlow from "./user_flows/handleDealerFlow";
import handlePaymentFlow from "./user_flows/handlePaymentFlow";
import handleInfoFlow from "./user_flows/handleInfoFlow";
import handlePriceFlow from "./user_flows/handlePriceFlow";
import { BiRegistered } from "react-icons/bi";
import images from "../images/image_link.json";
import Checkbox from "@mui/material/Checkbox";
import {
  certifications,
  evmarket,
  commitments,
  emissions,
  endoflife,
  pm,
  newfeatures,
} from "./info.js";
import futurePic from "./fordranger2024.png";
import electricpic1 from "./electricpic1.png";
import electricpic2 from "./electricpic2.png";
import electricpic3 from "./electricpic3.png";

export function handleUserInputFn(
  origButtons,
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
  setCat,
  setPriceMode,
  setPriceStep,
  setVehicleMode,
  setOptionButtons,
  setShowingEvs,
  setSchedSent
) {
  //for ev model logig

  const evs = {
    "E-Transit Cargo Van": [
      '350 High Roof w/148" WB',
      '350 Low Roof w/148" WB',
      '350 Low Roof w/130" WB',
      '350 Medium Roof w/130" WB',
      '350 Medium Roof w/148" WB',
    ],
    Escape: ["ST-Line Elite"],
    Explorer: ["Limited"],
    "F-150 Lightning": ["Lariat", "Platinum", "Pro", "XLT"],
    "Mustang Mach-E": ["Select w/Standard Range"],
  };


  const proceedClick = () => {
    setCalcStep(2);
    setQuery('Proceed');
    setMessages((m) => [...m, { msg: 'Proceed', author: "You" }]);
    setOptionButtons([]);
  };
  const newClick = () => {
      setQuery('Choose a new vehicle');
      setMessages((m) => [...m, { msg: 'Choose a new vehicle', author: "You" }]);
      setOptionButtons([]);
      //setModel('');
      //setTrim('');
      changeChoice("model");
      return;
  };
  const fixTrimName = (model, trim) => {
    if (
      model !== "Transit Cargo Van" &&
      model !== "E-Transit Cargo Van" &&
      model !== "Transit Crew Van" &&
      model !== "Transit Passenger Van"
    ) {
      return trim;
    }
    trim = trim.replaceAll('"', '');
    return trim;
  };

  const fvs = {
    "2024 Ranger": [
      "XL", "XLT", "Lariat", "Raptor"
    ]
  }

  function getVarietiesByCategory(mainCategory) {
    // Check if the main category exists in the JSON data
    if (evs.hasOwnProperty(mainCategory)) {
      return evs[mainCategory];
    } else {
      return []; // Return an empty array if the main category is not found
    }
  }

  return (option) => {
    // Outputs a response to based on input user selects
    if (option.includes("SCHED")) {
      setMessages((m) => [
        ...m,
        { msg: option.replace("SCHED", "").split("MODEL")[0], author: "You" },
      ]);
      setMessages((m) => [
        ...m,
        {
          msg: "Please enter your zipcode below:",
          author: "Ford Chat",
          line: true,
          zip: {},
        },
      ]);
      setMenuButtons([]);
      setOptionButtons([]);
      changeChoice(option);
    } else
      switch (option) {
        case "TableI":
          setInfoMode(0);
          changeChoice("I");
          blockQueries.current = false;
          break;
        case "I":
          setInfoMode(0);
          if (cat === "") {
            setMessages((m) => [
              ...m,
              {
                msg: "Info on a specific car",
                author: "You",
                line: true,
                zip: {},
              },
            ]);
            setMessages((m) => [
              ...m,
              {
                msg: "Please select a model/trim of the specific car you're looking for",
                author: "Ford Chat",
                line: true,
                zip: "",
              },
            ]);
          }
          setCalcHeadingText("Choose vehicle category");
          setShowCalcButtons(true);
          setCalcButtons(
            Object.keys(vehicles).map((vehicle) => (
              <button
                className="model-button"
                key={vehicle}
                value={vehicle}
                onClick={() => {
                  setQuery(vehicle);
                  setInfoMode(1);
                  setCat(vehicle);
                }}
              >
                {vehicle}
              </button>
            ))
          );
          changeChoice("I");
          blockQueries.current = false;
          break;
        case "A":
          setMessages((m) => [
            ...m,
            { msg: "Car recommendation", author: "You" },
          ]);
          setMessages((m) => [
            ...m,
            {
              msg: "Happy to help! Do you have specific needs in mind, or would you like to fill out our questionnaire?",
              author: "Ford Chat",
              line: true,
              zip: {},
            },
          ]);
          setOptionButtons(buyACarButtons);
          setMenuButtons([]);
          break;
        case "B":
          setSchedSent(false);
          setMessages((m) => [
            ...m,
            { msg: "Find a dealership", author: "You" },
          ]);
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
          blockQueries.current = false;
          break;
        case "C":
          setMessages((m) => [
            ...m,
            { msg: "Schedule a test drive", author: "You" },
          ]);
          setMessages((m) => [
            ...m,
            {
              msg: "Please enter your zipcode or enable location to continue:",
              author: "Ford Chat",
              line: true,
              zip: {},
            },
          ]);
          changeChoice("C");
          blockQueries.current = false;
          break;
        case "D":
          setMessages((m) => [
            ...m,
            { msg: "Car pricing estimator", author: "You" },
          ]);
          if (model === "") {
            setMessages((m) => [
              ...m,
              { msg: "What model are you interested in?", author: "Ford Chat" },
            ]);
            setCalcHeadingText("Choose specific model");
            setShowCalcButtons(true);
            setCalcButtons(
              Object.keys(trims).map(model => (
                <button
                  className="model-button"
                  key={model}
                  value={model}
                  onClick={() => {
                    setQuery(model);
                    setModel(model);
                    setMessages((m) => [...m, { msg: model, author: "You" }]);
                    setCalcButtons([]);
                    setShowCalcButtons(false);
                  }}
                >
                  <img
                    style={{ width: "160px", height: "auto" }}
                    src={images["Default"][model]}
                  />
                  <br />
                  {model}
                  <BiRegistered />
                </button>
              ))
            );
            setCalcStep(1);
            blockQueries.current = false;
            changeChoice("D");
          } else if (trim === "") {
            setQuery(model);
            setCalcStep(1);
            blockQueries.current = false;
            changeChoice("D");
          } else {
            setMessages((m) => [...m, { msg: `What would you like to proceed with the 2024 ${model} ${fixTrimName(model,trim)} or select a new vehicle?`, author: "Ford Chat", line: true, zip: {} }]);
            let opts0 = ['Proceed','Choose a new vehicle'];
            setOptionButtons(<div className='option-buttons'>
            {opts0.map(option => (<button className='button-small' key={option} value={option} 
                onClick={option==='Proceed'?proceedClick:newClick}>{option}</button>))}</div>);
            blockQueries.current = false;
            //break;
            //setQuery(trim);
            //setCalcStep(2);
            //blockQueries.current = false;
          }
          //changeChoice("D");
          break;
        case "SU":
          setMessages((m) => [
            ...m,
            { msg: "Sustainability", author: "You", line: true, zip: {} },
          ]);
          setMessages((m) => [
            ...m,
            {
              msg: "Ford sustainability it super important to us. We have various certifications and a pledge to use 100% local, renewable electricity in all manufacturing by 2035. Click to learn more specifics.",
              author: "Ford Chat",
              line: true,
              zip: "",
            },
          ]);
          break;
        case "INN":
          setMessages((m) => [
            ...m,
            { msg: "Innovation", author: "You", line: true, zip: {} },
          ]);
          setMessages((m) => [
            ...m,
            {
              msg: "Ford's up and coming innovation efforts.",
              author: "Ford Chat",
              line: true,
              zip: "",
            },
          ]);
          break;
        case "NM":
          setMessages((m) => [
            ...m,
            { msg: "New Models", author: "You", line: true, zip: {} },
          ]);
          setShowingEvs(true);
          setCalcHeadingText(
            "Feel free to explore our new models below! Click on a model for more specific details."
          );
          setShowCalcButtons(true);
          setCalcButtons(
            Object.keys(evs).map((vehicle) => (
              <button
                className="model-button"
                key={vehicle}
                value={vehicle}
                onClick={() => {
                  setShowingEvs(true);
                  setMessages((m) => [...m, { msg: vehicle, author: "You" }]);
                  setCalcHeadingText(
                    `The varieties of the ${vehicle} include:`
                  );
                  const varieties = getVarietiesByCategory(vehicle);
                  var description = "";
                  switch (vehicle) {
                    case "E-Transit Cargo Van":
                      description = (
                        <p>
                          The E-Transit Cargo Van is Ford's innovative
                          all-electric cargo van, designed to revolutionize the
                          delivery and transportation industry. With multiple
                          roof heights and wheelbase options, it offers
                          versatile cargo configurations to fit your business
                          needs. Embrace sustainability, reduce emissions, and
                          experience the future of commercial transportation
                          with the E-Transit.
                        </p>
                      );
                      break;
                    case "Escape":
                      description = (
                        <p>
                          Introducing the brand new electric version of the Ford
                          Escape. With its eco-friendly all-electric drivetrain,
                          the Escape EV takes efficiency and sustainability to
                          the next level. Experience a smooth and silent ride,
                          advanced tech features, and a spacious cabin that
                          delivers a truly modern driving experience. Get ready
                          to embrace the future with the electrifying Escape EV.
                        </p>
                      );
                      break;
                    case "Explorer":
                      description = (
                        <p>
                          Unleash the power of electrification with the new
                          electric version of the Ford Explorer. The Explorer EV
                          offers the same rugged capability and luxury of its
                          traditional counterparts but with zero tailpipe
                          emissions. With its electric range and intelligent
                          energy management, the Explorer EV takes you on an
                          adventure while preserving the environment. Discover
                          the electrifying Explorer and embark on a sustainable
                          journey.
                        </p>
                      );
                      break;
                    case "F-150 Lightning":
                      description = (
                        <p>
                          The F-150 Lightning, Ford's all-electric pickup truck,
                          brings unparalleled power and efficiency to the table.
                          Choose from a range of trims, including the rugged
                          Raptor and the luxurious Platinum. With lightning-fast
                          acceleration and a reliable electric range, the F-150
                          Lightning marks a new era of electric trucks that
                          redefine the possibilities of work and play.
                        </p>
                      );
                      break;
                    case "Mustang Mach-E":
                      description = (
                        <p>
                          The Mustang Mach-E is a revolutionary all-electric SUV
                          that embraces the iconic Mustang heritage. The Select
                          trim with Standard Range delivers impressive
                          efficiency without sacrificing performance. Enjoy a
                          thrilling driving experience with instant torque,
                          advanced tech, and a spacious interior. Experience the
                          future of Mustang with the Mach-E.
                        </p>
                      );
                      break;
                    default:
                      description = (
                        <p>
                          Welcome to the world of new Ford cars - where
                          innovation, performance, and style meet. Experience
                          the thrill of driving with cutting-edge features and
                          unmatched craftsmanship that define each Ford model.
                        </p>
                      );
                  }
                  setCalcButtons(
                      <div className="ev-info" style={{
                        display:"flex",
                        flexDirection:"column"
                      }}>
                        <div className="ev-top" style={{
                          display:"flex",
                          flexDirection:"row",
                          justifyContent:"center",
                        }}>
                          <div className="ev-list" style={{
                          display:"flex",
                          flexDirection:"column",
                          fontSize:"15px",
                          justifyContent:"center"
                        }}>
                          {varieties.map((variety, index) => (
                            <li key={index}>{variety}</li>
                          ))}
                          </div>
                          <img
                            style={{ width: "180px", height: "auto", padding:"15px" }}
                            src={images["Default"][vehicle]}
                          />
                        </div>
                        <div className="ev-description" style={{
                          fontSize:"15px",
                          paddingTop:"10px"
                        }}>{description}</div>
                      </div>
                    );
                  setShowCalcButtons(true);
                }}
              >
                <img
                  style={{ width: "160px", height: "auto" }}
                  src={images["Default"][vehicle]}
                />
                <br />
                {vehicle}
              </button>
            ))
          );
          setMenuButtons([]);
          break;
        case "NF":
          setMessages((m) => [
            ...m,
            { msg: "Future Models", author: "You", line: true, zip: {} },
          ]);
          setShowingEvs(true);
          setCalcHeadingText(
            "Click to learn more about our future models!"
          );
          setShowCalcButtons(true);
          setCalcButtons(
            Object.keys(fvs).map((vehicle) => (
              <button
                className="model-button"
                key={vehicle}
                value={vehicle}
                onClick={() => {
                  setShowingEvs(true);
                  setMessages((m) => [...m, { msg: vehicle, author: "You" }]);
                  setCalcHeadingText(
                    `The varieties of the ${vehicle} will include:`
                  );
                  var description = `Introducing the all-new 2024 Ford Ranger! This cutting-edge truck is redefining the driving experience with its state-of-the-art technology and innovative design. Packed with futuristic features, the Ranger is a true tech marvel. With a trailer brake controller, pro trailer backup assistance, and a 360-degree camera, maneuvering is a breeze, making towing and parking effortless. The Ranger's zone lighting illuminates every angle, ensuring visibility in any situation. Conquer any terrain with ease using the terrain management system, offering modes for normal, eco, sport, slippery, and sand conditions. Stay connected like never before with SYNC 4A technology, making it the most connected Ranger ever. And with Ford Power Up software updates, your Ranger will always stay ahead of the curve. Experience the future of driving with the all-new 2024 Ford Ranger - where cutting-edge technology meets unmatched performance. Get ready to embrace the road like never before!`;
                  setCalcButtons(
                    <div className="ev-info" style={{
                      display:"flex",
                      flexDirection:"column"
                    }}>
                      <div className="ev-top" style={{
                        display:"flex",
                        flexDirection:"row",
                        justifyContent:"center",
                      }}>
                        <div className="ev-list" style={{
                        display:"flex",
                        flexDirection:"column",
                        fontSize:"15px"
                      }}>
                        <li>XL</li>
                        <li>XLT</li>
                        <li>Lariat</li>
                        <li>Raptor</li>
                      </div>
                        <img
                          style={{ width: "170px", height: "auto", padding:"20px" }}
                          src={futurePic}
                        />
                      </div>
                      <div className="ev-description" style={{
                        fontSize:"15px",
                        paddingTop:"10px"
                      }}>{description}</div>
                    </div>
                  );
                  setShowCalcButtons(true);
                }}
              >
                <img
                  style={{ width: "130px", height: "auto" }}
                  src={futurePic}
                />
                <br />
                {vehicle}
              </button>
            ))
          );
          setMenuButtons([]);
          break;
        case "EV":
          setMessages((m) => [
            ...m,
            { msg: "EV Market", author: "You", line: true, zip: {} },
          ]);
          setShowingEvs(true);
          setCalcHeadingText(
            "Our EV Market"
          );
          setShowCalcButtons(true);
          setCalcButtons(
            <div className="info-wrapper" style={{
              display:"flex",
              flexDirection:"row",
            }}>
              <div className="info-box" style={{ whiteSpace: 'pre-wrap', fontSize:"15px",  textAlign:'left' }}>
              <span styl={{textAlign:'left'}}>{evmarket}</span>
              <br></br>              <img
                  style={{ width: "50%", height: "auto",padding:"5px" }}
                  src={electricpic2}
                />
              </div>
            </div>
          )

          break;
        case "Cer":
          setMessages((m) => [
            ...m,
            { msg: "Certifications", author: "You", line: true, zip: {} },
          ]);
          setShowingEvs(true);
          setCalcHeadingText(
            "Our Certifications"
          );
          setShowCalcButtons(true);
          setCalcButtons(
            <div className="info-wrapper" style={{
              display:"flex",
              flexDirection:"row",
            }}>
              <div className="info-box" style={{ whiteSpace: 'pre-wrap', fontSize:"15px",  textAlign:'left'}}>
              {certifications}
              </div>
            </div>
          )

          break;
        case "Em":
          setMessages((m) => [
            ...m,
            { msg: "Emissions", author: "You", line: true, zip: {} },
          ]);
          setShowingEvs(true);
          setCalcHeadingText(
            "Our Emission Policies"
          );
          setShowCalcButtons(true);
          setCalcButtons(
            <div className="info-wrapper" style={{
              display:"flex",
              flexDirection:"row",
            }}>
              <div className="info-box" style={{ whiteSpace: 'pre-wrap', fontSize:"15px", textAlign:'left' }}>
              {emissions}
              </div>
            </div>
          )

          
          break;
        case "Comm":
          setMessages((m) => [
            ...m,
            { msg: "EV Market", author: "You", line: true, zip: {} },
          ]);
          setShowingEvs(true);
          setCalcHeadingText(
            "Our Commitments"
          );
          setShowCalcButtons(true);
          setCalcButtons(
            <div className="info-wrapper" style={{
              display:"flex",
              flexDirection:"row",
            }}>
              <div className="info-box" style={{ whiteSpace: 'pre-wrap', fontSize:"15px", textAlign:'left' }}>
              {commitments}
              </div>
            </div>
          )


          break;
        case "Pr":
          setMessages((m) => [
            ...m,
            { msg: "Production management", author: "You", line: true, zip: {} },
          ]);
          setShowingEvs(true);
          setCalcHeadingText(
            "Our Production Management"
          );
          setShowCalcButtons(true);
          setCalcButtons(
            <div className="info-wrapper" style={{
              display:"flex",
              flexDirection:"row",
            }}>
              <div className="info-box" style={{ whiteSpace: 'pre-wrap', fontSize:"15px", textAlign:'left' }}>
              {pm}
              </div>
            </div>
          )

          break;
        case "EOF":
          setMessages((m) => [
            ...m,
            { msg: "End of life management", author: "You", line: true, zip: {} },
          ]);
          setShowingEvs(true);
          setCalcHeadingText(
            "End of life management"
          );
          setShowCalcButtons(true);
          setCalcButtons(
            <div className="info-wrapper" style={{
              display:"flex",
              flexDirection:"row",
            }}>
              <div className="info-box" style={{ whiteSpace: 'pre-wrap', fontSize:"15px", textAlign:'left' }}>
              {endoflife}
              </div>
            </div>
          )

          break;
        case "electric":
          changeChoice("electric");
          setVehicleMode("electric");
          setPriceStep(1);
          setQuery("electric");
          break;
        case "combustion":
          changeChoice("combustion");
          setVehicleMode("combustion");
          setPriceStep(1);
          setQuery("combustion");
          break;
        case "maintenanceQuestions":
          changeChoice("maintenanceQuestions");
          break;
        default:
          setResponse(
            "Invalid input. Please select one of the options (A, B, C, or D)."
          );
          break;
      }
  };
}

export function handleUserFlow(
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
  setOptionButtons,
  priceStep,
  setPriceStep,
  priceMode,
  setPriceMode,
  setPriceSummary,
  setShowPriceSummary,
  EV,
  vehicleMode,
  setVehicleMode,
  setLeaseStep1,
  setFinanceStep1,
  leaseStep1,
  financeStep1,
  dura,
  setDura,
  down,
  setDown,
  changeFind,
  requestSent,
  setShowingEvs,
  forceUpdate,
  setForceUpdate,
  schedSent,
  setLocateButton,
  knowMyPriceButtons,
  setChatGap
) {
  const fixTrimName = (model, trim) => {
    if (
      model !== "Transit Cargo Van" &&
      model !== "E-Transit Cargo Van" &&
      model !== "Transit Crew Van" &&
      model !== "Transit Passenger Van"
    ) {
      return trim;
    }
    trim = trim.replaceAll('"', '');
    return trim;
  };
  if (!blockQueries.current && query.length > 0) {
    blockQueries.current = true;
    setForceUpdate(!forceUpdate);
    if (choice.includes("SCHED")) {
      const maintenanceMode = choice.replace("SCHED", "");
      const model = maintenanceMode.split("MODEL:")[1].split("TRIM:")[0];
      const trim = maintenanceMode.split("MODEL:")[1].split("TRIM:")[1];
      handleDealerFlow(
        zipMode,
        dealerList,
        setZipCode,
        query,
        setMessages,
        extractFiveDigitString,
        setZipMode,
        setDistance,
        findLocations,
        zipCode,
        distance,
        model,
        trim,
        false,
        maintenanceMode.split("MODEL:")[0],
        false
      );
      blockQueries.current = false;
    } else {
      switch (choice) {
        case "DEFAULT":
          blockQueries.current = false;
          break;
        case "maintenanceQuestions":
          sendBotResponse(
            "I am looking to schedule maintenance for my Ford car and I have a question about maintenance. Here it is: " +
              query,
            history,
            "maint"
          ).then((res) => {
            setMessages((m) => [
              ...m,
              { msg: res, author: "Ford Chat", line: true, zip: {} },
            ]);
            blockQueries.current = false;
          });
          changeChoice("DEFAULT");
          break;
        case "model":
            setMessages((m) => [
              ...m,
              { msg: "What model are you interested in?", author: "Ford Chat" },
            ]);
            setCalcHeadingText("Choose specific model");
            setShowCalcButtons(true);
            setCalcButtons(
              Object.keys(trims).map(model => (
                <button
                  className="model-button"
                  key={model}
                  value={model}
                  onClick={() => {
                    setQuery(model);
                    setModel(model);
                    setMessages((m) => [...m, { msg: model, author: "You" }]);
                    setCalcButtons([]);
                    setShowCalcButtons(false);
                    changeChoice("D");
                    setCalcStep(1);
                  }}
                >
                  <img
                    style={{ width: "160px", height: "auto" }}
                    src={images["Default"][model]}
                  />
                  <br />
                  {model}
                  <BiRegistered />
                </button>
              ))
            );
            blockQueries.current = false;
            break;
        case "electric":
          handlePriceFlow(
            "electric",
            priceMode,
            setPriceMode,
            EV,
            priceStep,
            setPriceStep,
            model,
            setModel,
            query,
            setQuery,
            setMessages,
            setMenuButtons,
            setCalcButtons,
            blockQueries,
            setCalcStep,
            trim,
            setTrim,
            setLeaseStep1,
            setFinanceStep1,
            leaseStep1,
            financeStep1,
            changeChoice,
            setShowCalcButtons,
            setCalcHeadingText,
            payment,
            setPayment,
            origButtons,
            setOptionButtons,
            setPriceSummary,
            setShowPriceSummary,
            dura,
            setDura,
            down,
            setDown,
            forceUpdate,
            setForceUpdate,
            setChatGap
          );
            if (priceStep !== 8 && !isNaN(query)) {
                setQuery("");
            }
          blockQueries.current = false;
          break;
        case "combustion":
          handlePriceFlow(
            "combustion",
            priceMode,
            setPriceMode,
            EV,
            priceStep,
            setPriceStep,
            model,
            setModel,
            query,
            setQuery,
            setMessages,
            setMenuButtons,
            setCalcButtons,
            blockQueries,
            setCalcStep,
            trim,
            setTrim,
            setLeaseStep1,
            setFinanceStep1,
            leaseStep1,
            financeStep1,
            changeChoice,
            setShowCalcButtons,
            setCalcHeadingText,
            payment,
            setPayment,
            origButtons,
            setOptionButtons,
            setPriceSummary,
            setShowPriceSummary,
            dura,
            setDura,
            down,
            setDown,
            forceUpdate,
            setForceUpdate
          );
          if (priceStep !== 8 && !isNaN(query)) {
            setQuery("");
        }
          blockQueries.current = false;
          break;
        case "purchase request":
          handleDealerFlow(
            zipMode,
            dealerList,
            setZipCode,
            query,
            setMessages,
            extractFiveDigitString,
            setZipMode,
            setDistance,
            findLocations,
            zipCode,
            distance,
            model,
            trim,
            true,
            "",
            requestSent
          );
          blockQueries.current = false;
          break;
        case "I":
          if (infoMode === 1) {
            setCalcHeadingText("Choose specific model");
            setCalcButtons(
              Object.keys(vehicles[cat]).map((model) => (
                <button
                  className="model-button"
                  key={model}
                  value={model}
                  onClick={() => {
                    setQuery(model);
                    setInfoMode(2);
                    setModel(model);
                  }}
                >
                  <img
                    style={{ width: "160px", height: "auto" }}
                    src={images["Default"][model]}
                  />
                  <br />
                  {model}
                </button>
              ))
            );
            setVehicle(query);
            blockQueries.current = false;
            break;
          } else if (infoMode === 2) {
            setCalcHeadingText(query + ": Choose specific trim");
            setCalcButtons(
              vehicles[vehicle][model].map((trim) => (
                <button
                  className="model-button"
                  key={trim}
                  value={trim}
                  onClick={() => {
                    handleInfoFlow(
                      handleMoreInfo,
                      tableForceUpdate,
                      setTableForceUpdate,
                      handleCarInfoButton,
                      model,
                      trim,
                      setMessages,
                      setModel,
                      setQuery,
                      setInfoMode,
                      setCalcButtons,
                      setMenuButtons,
                      handleUserInput,
                      setShowCalcButtons,
                      setCarInfoData,
                      infoMode,
                      selected,
                      changeSelected,
                      setDealers,
                      locateDealershipsFn,
                      setSelect,
                      setFind,
                      query,
                      setZipMode,
                      setOptionButtons,
                      forceUpdate,
                      setForceUpdate,
                      knowMyPriceButtons,
                      setLocateButton,
                      setChatGap
                    );
                    setTrim(trim);
                  }}
                >
                  <img
                    style={{ width: "160px", height: "auto" }}
                    src={images[model][trim]}
                  />
                  <br />
                  {trim}
                </button>
              ))
            );
            blockQueries.current = false;
            break;
          } else if (infoMode === 3) {
            handleInfoFlow(
              handleMoreInfo,
              tableForceUpdate,
              setTableForceUpdate,
              handleCarInfoButton,
              model,
              trim,
              setMessages,
              setModel,
              setQuery,
              setInfoMode,
              setCalcButtons,
              setMenuButtons,
              handleUserInput,
              setShowCalcButtons,
              setCarInfoData,
              infoMode,
              selected,
              changeSelected,
              setDealers,
              locateDealershipsFn,
              setSelect,
              setFind,
              query,
              setZipMode,
              setOptionButtons,
              forceUpdate,
              setForceUpdate,
              knowMyPriceButtons,
              setLocateButton,
              setChatGap
            );
            blockQueries.current = false;
            break;
          } else if (infoMode === 4) {
            handleInfoFlow(
              handleMoreInfo,
              tableForceUpdate,
              setTableForceUpdate,
              handleCarInfoButton,
              model,
              trim,
              setMessages,
              setModel,
              setQuery,
              setInfoMode,
              setCalcButtons,
              setMenuButtons,
              handleUserInput,
              setShowCalcButtons,
              setCarInfoData,
              infoMode,
              selected,
              changeSelected,
              setDealers,
              locateDealershipsFn,
              setSelect,
              setFind,
              query,
              setZipMode,
              setOptionButtons,
              forceUpdate,
              setForceUpdate,
              knowMyPriceButtons,
              setLocateButton,
              setChatGap
            );
            blockQueries.current = false;
            break;
          } else if (infoMode === 10) {
            setCalcStep(2);
            changeChoice("D");
            handlePaymentFlow(
              calcStep,
              model,
              setModel,
              query,
              setQuery,
              setMessages,
              setMenuButtons,
              setCalcButtons,
              blockQueries,
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
              setShowCalcButtons,
              setCalcHeadingText,
              payment,
              setPayment,
              origButtons,
              setOptionButtons,
              setChatGap
            );
            blockQueries.current = false;
            break;
          }
          blockQueries.current = false;
          break;
        case "A":
          console.log('setting chat gap');
          setQuery("");
          setChatGap(true);
          sendRecommendRequestToServer(query, history, carInfoData, messages, forceUpdate, blockQueries, setCarInfoData, setMessages, setForceUpdate, setHistory, fixTrimQueryQuotation).then(()=>{
            setMenuButtons(origButtons)
            
          });
          break;
        case "B": {
          handleDealerFlow(
            zipMode,
            dealerList,
            setZipCode,
            query,
            setMessages,
            extractFiveDigitString,
            setZipMode,
            setDistance,
            findLocations,
            zipCode,
            distance,
            model,
            trim,
            false,
            "",
            false,
            schedSent
          );
          blockQueries.current = false;
          break;
        }
        case "C": {
          if (findMode === 0) {
            const numberRegex = /\d+/g;
            if (
              extractFiveDigitString(query) === null ||
              query.match(numberRegex)[0].length != 5
            ) {
              //   setMessages((m) => [
              //     ...m,
              //     {
              //       msg: "Please input a valid zipcode",
              //       author: "Ford Chat",
              //       line: false,
              //       zip: "",
              //     },
              //   ]);
            } else {
              setZipCode(query);
              setMessages((m) => [
                ...m,
                {
                  msg: "Please select 1-3 models/trims you are looking for.",
                  author: "Ford Chat",
                  line: true,
                  zip: "",
                },
              ]);
              setCalcHeadingText("Select a model");
              setShowCalcButtons(true);
              setCalcButtons(
                Object.keys(trims).map((model) => (
                  <button
                    className="model-button"
                    key={model}
                    value={model}
                    onClick={() => {
                      setQuery(model);
                      setModel(model);
                      setCalcButtons([]);
                      setFind(1);
                    }}
                  >
                    <img
                      style={{ width: "160px", height: "auto" }}
                      src={images["Default"][model]}
                    />
                    <br />
                    {model}
                  </button>
                ))
              );
              setFind(1);
            }
          } else if (findMode === 1) {
            setCalcHeadingText("Select trims");
            setShowCalcButtons(true);
            let backgroundC = 'white';
            setCalcButtons(
              <div>
                {trims[query].map((trim) => (
                  <button
                    className="model-button"
                    style={{
                      backgroundColor: 'white'}}
                    key={trim}
                    value={trim}
                    onClick={(event) => {
                      const button = event.target;
                      if(button.style.backgroundColor == 'grey'){
                        button.style.backgroundColor = 'white';
                      }
                      else{
                        button.style.backgroundColor = 'grey';
                      }
                      let copy, copy2;
                      if (trim in selected[model]) {
                        copy = selected[model];
                        delete copy[trim];
                        copy2 = selected;
                        delete copy2[model];
                        copy2[model] = copy;
                        changeSelected(copy2);
                      } else {
                        copy = selected[model];
                        copy.push(trim);
                        copy2 = selected;
                        delete copy2[model];
                        copy2[model] = copy;
                        changeSelected(copy2);
                      }
                      setForceUpdate(!forceUpdate);
                      console.log(copy2, selected[model].includes(trim));
                    }}>
                     <img style={{ width: "160px", height: "auto" }} src={images[model][trim]} />
                    <br />{fixTrimName(model,trim)}
                  </button>
                  // trims[query].contains(trim)) ? <button className='model-button' key={trim} value={trim} onClick={appendSelect}>{trim}</button>
                  // : <button className='model-button-selected' key={trim} value={trim} onClick={appendSelect}>{trim}</button>
                ))}
              </div>
            );
            let locateButton = (<button className='locate-button'
            onClick={
              locateDealershipsFn(
              setDealers,
              setCalcButtons,
              setSelect,
              selected,
              setFind,
              changeSelected,
              zipCode,
              -1,
              setMessages,
              setZipMode,
              setShowCalcButtons,
              model,
              selected[model][0],
              setLocateButton
            )}>
            Locate nearby dealerships
          </button>);
            setLocateButton(locateButton);
            setSelect(true);
          }
          blockQueries.current = false;
          break;
        }
        case "Q":
          switch (questionnaireStep) {
            case 1:
              setMessages((m) => [
                ...m,
                {
                  msg: "Are you interested in a specific type of vehicle, such as a cargo van, SUV, hatchback, or pickup truck?",
                  author: "Ford Chat",
                },
              ]);
              setQuestionnaireAnswers((q) => [...q, query]);
              setQuestionnaireStep(2);
              blockQueries.current = false;
              break;
            case 2:
              setMessages((m) => [
                ...m,
                {
                  msg: "How do you plan to use the car? Will it be primarily for commuting, family use, off-roading, or business purposes?",
                  author: "Ford Chat",
                },
              ]);
              setQuestionnaireAnswers((q) => [...q, query]);
              setQuestionnaireStep(3);
              blockQueries.current = false;
              break;
            case 3:
              setMessages((m) => [
                ...m,
                {
                  msg: "How many passengers do you need to accommodate regularly? ",
                  author: "Ford Chat",
                },
              ]);
              setQuestionnaireAnswers((q) => [...q, query]);
              setQuestionnaireStep(4);
              blockQueries.current = false;
              break;
            case 4:
              //setQuestionnaireAnswers(q=>[...q, query])
              let questionnaireAnswersCopy = [...questionnaireAnswers, query];
              setChatGap(true);
              setForceUpdate(!forceUpdate);
              const ultimateQueryString =
                "Here is my budget: " +
                questionnaireAnswersCopy[0] +
                ". I am looking for a " +
                questionnaireAnswersCopy[1] +
                ". I will primarily use it for the following: " +
                questionnaireAnswersCopy[2] +
                ". I need a seating capacity of at least: " +
                questionnaireAnswersCopy[3];
              sendRecommendRequestToServer(
                ultimateQueryString,
                history, carInfoData, messages, forceUpdate, blockQueries, setCarInfoData, setMessages, setForceUpdate, setHistory, fixTrimQueryQuotation).then(()=>{
                    setMenuButtons(origButtons);
                    
                })
              setQuestionnaireStep(5);
              break;;
            default:
              setQuery("");
              changeChoice("A");
              blockQueries.current = false;
          }
          break;
        case "D":
          setQuery("");
          handlePaymentFlow(
            calcStep,
            model,
            setModel,
            query,
            setQuery,
            setMessages,
            setMenuButtons,
            setCalcButtons,
            blockQueries,
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
            setShowCalcButtons,
            setCalcHeadingText,
            payment,
            setPayment,
            origButtons,
            setOptionButtons,
            setChatGap
          );
          break;
        default:
          if (query.length > 0)
            sendBotResponse(query, history, "chat").then((res) => {
              setMessages((m) => [
                ...m,
                { msg: res, author: "Ford Chat", line: true, zip: {} },
              ]);
              setHistory((h) => [...h.slice(-4), { q: query, a: res }]);
              blockQueries.current = false;
            });
          setQuery("");
          break;
      }
    }
  }
}
