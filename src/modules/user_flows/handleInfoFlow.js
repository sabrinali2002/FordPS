import data from '../../jsons/data.json'
export default function handleInfoFlow(model, trim, setMessages, setModel, setQuery, setInfoMode, setCalcButtons, setMenuButtons){
    for(let i = 0; i < data.length; i++){
        if(data[i]["model"]===model && data[i]["trim"]===trim){
            setMessages((m)=>[...m,{msg: "", author: "Info", line:true,zip:"", carInfo:data[i]}]);
            break;
        }
    }
    setMessages((m)=>[...m,{msg: "What other information/services would you like for this car?", author: "", line:true,zip:""}]);
    setMenuButtons(<div className="buttons">
    <button className="menu" onClick={()=>{
      setMenuButtons([])
      }}>Schedule a test drive</button>
    <button className="menu" onClick={()=>{
      setMenuButtons([])
    }}>Pricing estimation</button>
    <button className="menu" onClick={()=>{
      setMenuButtons([])
    }}>More information</button>
  </div>)
} 