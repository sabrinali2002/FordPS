// import data from '../../jsons/data.json'

const fixTrimQueryQuotation = (model, trim) => {
  console.log(model)
  if (model !== "Transit Cargo Van" && model !== "E-Transit Cargo Van" && model !== "Transit Crew Van" && model !== "Transit Passenger Van") {
      return trim;
  }
  trim = trim.replaceAll('"', '\\"');
  console.log(trim)
  return trim;
};
const queryDatabase = async (model, trim) => {
  let fixedTrim = fixTrimQueryQuotation(model,trim);
  let sqlQuery = `SELECT * FROM car_info WHERE model = "${model}" AND trim = "${fixedTrim}"`;
  let data = await fetch(`https://fordchat.franklinyin.com:5000/data?query=${sqlQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    return res.json();
  });
  return data;
}

export default async function handleInfoFlow(handleMoreInfo,tableForceUpdate,setTableForceUpdate,handleCarInfoButton,model,trim,setMessages,
  setModel,setQuery,setInfoMode,setCalcButtons,setMenuButtons,handleUserInput,setShowCalcButtons,setCarInfoData,
  infoMode,selected,changeSelected,setDealers,locateDealershipsFn,setSelect,setFind,query,setZipMode,setOptionButtons,origButtons,forceUpdate,setForceUpdate,knowMyPriceButtons){

    if (infoMode === 2) {
        if (trim === "All Trims") {
          setMessages((m) => [...m, { msg: "Here are all the trims", author: "Ford Chat", line: true, zip: "" }]);
          setMessages((m) => [...m, { msg: "Click on the image of the car you would like to move forward with", author: "Ford Chat", line: true, zip: "" }]);
          setShowCalcButtons(false);
          handleCarInfoButton(model, trim);
          handleMoreInfo();
          setInfoMode(5);
          return;
        }
        // let arr = {};
        // for (let i = 0; i < data.length; i++) {
          //     if (data[i]["model"] === model && data[i]["trim"] === trim) {
            //         setMessages((m) => [...m, { msg: "", author: "Info", line: true, zip: "", carInfo: data[i] }]);
            //         arr = data[i];
            //         break;
            //     }
            // }

        const data = await queryDatabase(model, trim);
        setMessages((m) => [...m, { msg: "", author: "Info", line: true, zip: "", carInfo: data[0] }]);
        setMenuButtons([])
        setMessages((m) => [...m, { msg: "What other information/services would you like for this car?", author: "Ford Chat", line: true, zip: "" }]);
        setShowCalcButtons(false);
        setOptionButtons(
          <div className="option-buttons">
                <button
                    className="button-small"
                    onClick={() => {
                        setMenuButtons([]);
                        setOptionButtons([]);
                        setInfoMode(3);
                        setMessages((m) => [...m, { msg: "Schedule a test drive", author: "You", line: true, zip: {} }]);
                    }}
                >
                    Schedule a test drive
                </button>
                <button
        className="button-small"
        onClick={() => {
          setZipMode(0);
          setMessages((m) => {
            return [...m, { msg: "Negotiation assistance", author: "You" }];
          });
          setMessages((m) => {
            return [
              ...m,
              {
                msg: "What kind of car would you like to know the price for?",
                author: "Ford Chat",
              },
            ];
          });
          setMenuButtons([]);
          setOptionButtons(knowMyPriceButtons);
          setShowCalcButtons(false);
        }}
      >
        Negotiation assistance
      </button>
                <button
                    className="button-small"
                    onClick={() => {
                        setMenuButtons([]);
                        // setOptionButtons([]);
                        handleCarInfoButton(model, trim);
                        setForceUpdate(!forceUpdate);
                        handleMoreInfo();
                        setMessages((m) => [...m, { msg: "What other information/services would you like for this car?", author: "Ford Chat", line: true }]);
                    }}
                >
                    More information
                </button>
            </div>
        );
    } else if (infoMode === 3) {
        setShowCalcButtons(false);
        setMessages((m) => [...m, { msg: "Please enter your zipcode to continue:", author: "Ford Chat", line: true, zip: {} }]);
        setInfoMode(4);
    } else if (infoMode === 5){
        setOptionButtons([]);
        return;
    }
    else if(infoMode ===4){
      const regex = /\b\d{5}\b/g;
      const matches = query.match(regex);
      if (matches && matches.length > 0) {
        const selectedCopy = selected;
        selectedCopy[model].push(trim);
        changeSelected(selectedCopy);
        locateDealershipsFn(setDealers, setCalcButtons, setSelect, selected, setFind, changeSelected, query, -1, setMessages, setZipMode, setShowCalcButtons)();
        setShowCalcButtons(false);
      }
    } 
} 