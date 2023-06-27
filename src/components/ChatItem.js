import { Fragment } from "react";
import '../styles/ChatItem.css'

export default function ChatItem({message, author}){
    return(<Fragment>
        <p className={author.toLowerCase()}>{author}</p>
        <p style={{textAlign: 'left', color:author.toLowerCase()==='you'?'black':'rgb(1, 36, 104)'}}>{message}</p>
        <hr style={{width: '90vw', borderColor: author.toLowerCase()==='you'?'#999':'rgb(49, 135, 255)'}}/>
    </Fragment>)
}