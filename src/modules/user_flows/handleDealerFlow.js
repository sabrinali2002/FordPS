
export default function handleDealerFlow(zipMode, dealerList, setZipCode, query, setMessages, extractFiveDigitString, setZipMode, setDistance, findLocations, zipCode, distance) {
  switch(zipMode){
    case 0: {
        const numberRegex = /\d+/g;
        if(extractFiveDigitString(query)===null || query.match(numberRegex)[0].length != 5){
          setMessages((m)=>[...m,{msg: "Please input a valid zipcode", author: "Ford Chat", line:false,zip:""}]);
          break;
        }
        else{
          setZipCode(query)
          setMessages((m)=>[...m,{msg: "Thank you - I will look for dealerships in the "+extractFiveDigitString(query) + " area", author: "Ford Chat", line:false,zip:""}]);
          setMessages((m)=>[...m,{msg: "Please enter your preferred radius to find a dealership, or NONE", author: "", line:true,zip:""}]);
          setZipMode(1);
          break;
        }
    }
    case 1:{
        const numberRegex = /^[0-9]+$/;
        if(query != "0" && (numberRegex.test(query) || query === "NONE")){
        setDistance((query==="NONE")?10:query);
        setMessages((m) => [...m, { msg: "", author: "Ford Chat.", line : false,zip: {zipcode: extractFiveDigitString(zipCode), dist:(query==="NONE")?10:query, deal: dealerList}}]);
        setZipMode(0);
        }
        else{
          setMessages((m)=>[...m,{msg: "Please input a valid radius", author: "Ford Chat", line:false,zip:""}]);
        }
        break; 
    }
    case 2:{
      setDistance((query==="NONE")?10:query);
        setMessages((m) => [...m, { msg: "", author: "Ford Chat.", line : false,zip: {zipcode: extractFiveDigitString(zipCode), dist:distance, deal: dealerList}}]);
        setZipMode(0);
    }
}
  }