//Sample Output:
//RECOMMEND_TABLE1. F-150!Raptor R 2. F-150 Lightning!Platinum 3. Mustang Mach-E!GT w/Extended Range 4. F-150!Raptor 5. Expedition!Timberline


function checkIfElementAlreadyExists(array, element){
    array.forEach(el=>{
        if(el.model===element.model&&el.trim===element.trim)
            return true
    })
    return false
}

module.exports.createRecommendTable = function(botResponseString){
    let recommendedCars=[]
    botResponseString.split(". ").forEach((element) => {
        if(element.includes("!")){
            let model = element.split("!")[0]
            let trim = element.split("!")[1].split("\n")[0]
            if(!checkIfElementAlreadyExists(recommendedCars, {model: model, trim: trim}))
                recommendedCars.push({model: model, trim: trim})
        }
    });
    return recommendedCars
}