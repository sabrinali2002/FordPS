import trim_data from './trims.json';
import loc_data from './zipLocations.json';
import json from 'json';

dict = {}
for (let model in trim_data) {
    dict[model] = {};
    trims = trim_data[model];
    for (let trim in trims) {
        arr = [];
        for (let loc in loc_data) {
            if (Math.randint(0,1)) {
                arr.push([loc_data[loc]["name"]]);
            }
        }
        dict[model][trim] = arr;
    }
}

print(dict)

json_data = json.dumps(dict)
print(json_data)

/*

let dict = {};
for (let model in trims) {
    dict[model] = {};
    let trim_data = trims[model];
    for (let trim of trim_data) {
        let arr = [];
        for (let loc in data) {
            if (Math.random() > .5) {
                arr.push(data[loc]["name"]);
            }
        }
        dict[model][trim] = arr;
    }
}

//console.log(dict);

let json_data = JSON.stringify(dict);
console.log(json_data);



let dict = {};
for (let loc in data) {
    dict[data[loc]["name"]] = {};
}
for (let model in trimToDealer) {
    for (let trim in trimToDealer[model]) {
        for (let loc of trimToDealer[model][trim]) {
            if (model in dict[loc]) {
                dict[loc][model].push(trim);
            }
            else {
                dict[loc][model] = [trim];
            }
        }
    }
}

let jsondata = JSON.stringify(dict);
console.log(jsondata);

let dict = {};
for (let loc in data) {
    dict[data[loc]["name"]] = {"address": data[loc]["address"] + ', ' + data[loc]["city"], "rating":data[loc]["rating"], "number": data[loc]["number"]};
    //dict[data[loc]["name"]]["address"] = data[loc]["address"] + ', ' + data[loc]["city"];
    //dict[data[loc]["name"]]["rating"] = data[loc]["rating"];
    //dict[data[loc]["name"]]["number"] = data[loc]["number"];
}

let dict_json = JSON.stringify(dict);
console.log(dict_json);


*/