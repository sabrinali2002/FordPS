import json;
import random;

# Read the JSON file
with open('zipLocations') as file:
    loc_data = json.load(file)
with open('trims') as file:
    trim_data = json.load(file)

dict = {}
for model in trim_data:
    dict[model] = {}
    trims = trim_data[model]
    for trim in trims:
        arr = []
        for loc in loc_data:
            if random.randint(0,1):
                arr = arr + [loc_data[loc]["name"]]
        dict[model][trim] = arr
print(dict)

json_data = json.dumps(dict)
print(json_data)

