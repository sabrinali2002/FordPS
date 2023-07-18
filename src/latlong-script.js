const data = require('./jsons/locations.json');
const fs = require('fs');

const findLoc = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const latitude = data.location.lat;
    const longitude = data.location.lon;
    const res = { latitude, longitude };
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
const allAddresses = {}
const processLocations = async () => {
  for (let key in data) {
    const val = data[key];
    for (let loc in val) {
      const address = val[loc];
      const zip = address.city.substring(address.city.length - 6);
      const url =
        'http://api.weatherapi.com/v1/current.json?key=c722ececb1094322a31191318231606&q=' +
        zip;

      try {
        const result = await findLoc(url);
        allAddresses[result.latitude + " " + result.longitude] = address;
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
  saveLocationsToFile(allAddresses);
};
const saveLocationsToFile = (locationByState) => {
    const jsonData = JSON.stringify(locationByState, null, 2);
    fs.writeFile('zipLocations.json', jsonData, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Location data has been saved to locations.json');
        }
    });
}
const res = processLocations();