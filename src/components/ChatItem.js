import { Fragment, useState } from "react";
import '../styles/ChatItem.css'
import { VolumeUp } from "react-bootstrap-icons";

function extractLinkFromText(messageText, author){
    const wordsArray = messageText.split(" ")
    const linkIndex = wordsArray.findIndex(str=>str.includes('https'))

    const beforeText=linkIndex>=0?wordsArray.slice(0, linkIndex).join(" ")+" ":""
    const link = wordsArray[linkIndex]
    const afterText=linkIndex===wordsArray.length-1?"":((link?" ":"")+wordsArray.slice(linkIndex+1, wordsArray.length).join(" "))
    

    return (
        <p style={{textAlign: 'left', color:author.toLowerCase()==='you'?'black':'rgb(1, 36, 154)'}}>
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

export default function ChatItem({message, author, line}){
    const [isSpeaking, toggleIsSpeaking] = useState(false)
    return(<Fragment>
        <p className={author.toLowerCase().replace(" ", "-")}>{author}</p>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {extractLinkFromText(message, author)}
            {author.toLowerCase()!=='you' && <VolumeUp color={isSpeaking?"blue":"black"} size="1.5rem" onClick={()=>{
                if(!isSpeaking)
                    dictate(message, toggleIsSpeaking)
                }
            }
            />}
        </div>
        {line && <hr style={{width: '90vw', borderColor: author.toLowerCase()==='you'?'#999':'rgb(49, 135, 255)'}}/>}
    </Fragment>)
}