import trims from "../../jsons/trims.json";

export default function handleDealerFlow(zipMode, dealerList, setZipCode, query, setMessages, extractFiveDigitString, setZipMode, setDistance, findLocations, zipCode, distance) {
  switch(zipMode){
    case 0: {
        setZipCode(query)
        setMessages((m)=>[...m,{msg: "Thank you - I will look for dealerships in the "+extractFiveDigitString(query) + " area", author: "Ford Chat", line:false,zip:""}]);
        setMessages((m)=>[...m,{msg: "Please enter your preferred radius to find a dealership, or NONE", author: "", line:true,zip:""}]);
        setZipMode(1);
        break;
    }
    case 1:{
      setDistance((query==="NONE")?10:query);
      findLocations(zipCode,distance).then(loc=>{
        const places = loc.split('..');
        setMessages((m) => [...m, { msg: "", author: "Ford Chat.", line : false,zip: {zipcode: extractFiveDigitString(zipCode), dist:distance, deal: dealerList}}]);
        // for(let i = 0; i < places.length-1; i++){
        //     if(i === 0){
        //         setMessages((m) => [...m, { msg: "", author: "Ford Chat.", line : false,zip: {zipcode: extractFiveDigitString(zipCode), dist:distance, deal: dealerList}}]);
        //     }
            // else if(i === places.length-2){
            //     setMessages((m) => [...m, { msg: places[i], author: "", line : true,zip:{} }]);
            // }
            // else{
            //     setMessages((m) => [...m, { msg: places[i], author: "", line : false,zip:{}  }]);
            // }
        // }
        setZipMode(0);
})
break; 
    }
}
  }