//Sample Output:
//RECOMMEND_TABLE1. F-150!Raptor R 2. F-150 Lightning!Platinum 3. Mustang Mach-E!GT w/Extended Range 4. F-150!Raptor 5. Expedition!Timberline


function checkIfElementAlreadyExists(array, element){
    let dupe=false
    array.forEach(el=>{
        console.log("COMPARE "+el.trim, element.trim+"; "+(el.trim===element.trim))
        if(el.model===element.model&&el.trim===element.trim&&el.msrp===element.msrp)
            dupe=true
    })
    return dupe
}

module.exports.createRecommendTable = function(botResponseString){
    let recommendedCars=[]
    botResponseString.split(". ").forEach((element) => {
        if(element.includes("!")){
            let model = element.split("!")[0]
            let trim = element.split("!")[1].split("\n")[0]
            let msrp = element.split("!")[2].split("\n")[0]
            if(!checkIfElementAlreadyExists(recommendedCars, {model: model, trim: trim, msrp: msrp}))
                recommendedCars.push({model: model, trim: trim, msrp: msrp})
        }
    });
    console.log(recommendedCars)
    return recommendedCars
}