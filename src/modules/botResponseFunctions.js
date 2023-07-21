import { createRecommendTable } from "./recommend";

export async function sendBotResponse(query, history, mode) {
  console.log(JSON.stringify({ debug: true, quer: query }));
  let newQuery=""
  if(mode==="chat"){
    newQuery += "Here's our conversation before:\n";
    history.forEach((h) => {
      newQuery += `Q: ${h.q}\nA: ${h.a}\n`;
    });
    newQuery += `Here's my new question: ${query}`;
  } else
    newQuery=query
  console.log(newQuery);
  const response = await fetch("http://fordchat.franklinyin.com/quer", {
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
    sendBotResponse(query, history, "recommend").then((res) => {
      if(res.includes("RECOMMEND_TABLE")){
        let finalTableData=[]
        let promises=[]
        createRecommendTable(res).forEach(car=>{
          console.log(car.model, car.trim)
          const query=fixTrimQueryQuotation(car.model, `SELECT * FROM car_info WHERE model = "${car.model}" AND trim = "${car.trim}" AND msrp = "${car.msrp}" LIMIT 2`)
          promises.push(fetch(`http://fordchat.franklinyin.com/data?query=${query}`, {
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
          setMessages((m) => [...m, { msg: "Sure! Here are some cars I recommend for you. Feel free to ask for more info about any of these cars, or why I recommended them.", author: "Table", line : false, zip : ""}]);
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
      blockQueries.current = false;
      setForceUpdate(!forceUpdate)
    });
  }