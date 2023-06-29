import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import data from './zipLocations.json'

function Map() {
  const [latlong,changeLat] = useState([40.78,-73.97]);
  function enteredLoc(lat,lon){
    changeLat([lat,lon]);
  }
  
  const customMarkerIcon = L.icon({
    iconUrl: "https://www.freeiconspng.com/thumbs/pin-png/pin-png-28.png",
    iconSize: [32, 32], // Adjust the icon size if necessary
  });
  const findLocations = async () => {
    const zip = document.getElementById('zip').value;
    const result = await findLatLong(zip);
    enteredLoc(result.latitude,result.longitude);
    const distances = {}
    const l = [result.latitude,result.longitude];
    for (const coords in data){
      const [lat,lon] = coords.split(" ");
      const address = data[coords].address + " " + data[coords].city;
      const distance = calculateDistance(l[0],l[1],parseFloat(lat),parseFloat(lon));
      distances[address] = distance;
    }
    const sortedLocations = Object.entries(distances).sort((a,b)=>a[1]-b[1]);
    const closestLocations = sortedLocations.slice(0,5);
    console.log(closestLocations);
  }
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
  
    const distance = R * c;
    return distance;
  }
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  const findLatLong = (zip) => {
    const s = "http://api.weatherapi.com/v1/current.json?key=c722ececb1094322a31191318231606&q="+zip;
    return fetch(s)

      .then((response)=>response.json())

      .then((data) => {
        let latitude = data.location.lat;
        let longitude = data.location.lon;
        const res = {latitude,longitude};
        return res;
      });
  }
  return (
    <div>
    <MapContainer
      center={[40.78,-73.97]}
      zoom={5}
      style={{ height: '900px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="Map data &copy; OpenStreetMap contributors"
      />
      <Marker position={latlong} icon={customMarkerIcon} id = "mark" />
    </MapContainer>
    <form>
      <input placeholder = "Enter your zip:" id = "zip"></input>
    </form>
    <button onClick={findLocations}>Submit</button>
  </div>
  );
}

export default Map;

