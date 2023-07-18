import data from '../../jsons/data.json'
export default function handleInfoFlow(model, trim, setMessages, setModel, setQuery, setInfoMode, setCalcButtons, changeChoice, handleUserInput){
    for(let i = 0; i < data.length; i++){
        if(data[i]["model"]===model && data[i]["trim"]===trim){
            setMessages((m)=>[...m,{msg: "", author: "Info", line:true,zip:"", carInfo:data[i]}]);
            break;
        }
    }
    setMessages((m)=>[...m,{msg: "What other information/services would you like for this car?", author: "", line:true,zip:""}]);
    setCalcButtons([<button className='calc-button' key={model} value={model} onClick = {
        () => {
            setCalcButtons([]);
            setMessages((m)=>[...m,{msg: "Please enter your zipcode or enable location to continue:", author: "Ford Chat", line:true,zip:""}]);
            setInfoMode(2);
        }
    }>Schedule a test drive</button>, 
    <button className='calc-button' key={model} value={model}>Pricing Estimation</button>, 
    <button className='calc-button' key={model} value={model} onClick = {
        () => {
            changeChoice('C');
            // setMessages((m) => [...m, { msg: "", author: "Table", line: false, zip: "" }]);
        }
    }>More Information</button>])
} 