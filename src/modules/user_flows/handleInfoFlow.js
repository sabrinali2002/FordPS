import data from '../../jsons/data.json'
export default function handleInfoFlow(model, trim, setMessages, setModel, setQuery, setInfoMode, setCalcButtons){
    for(let i = 0; i < data.length; i++){
        if(data[i]["model"]===model && data[i]["trim"]===trim){
            setMessages((m)=>[...m,{msg: "", author: "Info", line:true,zip:"", carInfo:data[i]}]);
        }
    }
    setModel("");
    setQuery("");
    setInfoMode(0);
    setCalcButtons([])
} 