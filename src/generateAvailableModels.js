const data = require('./jsons/trims.json');
const dealerships = require('./jsons/zipLocations.json')
const fs = require('fs');
dict = {}
for(const keys in dealerships){
    let arr = []
    for(const trims in data){
        let num = Math.random();
        if(num<0.5){
            arr.push(trims);
        }
    }
    dict[dealerships[keys]['name']] = arr
}
const jsonData = JSON.stringify(dict, null, 2);
    fs.writeFile('availabilities.json', jsonData, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Location data has been saved to locations.json');
        }
    });