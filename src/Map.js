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
  // Create a custom icon instance
  const customMarkerIcon = L.icon({
    iconUrl: "https://www.freeiconspng.com/thumbs/pin-png/pin-png-28.png",
    iconSize: [32, 32], // Adjust the icon size if necessary
  });

  const findLocations = async () => {
    const zip = document.getElementById('zip').value;
    const result = await findLatLong(zip);
    enteredLoc(result.latitude,result.longitude);
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

