import { Fragment } from "react";
import '../styles/ChatItem.css'
import { VolumeUp } from "react-bootstrap-icons";

function extractLinkFromText(messageText, author){
    const wordsArray = messageText.split(" ")
    const linkIndex = wordsArray.findIndex(str=>str.includes('https'))

    const beforeText=wordsArray.slice(0, linkIndex).join(" ")
    const link = wordsArray[linkIndex]
    const afterText=wordsArray.slice(linkIndex+1, wordsArray.length).join(" ")

    return (
        <p style={{textAlign: 'left', color:author.toLowerCase()==='you'?'black':'rgb(1, 36, 154)'}}>
        {
            beforeText && beforeText
        }
        {
            link && <a href={link}>{link}</a>
        }
        {
            link && afterText
        }
        </p>
    )
}

function dictate(message){
    let utterance = new SpeechSynthesisUtterance(message);
    utterance.rate=1.5
    speechSynthesis.speak(utterance);
}

export default function ChatItem({message, author}){
    return(<Fragment>
        <p className={author.toLowerCase().replace(" ", "-")}>{author}</p>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <p style={{textAlign: 'left', color:author.toLowerCase()==='you'?'black':'rgb(1, 36, 154)', width: '85vw'}}>{message}</p>
            {author.toLowerCase()!=='you' && <VolumeUp size="1.5rem" onClick={()=>{
                dictate(message)
            }}/>}
        </div>
        {/* {extractLinkFromText(message, author)} */}
        <hr style={{width: '90vw', borderColor: author.toLowerCase()==='you'?'#999':'rgb(49, 135, 255)'}}/>
    </Fragment>)
}