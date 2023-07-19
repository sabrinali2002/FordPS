import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import data from "../jsons/zipLocations.json";
import "./Map.css";
import Modal from "react-modal";
import TestDriveScheduler from "./TestDriveScheduler";
import dealerToTrim from '../jsons/dealerToTrim.json';
import info from '../jsons/dealerInfo.json';
import { FaLocationArrow } from 'react-icons/fa';
import { BsTelephoneFill, BsLink } from 'react-icons/bs';
import { AiFillClockCircle, AiFillStar, AiOutlineCloseCircle } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';
import { FiLink2 } from 'react-icons/fi';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { BiRegistered } from 'react-icons/bi';
import images from '../images/image_link.json';
import { FaMapMarked } from 'react-icons/fa';
//import { scheduler } from "timers/promises";

function Map({ zip, dist, loc, deal, coords}) {
  const [latlong, changeLatLong] = useState([39, -98]);
  const [locations, changeLocations] = useState([]);
  const [isSchedulerVisible, setIsSchedulerVisible] = useState(false);
  const [pickedLoc, setPickedLoc] = useState("");
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  const [showWindow, setShowWindow] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [popupPos, setPopupPos] = useState([]);
  const [blockPopup, setBlockPopup] = useState(false);
  const [window1Content, setWindow1Content] = useState([]);
  const [window2Content, setWindow2Content] = useState([]);
  const [window3Content, setWindow3Content] = useState([]);

  const customMarkerIcon = L.icon({
    iconUrl: "https://www.freeiconspng.com/thumbs/pin-png/pin-png-28.png",
    iconSize: [20, 20], // Adjust the icon size if necessary
  });

  const goToMap = (address) => {

    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps?q=${encodedAddress}`;

    window.open(mapsUrl, '_blank'); // Open the Google Maps link in a new tab/window
  };

  const popupHoverOff = () => {
    setShowPopup(false);
    setPopupText('');
    setBlockPopup(false);
  };

  const openScheduler = (dealer) => {
    setIsSchedulerVisible(true);
    setShowWindow(false);
    setPickedLoc(dealer);
  }

  const returnCars = (dealer, n) => {
    let models = [];
    if (model !== '' && trim !== '') { // know model & trim
      if (Object.values(dealerToTrim[dealer][model]).includes(trim)) {
        models.push([model, trim]);
        for (let trims of dealerToTrim[dealer][model]) {
          if (trims != trim) {
            models.push([model, trims]);
            break;
          }
        }
      }
      else { // trim unavailable
        for (let trims of dealerToTrim[dealer][model]) {
          if (models.length < n) {
            models.push([model, trims]);
          }
        }
        while (models.length < n) { // not enough trims of model
          let x = 0;
          // append first trim of similar model
        }
      }
    }
    else if (model !== '') { // know model, not trim
      for (let trims of dealerToTrim[dealer][model]) {
        if (models.length < n) {
          models.push([model, trims]);
        }
      }
      while (models.length < n) { // not enough trims of model
        let x = 0;
        // append first trim of similar model
      }
    }
    else { // know neither
      for (let currmodel of Object.keys(dealerToTrim[dealer])) {
        if (models.length < n) {
          if (dealerToTrim[dealer][currmodel].length != 0) {
            models.push([currmodel, dealerToTrim[dealer][currmodel][0]]);
          }
          else {
            continue;
          }
        }
      }
    }
  return models;
  }

  const markerHoverOver = (d) => {
    if (blockPopup) {
      return;
    }
    let dealer = d[0];
    let models = returnCars(dealer,2);
    let addr = info[dealer]["address"];
    let phone = info[dealer]["number"];
    let rating = info[dealer]["rating"];
    let link = `www.${dealer.replaceAll(' ','').replaceAll("'",'').toLowerCase()}.com`;
    let today = new Date();
    let currHr = today.getHours();
    let hrStr = 'Open - closes at 8pm';
    if (currHr > 20 || currHr < 8) {
      hrStr = 'Closed - opens at 8am';
    }
    let text = (<p className='hover-content'>
      <span style={{ color: '#322964', paddingTop: '20px', fontSize: '30px', fontWeight: 'bold' }}>{dealer}</span><br />
      <span style={{ fontSize: '17px' }}>
        <FaLocationArrow /><span style={{ paddingLeft: '8px' }}>{addr}</span><br />
        <BsTelephoneFill /><span style={{ paddingLeft: '8px' }}>{phone}</span><br />
        <FiLink2 /><span style={{ paddingLeft: '8px' }}>{link}</span><br />
        <AiFillStar /><span style={{ paddingLeft: '8px' }}>{rating + ' stars'}</span><br />
        <AiFillClockCircle /><span style={{ paddingLeft: '8px' }}>{hrStr}</span><br />
      </span>
      <div style={{ display: 'flex' }}>
        <span style={{ width: '50%' }}>
          <span style={{ color: '#322964', fontSize: '14px', textDecoration: 'underline' }}>
            Available models/trims </span>
          <span style={{ paddingLeft: '20px' }}><MdOutlineArrowForwardIos /></span>
          <div className='modelprev-container'>
            {models.map(model => (<div className='modelprev-map'>
                <img style={{justifySelf: 'center',position:'relative',right:'10px',width:'90px',height:'auto'}} src={images[model[0]]}/>
              <div>
                {model[0]}<BiRegistered/>{` ${model[1]}`}
              </div>
              </div>))}
          </div>
        </span>
        <span style={{ width: '50%', right: '-40%' }}>
          <span style={{ color: '#322964', fontSize: '14px', textDecoration: 'underline' }}>
            Available appointments
          </span>
          <span style={{ paddingLeft: '20px' }}><MdOutlineArrowForwardIos /></span>
          <div>
            here
          </div>
        </span>
      </div>
    </p>)
    setShowPopup(true);
    setPopupText(text);
    setBlockPopup(true);
    //setShowPopup(false);
  }

  const onExit = () => {
    setShowWindow(false);
    setBlockPopup(false);
  };

  const locClickHandler = (d) => {
    let dealer = d[0];
    let models = returnCars(dealer,5);
    let addr = info[dealer]['address'];
    let phone = info[dealer]['number'];
    let rating = info[dealer]['rating'];
    let link = `www.${dealer.replaceAll(' ','').replaceAll("'",'').toLowerCase()}.com`;
    let today = new Date();
    let currHr = today.getHours();
    let hrStr = 'Open - closes at 8pm';
    if (currHr > 20 || currHr < 8) {
      hrStr = 'Closed - opens at 8am';
    }
    let selection = 'based on your selection';
    if (model == '' && trim == '') {
      selection = '';
    }
    let currMonth = '8';
    let currDay = today.getDate();
    let currTime = currHr;
    let currMin = today.getMinutes();
    if (currMin < 15) {
      currMin = 15;
    }
    else if (currMin < 30) {
      currMin = 30;
    }
    else if (currMin < 45) {
      currMin = 45;
    }
    else if (currMin < 60) {
      currMin = 0;
      currTime = currHr + 1;
    }
    if (currHr < 8) {
      currTime = 8;
    }
    else if (currHr >= 20) {
      currTime = 8;
      currDay = currDay + 1;
    }
    let appts = [];
    for (let i = 0; i < 6; i++) {
      appts.append()
    }
    setShowWindow(true);
    let window1 = (<div className='dealer-window1'>
      <button className='close-button' onClick={onExit}>
        <span style={{position:'relative',right:'6px',bottom:'1.6px'}}><IoMdClose/></span>
      </button>
      <span style={{color:'#322964',fontSize:'24px',fontWeight:'bold'}}>{dealer}</span>
      <span style={{position:'absolute',right:'220px'}}><FaMapMarked/></span>
      <span style={{textDecoration:'underline',fontSize:'16px',position:'absolute',right:'58px',cursor:'pointer'}} onClick={() => goToMap(`${dealer}, ${addr}`)}>
        View on Google Maps</span>
      <br/>
      <span style={{fontSize:'16px',lineHeight:'1.8',position:'relative',left:'4px',top:'5px'}}>
        <FaLocationArrow /><span style={{ paddingLeft: '8px' }}>{addr}</span><br />
        <BsTelephoneFill /><span style={{ paddingLeft: '8px' }}>{phone}</span><br />
        <FiLink2 /><span style={{ paddingLeft: '8px' }}>{link}</span><br />
        <AiFillStar /><span style={{ paddingLeft: '8px' }}>{rating + ' stars'}</span><br />
        <AiFillClockCircle /><span style={{ paddingLeft: '8px' }}>{hrStr}</span><br /></span>
    </div>)
    let window2 = (<div className='dealer-window2'>
      <span style={{fontWeight:'bold',fontSize:'18px',color:'#322964'}}>Models & trims available</span>
      <span style={{paddingLeft:'7px',fontSize:'14px'}}>{selection}</span>
      <span style={{fontSize:'12px',position:'absolute',right:'22px',cursor:'pointer'}} onClick={() => openScheduler(dealer)}>View more
      <span style={{leftPadding:'5px'}}><MdOutlineArrowForwardIos/></span></span>
      <br/>
      <div className='models-container'>
        <div style={{listStyleType: 'none',display: 'flex'}}>
          {models.map(model => (<div className='window-model'>
          <img style={{width:'140px',height:'auto'}} src={images[model[0]]}/><br/>
                {model[0]}<BiRegistered/>{` ${model[1]}`}
              </div>))}
          </div>
      </div>
    </div>)
    let window3 = (<div className='dealer-window2'>
          <span style={{fontWeight:'bold',fontSize:'18px',color:'#322964'}}>Next appointments available</span>
          <span style={{fontSize:'12px',position:'absolute',right:'22px',cursor:'pointer'}} onClick={() => openScheduler(dealer)}>View more
          <span style={{leftPadding:'5px'}}><MdOutlineArrowForwardIos/></span></span>
          <br/>
        </div>)
    setWindow1Content(window1);
    setWindow2Content(window2);
    setWindow3Content(window3);
  };

  const findLocations = async (distance) => {
    const result = await findLatLong(zip);
    // const result = coords === "" ? (await findLatLong(zip)) : coords;
    const distances = {};
    const l = [result.latitude, result.longitude];
    for (const coords in data) {
      if(deal.size === 0 || deal.has(data[coords].name)){
        const [lat, lon] = coords.split(" ");
      const address =
        data[coords].address + " " + data[coords].city + " " + lat + " " + lon;
      const dist = calculateDistance(
        l[0],
        l[1],
        parseFloat(lat),
        parseFloat(lon)
      );
      distances[data[coords].name + "----" + address] = dist;
      }
    }
    const sortedLocations = Object.entries(distances).sort(
      (a, b) => a[1] - b[1]
    );
    let count = 0;
    while (true) {
      if (sortedLocations[count][1] > distance) {
        break;
      }
      count += 1;
    }
    const closestLocations = sortedLocations.slice(0, count);
    let topLatLongs = [];
    for (let i = 0; i < closestLocations.length; i++) {
      let address = closestLocations[i][0];
      let name = address.split('----')[0];
      let rest = address.split('----')[1];
      let loc = rest.split(' ');
      let lat = loc[loc.length-2];
      let long = loc[loc.length-1];
      topLatLongs.push([name,info[name]['address'],lat,long]);
    }
    return topLatLongs;
  };
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = (R * c) / 1.609;
    return distance;
  }
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  const findLatLong = (zip) => {
    const s =
      "http://api.weatherapi.com/v1/current.json?key=c722ececb1094322a31191318231606&q=" +
      zip;
    return fetch(s)
      .then((response) => response.json())

      .then((data) => {
        let latitude = data.location.lat;
        let longitude = data.location.lon;
        const res = { latitude, longitude };
        changeLatLong([res.latitude, res.longitude]);
        console.log(latlong)
        return res;
        //{latitude, longitude}
      });
  };
  useEffect(() => {
    async function fetchInfo() {
      findLatLong(zip).then((res) => {
        findLocations(dist).then((locas) => {
          changeLocations(locas);
          //output the locations [location1, location2, location3, etc.]
        });
      });
    }
    fetchInfo();
  }, [zip, latlong]);
  return (
  <div>
      {showWindow && (<div style={{alignContent:'center'}}>
          {window1Content}
          {window2Content}
          {window3Content}
        </div>)}
    {isSchedulerVisible && <TestDriveScheduler loc={pickedLoc}/>}
  {(!showWindow && !isSchedulerVisible) && <div
      style={{
        position: "relative",
        backgroundColor: "#113B7A1A",
        width: "1112px",
        height: "435px",
        borderRadius: "15px",
        padding: "25px",
      }}>
      <MapContainer
        center={latlong}
        zoom={3}
        style={{
          height: "400px",
          width: "50%", // Increase width to desired value
          display: "flex",
          float: "left",
          marginRight: "20px",
          marginBottom: "0px",
          borderRadius: "15px", // Add this for rounded corners
          overflow: "hidden", // Add this to apply border radius to inner layers
        }}
        id={"map"}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data &copy; OpenStreetMap contributors"
        />
        {locations.map((d) => {
          return (
            <Marker
              position={[d[2], d[3]]}
              icon={customMarkerIcon}
              id={d[0]}
              eventHandlers={{ mouseover: () => markerHoverOver(d) }}

            />
          );
        })}
      </MapContainer>
      {showPopup && <div className="hover-popup" onMouseLeave={popupHoverOff} style={{ position: { popupPos } }}>{popupText}</div>}
      <div
        style={{ marginLeft: "50px", alignItems: "center", marginTop: "10px" }}
      >
        <div
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
            alignContent: "flex-start",
            display: "flex",
            marginBottom: "8px",
            overflowY: "scroll",
            maxHeight: "345px",
          }}
        >
          <h3
            style={{
              marginTop: "0",
              marginBottom: "15px",
              fontSize: "24px",

              color: "#00095B",
            }}
          >
            {`Dealerships within ${dist} miles of ${zip}`}
          </h3>
        </div>
        <div className="custom-scrollbar">
          {locations.map((e, index) => {
            return (
              <button
                style={{
                  color: "#00095B",

                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "15px",
                  marginBottom: "15px",
                  height: "101px",
                  width: "512px",
                }}
                onClick={() => locClickHandler(e)}
              >
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      padding: "0px",
                      marginRight: "0px",
                      marginLeft: "20px",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#00095B",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {index + 1}
                  </div>
                  <div
                    style={{
                      position: "relative",
                      marginLeft: "60px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      {e[0]}
                    </div>
                    <div style={{ fontSize: "18px" }}>{e[1]}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>}
    </div>
  );
}

export default Map;
