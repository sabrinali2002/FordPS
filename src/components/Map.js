import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import data from "../jsons/zipLocations.json";
import "./Map.css";
import Modal from "react-modal";
import TestDriveScheduler from "./TestDriveScheduler";
import dealerToTrim from '../jsons/dealerToTrim.json';
import addresses from '../jsons/dealerToAddress.json';
import { FaLocationArrow } from 'react-icons/fa';
import { BsTelephoneFill, BsLink} from 'react-icons/bs';
import { AiFillClockCircle } from 'react-icons/ai';
import { FiLink2 } from 'react-icons/fi';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import close from "../images/close.svg";

function Map({ zip, dist, loc }) {
  const [latlong, changeLatLong] = useState([39, -98]);
  const [locations, changeLocations] = useState([]);
  const [isSchedulerVisible, setIsSchedulerVisible] = useState(false);
  const [pickedLoc, setPickedLoc] = useState("");
  const [specific, setSpecific] = useState(false);
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  const [showWindow, setShowWindow] = useState(false);
  const [windowText, setWindowText] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [popupPos,setPopupPos] = useState([]);
  const [blockPopup, setBlockPopup] = useState(false);

  const handleButtonClick = (loc) => {
    setPickedLoc(loc);
    setIsSchedulerVisible(true);
    console.log(pickedLoc);
  }
  
  const customMarkerIcon = L.icon({
    iconUrl: "https://www.freeiconspng.com/thumbs/pin-png/pin-png-28.png",
    iconSize: [20, 20], // Adjust the icon size if necessary
  });

  const popupHoverOff = () => {
    setShowPopup(false);
    setPopupText('');
    setBlockPopup(false);
  };

  const markerHoverOver = (d) => {
    if (blockPopup) {
      return;
    }
    let dealer = d[0];
    let models = [];
    if (model != '' && trim != '') { // know model & trim
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
          if (models.length < 2) {
            models.push([model, trims]);
          } 
        }
        while (models.length < 2) { // not enough trims of model
          let x = 0;
          // append first trim of similar model
        }
      }
    }
    else if (models != '') { // know model, not trim
      for (let trims of dealerToTrim[dealer][model]) {
        if (models.length < 2) {
          models.push([model, trims]);
        }
      }
      while (models.length < 2) { // not enough trims of model
        let x = 0;
        // append first trim of similar model
      }
    }
    else { // know neither
      for (let currmodel of Object.keys(dealerToTrim[dealer])) {
        if (models.length < 2) {
          if (dealerToTrim[dealer][currmodel].length != 0) {
            models.push([currmodel, dealerToTrim[dealer][currmodel][0]]);
          }
          else {
            continue;
          }
        }
      }
    }
    let addr = d[1];
    let phone = '000-000-0000';
    let link = 'www.com';
    let today = new Date();
    let currHr = today.getHours();
    let currDay = today.getDay();
    let hours = '';
    let text = (<p className='hover-content'>
        <span style={{color:'#322964',paddingTop:'20px',fontSize:'30px',fontWeight:'bold'}}>{dealer}</span><br/>
        <span style={{fontSize:'17px'}}><FaLocationArrow/><span style={{paddingLeft:'8px'}}>{addr}</span><br/>
        <BsTelephoneFill/><span style={{paddingLeft:'8px'}}>{phone}</span><br/>
        <FiLink2/><span style={{paddingLeft:'8px'}}>{link}</span><br/>
        <AiFillClockCircle/><span style={{paddingLeft:'8px'}}>{hours}</span><br/>
        </span>
        <div style={{display:'flex'}}>
          <span style={{width:'50%'}}>
            <span style={{color:'#322964',fontSize:'14px',textDecoration:'underline'}}>
              Available Models/Trims </span>
              <span style={{paddingLeft:'20px'}}><MdOutlineArrowForwardIos/></span>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, auto)',gridGap: '10px'}}>
              {models.map(model => (<div className='model-preview'>{`${model[0]} ${model[1]}`}</div>))}
            </div>
          </span>
          <span style={{width:'50%',right:'-40%'}}>
            <span style={{color:'#322964',fontSize:'14px',textDecoration:'underline'}}>
              Available Appointments
          </span>
          <span style={{paddingLeft:'20px'}}><MdOutlineArrowForwardIos/></span>
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

  const handleLocClick = (d) => {
    let dealer = data[d[1].toString() + ' ' + d[2].toString()]["name"];
    let models = Object.keys(dealerToTrim[dealer]) 
    if (models.length > 5) {
        models = models.slice(0, 5);
    }
    let str = '';
    for (let model of models) {
        str = str + model + ', ';
    }
    let title1 = 'Available models: ';
    let title2 = 'Available dates: ';
    let str1 = str.slice(0, str.length - 2);
    let str2 = "dates";
    let addr = ' ' + d[0];
    let str3 = '000-000-0000';
    let text = (<p>
          <span>
            <span style={{textAlign: 'center', fontSize:'20px', fontWeight:'bold'}}>{dealer}</span><br />
            {addr}
          </span><br />
          <span style={{textAlign:'left', fontSize:'14px'}}><span style={{fontWeight:'bold'}}>{title1}</span>{str1}<br />
        <span style={{fontWeight:'bold'}}>{title2}</span>{str2}<br />
        {str3}</span></p>);
    setShowWindow(true);
    setWindowText(text);
  };

  const findLocations = async (distance) => {
    const result = await findLatLong(zip);
    const distances = {};
    const l = [result.latitude, result.longitude];
    for (const coords in data) {
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
      const arr = closestLocations[i][0].split(", ");
      const location = arr[arr.length - 1].split(" ");
      let address = arr.length === 3 ? arr[0] + arr[1] : arr[0];
      let name = address.split("----");
      topLatLongs.push([name[0], name[1], location[1], location[2]]);
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
    <div
      style={{
        position: "relative",
        backgroundColor: "#113B7A1A",
        width: "1112px",
        height: "435px",
        borderRadius: "15px",
        padding: "25px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
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
      {showPopup && <div className="hover-popup" onMouseLeave={popupHoverOff} style={{position: {popupPos}}}>{popupText}</div>}
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
          }}
        >
          <h3
            style={{
              marginTop: "0",
              marginBottom: "15px",
              fontSize: "24px",
              textAlign: "left",
              color: "#00095B",
            }}
          >
            {`Dealerships ${dist} miles within ${zip}`}
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
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
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
      <img
        src={close}
        alt="Close button"
        style={{
          cursor: "pointer",
          top: "25px",
          position: "absolute",
          right: "25px",
        }} // This changes the cursor to a hand when hovering over the image
      />
    </div>
  );
}

export default Map;

/*
      {showWindow && (<div className='click-popup'>
          <button className='close-button' onClick={onExit}>
            x
          </button>
          {windowText}
          </div>)}
*/