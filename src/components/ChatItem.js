import { Fragment, useState } from "react";
import "../styles/ChatItem.css";
import { VolumeUp } from "react-bootstrap-icons";
import Map from './Map'
import Table from "./Table";
import SelectModel from "./selectModel";
import CarInfoTable from "./CarInfoTable";
import CarInfoDropdownSection from "./CarInfoDropdownSection";
import ExistingOwner from "./ExistingOwners/ExistingOwner";
import DisplayInfo from "./DisplayInfo"
import circleHenrai from "./henraicircle.jpg";

function extractLinkFromText(messageText, author, darkMode){
    console.log(messageText);
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

  const bubbleStyle = {
    color: "white",
    backgroundColor: author.toLowerCase() === "you" ? "blue" : "#322964",
    padding: "10px 20px",
    borderRadius: "20px",
    textAlign: author.toLowerCase() === "you" ? "right" : "left",
    justifyContent: author.toLowerCase() === "you" ? "flex-end" : "flex-start", // Align bubble content to the right for "You" author
    marginRight: author.toLowerCase() === "you" ? "auto" : "0", 
  };

  const textStyle = {
    alignItems: author === "You" ? "flex-end" : "flex-start",
    alignSelf: author === "You" ? "flex-end" : "flex-start",
    justifyContent: author === "You" ? "flex-end" : "flex-start",
  }

  return (
    <p style={{ ...bubbleStyle, ...textStyle }}>
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

// confusion when adding clickable CTAs (same shape)
// separate gray from buttons 
// border 

function dictate(message, toggleIsSpeaking) {
  toggleIsSpeaking(true);
  let utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 1.5;
  utterance.addEventListener("end", () => {
    toggleIsSpeaking(false);
  });
  speechSynthesis.speak(utterance);
}

export default function ChatItem({message, author, line, darkMode, textSize, zip, locs, dropDownOptions, carInfoData, carInfoMode, carSpecInfo, setMessages, setMenuButtons, handleUserInput, selectedCar, setSelectedCar, tableFunctions, messageIndex, selectedCars}){
  const textPartStyle = {
    display: "flex", flexDirection:"row",
    width:"100%",
    justifyContent: author.toLowerCase() === "you" ? "flex-end" : "flex-start",
    paddingRight: "5%",
    paddingLeft:"2%",
    paddingTop: "5px",
  }
    const [isSpeaking, toggleIsSpeaking] = useState(false);
    return (
        <div style={{display: "flex", flexDirection:"row", width:"100%", }}>
        <div style={(author==="You"||author==="Ford Chat")?textPartStyle:{}}>
          <div style={textPartStyle}>
          {author === "Ford Chat" && <div><img src={circleHenrai} style={{height:"48px", width:"75px"}}></img></div>}
          {(author!=="DropDown" && author!=="Table" && author !== "Info" && message.length>0) && <Fragment>
            <div style={{display: 'flex', flexDirection: 'row', clear:'both',}}>
                {extractLinkFromText(message, author, darkMode)}
                {author.toLowerCase()!=='you' && <VolumeUp color={darkMode ? (isSpeaking?"#ffffff":"#e4e4ed") : (isSpeaking?"blue":"black")} size={textSize === "small" ? "0.8rem" : (textSize === "medium" ? "1.2rem" : "1.4rem")} onClick={()=>{
                    if(!isSpeaking)
                        dictate(message, toggleIsSpeaking)
                    }
                }
                />}
            </div>
        </Fragment>}
          </div>
        {author === "Ford Chat.." && <Table loc={locs}></Table>}
      {author === "Ford Chat." && (
        <Map zip={zip.zipcode} dist={zip.dist} loc={locs} deal = {zip.deal} coords = {zip.coordinates}></Map>
      )}
      {
        author === "Info" && <div>
        <DisplayInfo info = {carSpecInfo}></DisplayInfo></div>
      }
        {author==="DropDown" && 
        <Fragment>
          <CarInfoDropdownSection dropDownOptions={dropDownOptions} carInfoMode={carInfoMode}/>
        </Fragment>
        }
        {author==="Table" && <Fragment>
        <CarInfoTable data={carInfoData} mode={carInfoMode} intro={message} onCheckboxSelect={tableFunctions[0]} messageIndex={messageIndex} selectedCars={selectedCars} onCompare={tableFunctions[1]} onTableBack={tableFunctions[2]}/>
          </Fragment>}
        {
          author==="Login" && <ExistingOwner setMessages={setMessages} setMenuButtons={setMenuButtons} handleUserInput={handleUserInput} justSelect={message.length>0} selectedCar={selectedCar}
          setSelectedCar={setSelectedCar} hide={message.length==0}/>
        }
    </div>
    </div>)
}
