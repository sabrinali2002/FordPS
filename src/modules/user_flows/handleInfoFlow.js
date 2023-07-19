import data from '../../jsons/data.json'
export default function handleInfoFlow(model, trim, setMessages, setModel, setQuery, setInfoMode, setCalcButtons, setMenuButtons, handleUserInput, setShowCalcButtons, setCarInfoData, infoMode){
    if(infoMode===2){
      let arr = {}
    for(let i = 0; i < data.length; i++){
        if(data[i]["model"]===model && data[i]["trim"]===trim){
            setMessages((m)=>[...m,{msg: "", author: "Info", line:true,zip:"", carInfo:data[i]}]);
            arr = data[i]
            break;
        }
    }
    setMessages((m)=>[...m,{msg: "What other information/services would you like for this car?", author: "", line:true,zip:""}]);
    setShowCalcButtons(false);
    setMenuButtons(<div className="buttons">
    <button className="menu" onClick={()=>{
      setMenuButtons([]);
      setInfoMode(3);
      }}>Schedule a test drive</button>
    <button className="menu" onClick={()=>{
      setMenuButtons([]);
      setCarInfoData(arr);
      setMessages((m)=>[...m,{msg:"", author:"Table", line:true, zip:""}])
    }}>Pricing estimation</button>
    <button className="menu" onClick={()=>{
      setMenuButtons([]);
    }}>More information</button>
  </div>)
    }
    
} 