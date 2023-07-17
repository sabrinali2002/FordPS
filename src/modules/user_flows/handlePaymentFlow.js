import trims from "../../jsons/trims.json";
import EV from "../../jsons/EV.json";

export default function handlePaymentFlow(calcStep, model, setModel, query, setMessages, setCalcButtons, calcButtonHandler, blockQueries, setCalcStep, trim, setTrim, calcMode, setCalcMode, setLeaseStep, setFinanceStep, leaseStep, financeStep, changeChoice) {
    switch (calcStep) {
      case 1: //trim
        if (model === "") {
          setModel(query);
        }
        setMessages((m) => [
          ...m,
          {
            msg: "What trim are you interested in?",
            author: "Ford Chat",
          },
        ]);
        setCalcButtons(
          trims[query].map((trim) => (
            <button
              className="calc-button"
              key={trim}
              value={trim}
              onClick={calcButtonHandler}
            >
              {trim}
            </button>
          ))
        );
        blockQueries.current = false;
        setCalcStep(2);
        break;
      case 2: //lease,finance,buy
        if (trim === "") {
          setTrim(query);
        }
        const options = ["Lease", "Finance", "Buy"];
        setMessages((m) => [
          ...m,
          {
            msg: "Would you like to lease, finance, or buy?",
            author: "Ford Chat",
          },
        ]);
        setCalcButtons(
          options.map((option) => (
            <button
              className="calc-button"
              style={{ fontSize: "14px" }}
              key={option}
              value={option}
              onClick={calcButtonHandler}
            >
              {option}
            </button>
          ))
        );
        blockQueries.current = false;
        setCalcStep(3);
        break;
      case 3:
        switch (calcMode) {
          case 0:
            if (query === "Lease") {
              setMessages((m) => [
                ...m,
                {
                  msg: "Please enter your down payment, or 0",
                  author: "Ford Chat",
                },
              ]);
              setCalcMode(1);
              setLeaseStep(1);
            } else if (query === "Finance") {
              setMessages((m) => [
                ...m,
                {
                  msg: "Please enter your down payment, or 0",
                  author: "Ford Chat",
                },
              ]);
              setCalcMode(2);
              setFinanceStep(1);
            } else if (query === "Buy") {
              setMessages((m) => [
                ...m,
                {
                  msg: "Please enter your trade-in value, or 0",
                  author: "Ford Chat",
                },
              ]);
              setCalcStep(4);
            }
            blockQueries.current = false;
            break;
          case 1: // lease
            switch (leaseStep) {
              case 1: // trade-in
                setMessages((m) => [
                  ...m,
                  {
                    msg: "Please enter your trade-in value, or 0",
                    author: "Ford Chat",
                  },
                ]);
                blockQueries.current = false;
                setLeaseStep(2);
                break;
              case 2: // months
                let durations = [24, 36, 39, 48];
                setMessages((m) => [
                  ...m,
                  {
                    msg: "Please enter the desired duration of the lease, in months",
                    author: "Ford Chat",
                  },
                ]);
                setCalcButtons(
                  durations.map((dur) => (
                    <button
                      className="calc-button"
                      style={{ fontSize: "14px" }}
                      key={dur.toString()}
                      value={dur}
                      onClick={calcButtonHandler}
                    >
                      {dur.toString()}
                    </button>
                  ))
                );
                blockQueries.current = false;
                setLeaseStep(3);
                break;
              case 3: // miles
                setMessages((m) => [
                  ...m,
                  {
                    msg: "Please enter the expected miles driven annually",
                    author: "Ford Chat",
                  },
                ]);
                blockQueries.current = false;
                setLeaseStep(0);
                setCalcStep(4);
                break;
            }
            break;
          case 2: // finance
            switch (financeStep) {
              case 1: // trade-in
                setMessages((m) => [
                  ...m,
                  {
                    msg: "Please enter your trade-in value, or 0",
                    author: "Ford Chat",
                  },
                ]);
                blockQueries.current = false;
                setFinanceStep(2);
                break;
              case 2: // months
                let durations = [36, 48, 60, 72, 84];
                setMessages((m) => [
                  ...m,
                  {
                    msg: "Please enter the desired duration of the loan, in months",
                    author: "Ford Chat",
                  },
                ]);
                setCalcButtons(
                  durations.map((dur) => (
                    <button
                      className="calc-button"
                      style={{ fontSize: "14px" }}
                      key={dur.toString()}
                      value={dur}
                      onClick={calcButtonHandler}
                    >
                      {dur.toString()}
                    </button>
                  ))
                );
                blockQueries.current = false;
                setFinanceStep(3);
                break;
              case 3: // percentage
                setMessages((m) => [
                  ...m,
                  {
                    msg: "Please enter the desired annual percentage rate",
                    author: "Ford Chat",
                  },
                ]);
                blockQueries.current = false;
                setFinanceStep(0);
                setCalcStep(4);
                break;
            }
            break;
        }
        break;
      case 4:
        let payment = 10;
        setMessages((m) => [
          ...m,
          {
            msg: `Your expected monthly payment is ${payment}`,
            author: "Ford Chat",
          },
        ]);
        blockQueries.current = false;
        setCalcStep(5);
        break;
      case 5:
        console.log("here");
        //console.log(json_data);
        if (model in Object.keys(EV)) {
          if (trim in EV[model]) {
            setMessages((m) => [
              ...m,
              {
                msg: "Would you like car delivery or pickup?",
                author: "Ford Chat",
              },
            ]);
          }
        }
        setCalcStep(6);
        blockQueries.current = false;
        break;
      case 6: // go to dealership finder
        setMessages((m) => [
          ...m,
          {
            msg: "Type in your zip code to find the nearest dealership",
            author: "Ford Chat",
            line: true,
          },
        ]);
        changeChoice("B");
        blockQueries.current = false;
        setCalcStep(0);
        setCalcMode(0);
        //changeChoice('A');
        break;
    }
  }