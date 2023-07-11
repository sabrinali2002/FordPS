import { Fragment, useState } from "react";
import '../styles/ChatItem.css'
import { VolumeUp } from "react-bootstrap-icons";
import Map from './Map'
import DropDown from "./DropDown";
import {Button} from 'react-bootstrap';
import CarInfoTable from "./CarInfoTable";
function extractLinkFromText(messageText, author, darkMode){
    const wordsArray = messageText.split(" ")
    const linkIndex = wordsArray.findIndex(str=>str.includes('https'))

    const beforeText=linkIndex>=0?wordsArray.slice(0, linkIndex).join(" ")+" ":""
    const link = wordsArray[linkIndex]
    const afterText=linkIndex===wordsArray.length-1?"":((link?" ":"")+wordsArray.slice(linkIndex+1, wordsArray.length).join(" "))
    

    return (
        <p style={{textAlign: 'left', color:author.toLowerCase()==='you'?(darkMode ? "#e4e4ed" : "#999"):(darkMode ? "#ffffff" : "rgb(1, 36, 154)")}}>
        {
            beforeText && beforeText
        }
        {
            link && <a href={link} target="_blank" rel="noreferrer">{link}</a>
        }
        {
            afterText
        }
        </p>
    )
}

function dictate(message, toggleIsSpeaking){
    toggleIsSpeaking(true)
    let utterance = new SpeechSynthesisUtterance(message);
    utterance.rate=1.5
    utterance.addEventListener("end", ()=>{
        toggleIsSpeaking(false)
    })
    speechSynthesis.speak(utterance);
}


export default function ChatItem({message, author, line, darkMode, textSize, zip, dropDownOptions, carInfoData}){
    const authorStyle = {
        fontSize: textSize === "small" ? "0.8rem" : (textSize === "medium" ? "1.2rem" : "1.4rem"),
        color: (darkMode ? "#ffffff" : "#999"),
      };
    const [isSpeaking, toggleIsSpeaking] = useState(false);
    return(
    <div>
        {author==="Ford Chat." && <Map props = {zip}></Map>}
        {author==="DropDown" && <div><h6>Model:</h6><DropDown  onChange={(event)=>{dropDownOptions[0](event)}} options={dropDownOptions[2]}/></div>}
        {author==="DropDown" && <div><h6>Trim:</h6><DropDown  onChange={(event)=>{dropDownOptions[1](event)}} options={dropDownOptions[3]}/></div>}
        {author==="DropDown" && <Button onClick={dropDownOptions[4]} className="mb-2">Check it out</Button>}
        {author==="Table" && <CarInfoTable data={carInfoData}/>}
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
    </div>)
}