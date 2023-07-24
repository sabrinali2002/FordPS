import data from "../../jsons/data.json";
export default function handleInfoFlow(
    handleMoreInfo,
    tableForceUpdate,
    setTableForceUpdate,
    forceUpdate,
    setForceUpdate,
    handleCarInfoButton,
    model,
    trim,
    setMessages,
    setModel,
    setQuery,
    setInfoMode,
    setCalcButtons,
    setMenuButtons,
    handleUserInput,
    setShowCalcButtons,
    setCarInfoData,
    infoMode,
    selected,
    changeSelected,
    setDealers,
    locateDealershipsFn,
    setSelect,
    setFind,
    query,
    setZipMode
) {
    if (infoMode === 2) {
        if (trim === "All Trims") {
          setMessages((m) => [...m, { msg: "Here are all the trims", author: "", line: true, zip: "" }]);
          setMessages((m) => [...m, { msg: "You can select which ones to compare", author: "", line: true, zip: "" }]);
          setShowCalcButtons(false);
          handleCarInfoButton(model, trim);
          handleMoreInfo();
          setInfoMode(5);
          return;
        }
        let arr = {};
        for (let i = 0; i < data.length; i++) {
            if (data[i]["model"] === model && data[i]["trim"] === trim) {
                setMessages((m) => [...m, { msg: "", author: "Info", line: true, zip: "", carInfo: data[i] }]);
                arr = data[i];
                break;
            }
        }
        setMessages((m) => [...m, { msg: "What other information/services would you like for this car?", author: "", line: true, zip: "" }]);
        setMenuButtons(
          <div className="buttons">
                <button
                    className="menu"
                    onClick={() => {
                        setMenuButtons([]);
                        setInfoMode(3);
                    }}
                >
                    Schedule a test drive
                </button>
                <button
                    className="menu"
                    onClick={() => {
                        setMenuButtons([]);
                        setCarInfoData(arr);
                        setMessages((m) => [...m, { msg: "", author: "Table", line: true, zip: "" }]);
                    }}
                >
                    Pricing estimation
                </button>
                <button
                    className="menu"
                    onClick={() => {
                        setMenuButtons([]);
                        handleCarInfoButton(model, trim);
                        setForceUpdate(!forceUpdate);
                        handleMoreInfo();
                    }}
                >
                    More information
                </button>
            </div>
        );
        setShowCalcButtons(false);
        setInfoMode(5);
        return;
    } else if (infoMode === 3) {
        setShowCalcButtons(false);
        setMessages((m) => [...m, { msg: "Please enter your zipcode or enable location to continue:", author: "Ford Chat", line: true, zip: {} }]);
        setInfoMode(4);
    } else if (infoMode === 5){
        return;
    } else {
        const selectedCopy = selected;
        selectedCopy[model].push(trim);
        changeSelected(selectedCopy);
        locateDealershipsFn(setDealers, setCalcButtons, setSelect, selected, setFind, changeSelected, query, 20, setMessages, setZipMode)();
        setShowCalcButtons(false);
    }
}
