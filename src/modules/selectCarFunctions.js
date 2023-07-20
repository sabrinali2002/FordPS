export function handleCarInfo(tableForceUpdate, setTableForceUpdate, selectedModel, selectedTrim, carInfoMode, compareModel, compareTrim, carInfoData, messages, setCarInfoData, setForceUpdate, forceUpdate, fixTrimQueryQuotation) {
    return async (model, trim) => {
        let selectedModel = model;
        let selectedTrim = trim;
        let sqlQuery = "";
        if (selectedModel !== "no model") {
            sqlQuery += `SELECT * FROM car_info WHERE model = "${selectedModel}" `;
        }
        if (selectedTrim !== "no trim" && selectedTrim !== "all trim" && selectedTrim !== "") {
            sqlQuery += `AND trim = "${selectedTrim}"`;
        }
        sqlQuery = fixTrimQueryQuotation(selectedModel, sqlQuery);
        console.log(sqlQuery);
        let dataArr = [];
        let data = await fetch(`http://fordchat.franklinyin.com/data?query=${sqlQuery}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            return res.json();
        });

        let data2 = [];
        if (carInfoMode === "compare") {
            sqlQuery = `SELECT * FROM car_info WHERE model = "${compareModel}" AND trim = "${compareTrim}"`;
            sqlQuery = fixTrimQueryQuotation(compareModel, sqlQuery);
            data2 = await fetch(`http://fordchat.franklinyin.com/data?query=${sqlQuery}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                return res.json();
            });
        }
        console.log("compare trim:" + compareTrim);
        dataArr = [data, data2];
        let carInfoCopy = carInfoData;
        carInfoCopy["" + (messages.length + 2)] = dataArr;
        console.log(messages.length - 1, carInfoCopy["" + (messages.length - 1)]);
        console.log(dataArr);
        console.log("🚗" + selectedModel + selectedTrim);
        console.log("carinfocopy:",carInfoCopy);
        setCarInfoData(carInfoCopy);
        setForceUpdate(!forceUpdate);
        // setTableForceUpdate(!tableForceUpdate);
    };
}

export function handleCarComparison(carInfoMode, setCarInfoMode, setSelectedModel, setSelectedTrim) {
    return () => {
        if (carInfoMode === "single") {
            setCarInfoMode("compare");
            setSelectedModel("");
            setSelectedTrim("");
        } else {
            setCarInfoMode("single");
            setSelectedModel("");
            setSelectedTrim("");
        }
    };
}

export function onTrimChange(setSelectedTrim, setCompareTrim) {
    return (event) => {
        const id = event.target.parentNode.id;
        if (id === "firstCar") {
            setSelectedTrim(event.target.value);
        }
        if (id === "secondCar") {
            setCompareTrim(event.target.value);
        }
    };
}

export function onModelChange(setSelectedModel, setSelectedTrim, setCompareModel, setCompareTrim, trims) {
    return (event) => {
        const id = event.target.parentNode.id;
        if (id === "firstCar") {
            setSelectedModel(event.target.value);
            setSelectedTrim("");
        }
        if (id === "secondCar") {
            setCompareModel(event.target.value);
            const firstTrim = trims[event.target.value][0];
            setCompareTrim(firstTrim);
        }
    };
}
