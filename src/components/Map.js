import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import data from "../jsons/zipLocations.json";
import "./Map.css";
import Modal from "react-modal";
import TestDriveScheduler from "./TestDriveScheduler";

function Map({ zip, dist, loc }) {
  const [latlong, changeLatLong] = useState([39, -98]);
  const [locations, changeLocations] = useState([]);
  const [isSchedulerVisible, setIsSchedulerVisible] = useState(false);
  const [pickedLoc, setPickedLoc] = useState("");

  const handleButtonClick = (loc) => {
    setPickedLoc(loc);
    setIsSchedulerVisible(true);
    console.log();
  };

  const customMarkerIcon = L.icon({
    iconUrl: "https://www.freeiconspng.com/thumbs/pin-png/pin-png-28.png",
    iconSize: [20, 20], // Adjust the icon size if necessary
  });
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
    <div
      style={{
        position: "relative",
        backgroundColor: "#113B7A1A",
        width: "1112px",
        height: "435px",
        borderRadius: "15px",
        padding: "25px",
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
              position={[d[1], d[2]]}
              icon={customMarkerIcon}
              id={d[0]}
              eventHandlers={{ click: () => handleButtonClick(d[0]) }}
            />
          );
        })}
      </MapContainer>
      <div style={{ marginLeft: "50px", alignItems: "center" }}>
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            display: "flex",
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
            {`Dealerships ${dist} miles within ${zip}`}
          </h3>
        </div>
        <div
          style={{
            overflowY: "scroll",
            maxHeight: "345px",
          }}
        >
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
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "space-between",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      padding: "0px",
                      marginRight: "0px",
                      marginLeft: "20px",
                    }}
                  >
                    {index + 1}
                  </div>
                  <div
                    style={{
                      marginRight: "25px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "15px",
                        alignItems: "center",
                        justifyContent: "center",
                        alignContent: "center",
                      }}
                    >
                      {e[2]}
                    </div>
                    {e[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Map;
