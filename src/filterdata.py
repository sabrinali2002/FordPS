from data import models
import json 

dict = {}
for model in models:
    if model["model"] in dict.keys():
        if model["trim"] in dict[model["model"]]:
            continue
        else:   
            dict[model["model"]] = dict[model["model"]] + [model["trim"]]
    else:
        dict[model["model"]] = [model["trim"]]


json_data = json.dumps(dict)
print(json_data)