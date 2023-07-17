import trims from "../../jsons/trims.json";

export default function handleDealerFlow(zipMode, setZipCode, query, setMessages, extractFiveDigitString, setZipMode, setDistance, setCalcButtons, calcButtonHandler, findLocations, zipCode, distance, findMode, selectHandler, setFind, appendSelect, setSelect) {
    switch (zipMode) {
      case 0: {
        setZipCode(query);
        setMessages((m) => [
          ...m,
          {
            msg: "Thank you - I will look for dealerships in the " +
              extractFiveDigitString(query) +
              " area",
            author: "Ford Chat",
            line: false,
            zip: "",
          },
        ]);
        setMessages((m) => [
          ...m,
          {
            msg: "Please enter your preferred radius to find a dealership, or NONE",
            author: "",
            line: true,
            zip: "",
          },
        ]);
        setZipMode(1);
        break;
      }
      case 1: {
        setMessages((m) => [
          ...m,
          {
            msg: "Thank you. Do you want to check availability for a specific model or just locate a dealership near you?",
            author: "Ford Chat",
            line: true,
            zip: "",
          },
        ]);
        setDistance(query === "NONE" ? 10 : query);
        let arr = { "Specific Model": "", "Just a Dealership": "" };
        setCalcButtons(
          Object.keys(arr).map((model) => (
            <button
              className="calc-button"
              key={model}
              value={model}
              onClick={calcButtonHandler}
            >
              {model}
            </button>
          ))
        );
        setZipMode(2);
        break;
      }
      case 2: {
        if (query === "Specific Model") {
          setMessages((m) => [
            ...m,
            {
              msg: "Thank you. Please select 1-3 models/trims of the specific cars you are looking for.",
              author: "Ford Chat",
              line: true,
              zip: "",
            },
          ]);
          setZipMode(3);
        } else {
          findLocations(zipCode, distance).then((loc) => {
            const places = loc.split("..");
            console.log("places: ");
            console.log(places);
            for (let i = 0; i < places.length - 1; i++) {
              if (i === 0) {
                setMessages((m) => [
                  ...m,
                  {
                    msg: places[i],
                    author: "Ford Chat.",
                    line: false,
                    zip: {
                      zipcode: extractFiveDigitString(zipCode),
                      dist: distance,
                    },
                  },
                ]);
              } else if (i === places.length - 2) {
                setMessages((m) => [
                  ...m,
                  { msg: places[i], author: "", line: true, zip: {} },
                ]);
              } else {
                setMessages((m) => [
                  ...m,
                  { msg: places[i], author: "", line: false, zip: {} },
                ]);
              }
            }
            setZipMode(0);
          });
          break;
        }
      }
        break;
      case 3:
        {
          {
            if (findMode === 0) {
              setCalcButtons(
                Object.keys(trims).map((model) => (
                  <button
                    className="calc-button"
                    key={model}
                    value={model}
                    onClick={selectHandler}
                  >
                    {model}
                  </button>
                ))
              );
              setFind(1);
            } else {
              setCalcButtons(
                trims[query].map((trim) => (
                  <button
                    className="calc-button"
                    key={trim}
                    value={trim}
                    onClick={appendSelect}
                  >
                    {trim}
                  </button>
                ))
              );
              setSelect(true);
            }
          }
        }
        break;
    }
  }