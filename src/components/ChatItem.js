import { Fragment, useState } from "react";
import "../styles/ChatItem.css";
import { VolumeUp } from "react-bootstrap-icons";
import Map from './Map'
import Table from "./Table";
import SelectModel from "./selectModel";
import CarInfoTable from "./CarInfoTable";
import CarInfoDropdownSection from "./CarInfoDropdownSection";
import circleHenrai from "./henraicircle.jpg";

function extractLinkFromText(messageText, author, darkMode){
    const wordsArray = messageText.split(" ")
    const linkIndex = wordsArray.findIndex(str=>str.includes('https'))

  const beforeText =
    linkIndex >= 0 ? wordsArray.slice(0, linkIndex).join(" ") + " " : "";
  const link = wordsArray[linkIndex];
  const afterText =
    linkIndex === wordsArray.length - 1
      ? ""
      : (link ? " " : "") +
        wordsArray.slice(linkIndex + 1, wordsArray.length).join(" ");

  return (
    <p
      style={{
        textAlign: "left",
        color:
          author.toLowerCase() === "you"
            ? darkMode
              ? "#e4e4ed"
              : "#999"
            : darkMode
            ? "#ffffff"
            : "rgb(1, 36, 154)",
      }}
    >
      {beforeText && beforeText}
      {link && (
        <a href={link} target="_blank" rel="noreferrer">
          {link}
        </a>
      )}
      {afterText}
    </p>
  );
}

function dictate(message, toggleIsSpeaking) {
  toggleIsSpeaking(true);
  let utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 1.5;
  utterance.addEventListener("end", () => {
    toggleIsSpeaking(false);
  });
  speechSynthesis.speak(utterance);
}

// let data = [
//   {
//       "android_auto": "Yes",
//       "apple_carplay": "Yes",
//       "basic_miles": "36,000 miles",
//       "basic_years": "3 years",
//       "body_size": "Large",
//       "body_style": "Pickup Truck",
//       "combined_fuel_economy": "68 mpg",
//       "curb_weight": "N/A",
//       "cylinders": "N/A",
//       "drivetrain": "4WD",
//       "electric_range": "230 mi",
//       "engine_aspiration": "Electric Motor",
//       "full_recharge_time": "11.9 hours",
//       "ground_clearance": "8.4 in.",
//       "highway_fuel_economy": "61 mpg",
//       "horsepower": "426 hp @ 0 rpm",
//       "id": 13116,
//       "invoice_price": 59474,
//       "make": "Ford",
//       "max_cargo_capacity": "14.1 ft³",
//       "model": "F-150 Lightning",
//       "msrp": 59474,
//       "navigation_system": "Yes",
//       "number_of_doors": 4,
//       "payload_capacity": "2000 lbs",
//       "range": "230 mi",
//       "seating_capacity": 5,
//       "torque": "775 ft-lbs. @ 0 rpm",
//       "towing_capacity": "10000 lbs",
//       "transmission": "automatic",
//       "trim": "XLT",
//       "used_new_price": 59474,
//       "vehicle_length": "232.7 in.",
//       "year": 2023
//   },
//   {
//       "android_auto": "Yes",
//       "apple_carplay": "Yes",
//       "basic_miles": "36,000 miles",
//       "basic_years": "3 years",
//       "body_size": "Large",
//       "body_style": "Pickup Truck",
//       "combined_fuel_economy": "68 mpg",
//       "curb_weight": "N/A",
//       "cylinders": "N/A",
//       "drivetrain": "4WD",
//       "electric_range": "230 mi",
//       "engine_aspiration": "Electric Motor",
//       "full_recharge_time": "11.9 hours",
//       "ground_clearance": "8.4 in.",
//       "highway_fuel_economy": "61 mpg",
//       "horsepower": "426 hp @ 0 rpm",
//       "id": 52142,
//       "invoice_price": 74474,
//       "make": "Ford",
//       "max_cargo_capacity": "14.1 ft³",
//       "model": "F-150 Lightning",
//       "msrp": 74474,
//       "navigation_system": "Yes",
//       "number_of_doors": 4,
//       "payload_capacity": "2000 lbs",
//       "range": "230 mi",
//       "seating_capacity": 5,
//       "torque": "775 ft-lbs. @ 0 rpm",
//       "towing_capacity": "10000 lbs",
//       "transmission": "automatic",
//       "trim": "Lariat",
//       "used_new_price": 74474,
//       "vehicle_length": "232.7 in.",
//       "year": 2023
//   },
//   {
//       "android_auto": "Yes",
//       "apple_carplay": "Yes",
//       "basic_miles": "36,000 miles",
//       "basic_years": "3 years",
//       "body_size": "Large",
//       "body_style": "Pickup Truck",
//       "combined_fuel_economy": "66 mpg",
//       "curb_weight": "N/A",
//       "cylinders": "N/A",
//       "drivetrain": "4WD",
//       "electric_range": "300 mi",
//       "engine_aspiration": "Electric Motor",
//       "full_recharge_time": "9.3 hours",
//       "ground_clearance": "8.4 in.",
//       "highway_fuel_economy": "60 mpg",
//       "horsepower": "563 hp @ 0 rpm",
//       "id": 52647,
//       "invoice_price": 96874,
//       "make": "Ford",
//       "max_cargo_capacity": "14.1 ft³",
//       "model": "F-150 Lightning",
//       "msrp": 96874,
//       "navigation_system": "Yes",
//       "number_of_doors": 4,
//       "payload_capacity": "1800 lbs",
//       "range": "300 mi",
//       "seating_capacity": 5,
//       "torque": "775 ft-lbs. @ 0 rpm",
//       "towing_capacity": "8500 lbs",
//       "transmission": "automatic",
//       "trim": "Platinum",
//       "used_new_price": 96874,
//       "vehicle_length": "232.7 in.",
//       "year": 2023
//   },
//   {
//       "android_auto": "Yes",
//       "apple_carplay": "Yes",
//       "basic_miles": "36,000 miles",
//       "basic_years": "3 years",
//       "body_size": "Large",
//       "body_style": "Pickup Truck",
//       "combined_fuel_economy": "68 mpg",
//       "curb_weight": "N/A",
//       "cylinders": "N/A",
//       "drivetrain": "4WD",
//       "electric_range": "230 mi",
//       "engine_aspiration": "Electric Motor",
//       "full_recharge_time": "11.9 hours",
//       "ground_clearance": "8.4 in.",
//       "highway_fuel_economy": "61 mpg",
//       "horsepower": "426 hp @ 0 rpm",
//       "id": 54055,
//       "invoice_price": 46974,
//       "make": "Ford",
//       "max_cargo_capacity": "14.1 ft³",
//       "model": "F-150 Lightning",
//       "msrp": 46974,
//       "navigation_system": "Yes",
//       "number_of_doors": 4,
//       "payload_capacity": "2000 lbs",
//       "range": "230 mi",
//       "seating_capacity": 5,
//       "torque": "775 ft-lbs. @ 0 rpm",
//       "towing_capacity": "7700 lbs",
//       "transmission": "automatic",
//       "trim": "Pro",
//       "used_new_price": 46974,
//       "vehicle_length": "232.7 in.",
//       "year": 2023
//   }
// ]

