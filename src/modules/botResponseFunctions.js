import { createRecommendTable } from "./recommend";

export async function sendBotResponse(query, history, mode) {
  console.log(JSON.stringify({ debug: true, quer: query }));
  let newQuery=""
  if(history.length>0){
    newQuery += "Here's our conversation before:\n";
    history.forEach((h) => {
      if(h.a.includes("I recommend these cars for you:"))
      newQuery+=(newQuery.includes("Previously,")?"Then, ":"Previously, ")+"I was looking for "+h.q.split("I'm looking for: ")[1]+" and you recommended these cars for me: "+h.a.split("I recommend these cars for you:")[1]+"\n"
      else
      newQuery += `Q: ${h.q}\nA: ${h.a}\n`;
    });
    if(mode==="recommend")
      newQuery+="Here's my new question: "+query;
    else
      newQuery += `Here's my new question: ${query}`;
  } else
    newQuery=query
  console.log("NEW QUERY "+newQuery);
  const response = await fetch("https://fordchat.franklinyin.com:5000/quer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mode: mode, quer: newQuery }),
  })
    .then((res) => {
      return res.json();
    })
    .then((msg) => {
      console.log("message", msg);
      return msg.response.replaceAll("A: ", "");
    })
    .catch((err) => {
      console.log(err.message);
    });
  return response;
}

export function sendRecommendRequestToServer(query, history, carInfoData, messages, forceUpdate, blockQueries, setCarInfoData, setMessages, setForceUpdate, setHistory, fixTrimQueryQuotation) {
  return sendBotResponse(query, history, "recommend").then((res) => {
      blockQueries.current = false;
      setForceUpdate(!forceUpdate)
      let recHistory=""
      if(res.includes("RECOMMEND_TABLE")){
        let finalTableData=[]
        let promises=[]
        recHistory+="I recommend these cars for you:\n"
        createRecommendTable(res).forEach(car=>{
          recHistory+=car.model+" "+car.trim+", "
          console.log(car.model, car.trim + car.msrp)
          const queryFixed=fixTrimQueryQuotation(car.model, `SELECT * FROM car_info WHERE model = "${car.model}" AND trim = "${car.trim}" AND msrp = "${car.msrp}" LIMIT 2`)
          promises.push(fetch(`https://fordchat.franklinyin.com:5000/data?query=${queryFixed}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
          }).then((res) => {
              return res.json();
          }).then(data=>{
            data = data.map((car) => ({
              ...car, isChecked:false
            }))
            finalTableData=[...finalTableData, ...data]
          }))
        })
        Promise.all(promises).then(()=>{
          let carInfoCopy=carInfoData
          carInfoCopy[""+messages.length]=[finalTableData,[]]
          setCarInfoData(carInfoCopy);
          setMessages((m) => [...m, { msg: "Sure! Here are some cars I recommend for you. Click on the image of a car you would like to forward with. Also, feel free to ask for more info about any of these cars, or why I recommended them.", author: "Table", line : false, zip : ""}]);
          setHistory((h) => [...h.slice(-4), { q: "I'm looking for: "+query, a: recHistory }]);
          setForceUpdate(!forceUpdate)
        })
      }
      else{
        setMessages((m) => [
          ...m,
          { msg: res, author: "Ford Chat", line: true, zip: {} }
        ]);
        setHistory((h) => [...h.slice(-4), { q: query, a: res }]);
      }
    });
  }