import data from '../jsons/zipLocations.json';
import trims from "../jsons/trims.json";

import trimToDealer from '../jsons/trimToDealer.json'

export const findLocationsGiven = async (query, distance, dealers) => {
  console.log(dealers);
  const zip = extractFiveDigitString(query);
    if(zip !=null){
      try{
          const result = await findLatLong(zip);
          const distances = {}
        const l = [result.latitude,result.longitude];
        for (const coords in data){
          if(dealers.has(data[coords].name)){
            const [lat,lon] = coords.split(" ");
            const address = data[coords].name + ": " + data[coords].address + ", " + data[coords].city + " " + lat + " " + lon;
            const distance = calculateDistance(l[0],l[1],parseFloat(lat),parseFloat(lon));
            distances[address] = distance;
          }
        }
        const sortedLocations = Object.entries(distances).sort((a,b)=>a[1]-b[1]);
        let count = 0;
        while(true){
          if(sortedLocations[count][1] > distance){
            break;
          }
          count += 1
        }
        const closestLocations = sortedLocations.slice(0,count);
        let string = ""
        for(let i = 0; i < closestLocations.length; i++){
          const arr = closestLocations[i][0].split(", ");
          let shortStr = ""
          for(let i = 0; i < arr.length-1; i++){
              shortStr += arr[i] + ", ";
          }
          string += shortStr + "..";
        }
        console.log(string);
        return string;
        }
        catch(err){
          return "Invalid zip";
        }
    }
    return "Please enter a valid zipcode.."
}
//finds the longitude and latitude of the user
const findLatLong = (zip) => {
    const s = "http://api.weatherapi.com/v1/current.json?key=c722ececb1094322a31191318231606&q="+zip;
    return fetch(s).then((response)=>response.json()).then((data) => {
        let latitude = data.location.lat;
        let longitude = data.location.lon;
        const res = {latitude,longitude};
        return res;
      });
  }
  
//extracts the zip code from the user input for map
export const extractFiveDigitString = (inputString) => {
    const regex = /\b\d{5}\b/g;
    const matches = inputString.match(regex);
    if (matches && matches.length > 0) {
      return matches[0];
    }
    return null;
  }
//finding the distance between user input and dealerships
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    function toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c / 1.609;
    return distance;
  }
export const findLocations = async (query, distance) => {
    const zip = extractFiveDigitString(query);
    if(zip !=null){
      try{
          const result = await findLatLong(zip);
          const distances = {}
        const l = [result.latitude,result.longitude];
        for (const coords in data){
          const [lat,lon] = coords.split(" ");
          const address = data[coords].name + ": " + data[coords].address + ", " + data[coords].city + " " + lat + " " + lon;
          const distance = calculateDistance(l[0],l[1],parseFloat(lat),parseFloat(lon));
          distances[address] = distance;
        }
        const sortedLocations = Object.entries(distances).sort((a,b)=>a[1]-b[1]);
        let count = 0;
        while(true){
          if(sortedLocations[count][1] > distance){
            break;
          }
          count += 1
        }
        const closestLocations = sortedLocations.slice(0,count);
        let string = ""
        for(let i = 0; i < closestLocations.length; i++){
          const arr = closestLocations[i][0].split(", ");
          let shortStr = ""
          for(let i = 0; i < arr.length-1; i++){
              shortStr += arr[i] + ", ";
          }
          string += shortStr + "..";
        }
        return string;
        }
        catch(err){
          return "Invalid zip";
        }
    }
    return "Please enter a valid zipcode.."
  }
  export const selectHandlerFn = function (setQuery, setModel, setCalcButtons, setFind) {
    return (event) => {
      let val = event.target.getAttribute("value");
      setQuery(val);
      setModel(val);
      setCalcButtons([]);
      setFind(1);
    };
  }
  export const locateDealershipsFn=function(setDealers, setCalcButtons, setSelect, selected, setFind, changeSelected, zipCode, distance, setMessages, setZipMode) {
    return () => {
      //go through the dealerships that have the cars we want
      //pass in the list of dealership names
      const dealers = new Set();
      for(const m in selected){
          if(selected[m].length!=0){
              let cars = selected[m];
              for(const i in cars){
                  for(const elements in trimToDealer[m][cars[i]]){
                      dealers.add(trimToDealer[m][cars[i]][elements]);
                  }
              }
          }
      }
      setDealers(dealers);
      findLocationsGiven(zipCode,distance, dealers).then(loc=>{
       // setMessages((m)=>[...m,{msg:"",author:"Ford Chat.", line:false, zip: {zipcode: extractFiveDigitString(zipCode), dist:distance, deal: dealers}}]);
          const places = loc.split('..');
          for(let i = 0; i < places.length-1; i++){
              if(i === 0){
                  setMessages((m) => [...m, { msg: places[i], author: "Ford Chat.", line : false,zip: {zipcode: extractFiveDigitString(zipCode), dist:distance, deal: dealers}}]);
              }
              else if(i === places.length-2){
                  setMessages((m) => [...m, { msg: places[i], author: "", line : true,zip:{} }]);
              }
              else{
                  setMessages((m) => [...m, { msg: places[i], author: "", line : false,zip:{}  }]);
              }
          }
          setZipMode(0);
  })
  setCalcButtons([]);
  setSelect(false);
  setFind(0);
  changeSelected({"Bronco": [],"Bronco Sport":[],"E-Transit Cargo Van":[],"Edge":[],"Escape":[],"Expedition":[],"Explorer":[],"F-150":[],"F-150 Lightning":[],"Mustang Mach-E":[],"Ranger":[],"Transit Cargo Van":[]});
  };
  }

  export const calcButtonHandlerFn = function(setQuery, setMessages, setCalcButtons, setShowCalcButtons) {
    return (value) => {
      setQuery(value);
      //setMessages((m) => [...m, { msg: value, author: "You" }]);
      setCalcButtons([]);
      setShowCalcButtons(false);
    };
  }
  
  export const appendSelectFn = function(selected, model, changeSelected) {
    return (event) => {
      let val = event.target.getAttribute("value");
      console.log(val);
      console.log(selected[model]);
      if (val in selected[model]) {
        let copy = selected[model];
        delete copy[val];
        let copy2 = selected;
        delete copy2[model];
        copy2[model] = copy;
        changeSelected(copy2);
      } else {
        let copy = selected[model];
        copy.push(val);
        let copy2 = selected;
        delete copy2[model];
        copy2[model] = copy;
        changeSelected(copy2);
      }
      console.log(selected);
    };
  }
  
export const changeFindFn = function(setFind, setSelect, setCalcButtons, selectHandler) {
    return () => {
      setFind(0);
      setSelect(false);
      setCalcButtons(
        Object.keys(trims).map((model) => (
          <button
            className="calc-button"
            key={model}
            value={model}
            onClick={selectHandler}
          >
            {model}
          </button>
        ))
      );
    };
  }
  
  