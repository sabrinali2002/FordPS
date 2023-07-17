const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", 
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
          "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
          "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
          "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
const url = 'https://www.ford.com/dealerships/dealer-directory/';

const fetchLocations = async (state) => {
    try {
        const response = await axios.get(url + state.toLowerCase());
        const html = response.data;
        const $ = cheerio.load(html);
        const dealershipList = $(".address");
        const dealershipName = $(".dealer-list-heading");
        const dealershipRating = $('.decimal-rating');
        const dealershipNumb = $('.phone');
        const places = {};
        let counter = 0;
        dealershipList.each((index, element) => {
            let location = $(element).text().trim().replace(/(\r\n|\n|\r)/gm, "");
            let arr = location.split("                    ");
            places[counter] = { "address": arr[0], "city": arr[1], "name": $(dealershipName[index]).text(), "rating": $(dealershipRating[index]).text(), "number":$(dealershipNumb[index]).text()};
            counter += 1;
        });
        return places;
    } catch (err) {
        console.log('');
    }
}

const fetchAllLocations = async () => {
    const promises = states.map((state) => fetchLocations(state));
    const allLocations = await Promise.all(promises);
    const locationByState = {};
    for (let i = 0; i < states.length; i++) {
        locationByState[states[i]] = allLocations[i];
    }
    saveLocationsToFile(locationByState);
}

const saveLocationsToFile = (locationByState) => {
    const jsonData = JSON.stringify(locationByState, null, 2);
    fs.writeFile('locations.json', jsonData, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Location data has been saved to locations.json');
        }
    });
}

fetchAllLocations();
