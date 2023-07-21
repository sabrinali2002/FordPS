import data from '../../jsons/data.json'
export default function handleInfoFlow(model,trim, setMessages, setModel, setQuery, setInfoMode, setCalcButtons, setMenuButtons, handleUserInput, setShowCalcButtons, setCarInfoData, infoMode, selected, changeSelected, setDealers, locateDealershipsFn, setSelect, setFind, query, setZipMode){
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
      setInfoMode(10);
    }}>Pricing estimation</button>
    <button className="menu" onClick={()=>{
      setMenuButtons([]);
      setCarInfoData(arr);
      setMessages((m) => [...m, { msg: "", author: "Table", line:true,zip:{} }]);
    }}>More information</button>
  </div>)
    }
    else if(infoMode === 3){
      setShowCalcButtons(false);
      setMessages((m) => [...m, { msg: "Please enter your zipcode or enable location to continue:", author: "Ford Chat", line:true,zip:{} }]);
      setInfoMode(4);
    }
    else if(infoMode ===4){
      const regex = /\b\d{5}\b/g;
      const matches = query.match(regex);
      if (matches && matches.length > 0) {
        const selectedCopy = selected;
        selectedCopy[model].push(trim);
        changeSelected(selectedCopy);
        locateDealershipsFn(setDealers, setCalcButtons, setSelect, selected, setFind, changeSelected, query, 20, setMessages, setZipMode, setShowCalcButtons)();
        setShowCalcButtons(false);
      }
      else{
        setMessages((m) => [...m, { msg: "Please enter a valid zip", author: "Ford Chat", line:true,zip:{} }]);
      }
    }
    
} 
