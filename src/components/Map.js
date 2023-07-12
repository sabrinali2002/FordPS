import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import data from "../zipLocations.json";
import "./Map.css";
import Modal from "react-modal";
import TestDriveScheduler from "./TestDriveScheduler";

function Map({ zip, dist }) {
  const [latlong, changeLatLong] = useState([39, -98]);
  const [locations, changeLocations] = useState([]);
  const [isSchedulerVisible, setIsSchedulerVisible] = useState(false);
  const [pickedLoc, setPickedLoc] = useState("");

  const handleButtonClick = (loc) => {
    setPickedLoc(loc);
    setIsSchedulerVisible(true);
    console.log(pickedLoc);
  };
import dealerToTrim from '../dealerToTrim.json';
import addresses from '../dealerToAddress.json';

function Map({zip,dist}) {
  const [latlong,changeLatLong] = useState([39,-98]);
  const [locations, changeLocations] = useState([]);
  const [mapPopupText, setMapPopupText] = useState('');
  const [isHoveredMap, setIsHoveredMap] = useState(false);

  const customMarkerIcon = L.icon({
    iconUrl: "https://www.freeiconspng.com/thumbs/pin-png/pin-png-28.png",
    iconSize: [20, 20], // Adjust the icon size if necessary
  });

  const handleMouseEnterMap = () => {
    console.log('here');
    setIsHoveredMap(true);
    // access dealer
    let dealer = 'Sunny King Ford';
    let models = Object.keys(dealerToTrim[dealer]);
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
    let addr = ' ' + addresses[dealer];
    let str3 = '000-000-0000';
    setMapPopupText(<p style={{fontSize:'11px'}}><span style={{fontWeight:'bold'}}>{dealer}</span>{addr}<br />
                        <span style={{fontWeight:'bold'}}>{title1}</span>{str1}<br />
                        <span style={{fontWeight:'bold'}}>{title2}</span>{str2}<br />
                        {str3}</p>);
  };

  const handleMouseLeaveMap = () => {
      setIsHoveredMap(false);
  };

  const findLocations = async (distance) => {
    const result = await findLatLong(zip);
    const distances = {};
    const l = [result.latitude, result.longitude];
    for (const coords in data) {
      const [lat, lon] = coords.split(" ");
      const address =
        data[coords].address + " " + data[coords].city + " " + lat + " " + lon;
      const distance = calculateDistance(
        l[0],
        l[1],
        parseFloat(lat),
        parseFloat(lon)
      );
      distances[address] = distance;
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
      topLatLongs.push([address, location[1], location[2]]);
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
    <div style={{ position: "relative" }}>
      <MapContainer
        center={latlong}
        zoom={3}
        style={{
          height: "400px",
          width: "30%",
          display: "flex",
          float: "left",
          marginRight: "20px",
          marginBottom: "60px",
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
              position={[d[1], d[2]]}
              icon={customMarkerIcon}
              id={d[0]}
              eventHandlers={{ click: () => handleButtonClick(d[0]) }}
             onClick={handleMouseEnterMap} onMouseLeave={handleMouseLeaveMap}/>
          );
        })}
      {locations.map((d)=>{
        return (isHoveredMap && <div className="map-popup">{mapPopupText}</div>)
      })}
      </MapContainer>
      {isSchedulerVisible && (
        <TestDriveScheduler
          onExit={() => setIsSchedulerVisible(false)}
          loc={pickedLoc}
        />
      )}
    </div>
  );
}

export default Map;