export default function ChatItem({message, author, line, darkMode, textSize, zip, locs, dropDownOptions, carInfoData, carInfoMode, tableFunctions, messageIndex, selectedCars}){
    const authorStyle = {
        fontSize: textSize === "small" ? "0.8rem" : (textSize === "medium" ? "1.2rem" : "1.4rem"),
        color: (darkMode ? "#ffffff" : "#999"),
      };
    const [isSpeaking, toggleIsSpeaking] = useState(false);
    return(
        <div style={{display: "flex", flexDirection:"row", width:"100%"}}>
        {author !== "You" && <div><img src={circleHenrai} style={{height:"32px", width:"50px"}}></img></div>}
        <div style={{backgrounColor:"#133a7c"}}>
        {author === "Ford Chat.." && <Table loc={locs}></Table>}
      {author === "Ford Chat." && (
        <Map zip={zip.zipcode} dist={zip.dist} loc={locs} deal = {zip.deal} coords = {zip.coordinates}></Map>
      )}
        {author==="DropDown" && 
        <Fragment>
          <CarInfoDropdownSection dropDownOptions={dropDownOptions} carInfoMode={carInfoMode}/>
        </Fragment>
        }
        {author==="Table" && <Fragment>
        <CarInfoTable data={carInfoData} mode={carInfoMode} intro={message} onCheckboxSelect={tableFunctions[0]} messageIndex={messageIndex} selectedCars={selectedCars} onCompare={tableFunctions[1]} onTableBack={tableFunctions[2]}/>
          </Fragment>}
        {(author!=="DropDown" && author!=="Table") && <Fragment>
            <p className={author.toLowerCase().replace(" ", "-")} style={authorStyle}>{author}</p>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                {extractLinkFromText(message, author, darkMode)}
                {author.toLowerCase()!=='you' && <VolumeUp color={darkMode ? (isSpeaking?"#ffffff":"#e4e4ed") : (isSpeaking?"blue":"black")} size={textSize === "small" ? "0.8rem" : (textSize === "medium" ? "1.2rem" : "1.4rem")} onClick={()=>{
                    if(!isSpeaking)
                        dictate(message, toggleIsSpeaking)
                    }
                }
                />}
            </div>
            {line && <hr style={{width: '90vw', borderColor: author.toLowerCase()==='you'?'#999':'rgb(49, 135, 255)'}}/>}
        </Fragment>}
    </div>
    </div>)
}
