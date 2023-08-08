import trims from "../../jsons/trims.json";
import electric from "../../jsons/EV.json";
import carPrices from "../../jsons/carPrices.json";
import '../../styles/App.css';
import images from "../../images/image_link.json";

export default function handlePaymentFlow(calcStep, model, setModel, query, setQuery, setMessages, setMenuButtons, setCalcButtons, blockQueries, setCalcStep, trim, setTrim, calcMode, setCalcMode, setLeaseStep, setFinanceStep, leaseStep, financeStep, changeChoice, setShowCalcButtons, setCalcHeadingText, payment, setPayment, origButtons, setOptionButtons, setChatGap) {
    const fixTrimName = (model, trim) => {
        if (
          model !== "Transit Cargo Van" &&
          model !== "E-Transit Cargo Van" &&
          model !== "Transit Crew Van" &&
          model !== "Transit Passenger Van"
        ) {
          return trim;
        }
        trim = trim.replaceAll('"', '');
        return trim;
      };
    const mosToAPR = { 36: .009, 48: .019, 60: .029, 72: .049, 84: .069 };
  switch (calcStep) {
    case 1: //trim 
        if (model === '') {
            setModel(query);
        }
        setCalcHeadingText("Choose specific trim");
        setMessages((m) => [...m, { msg: "What trim are you interested in?", author: "Ford Chat", line: true }]);
        setShowCalcButtons(true);
        setCalcButtons(trims[model].map(trim => 
            (<button className='model-button' key={trim} value={trim} onClick={() => 
                {setQuery(trim);
                    setTrim(trim);
                    setMessages((m) => [...m, { msg: fixTrimName(model,trim), author: "You" }]);
                    setCalcButtons([]);
                    setShowCalcButtons(false);}}>
                        <img style={{ width: "160px", height: "auto" }} src={images[model][trim]} />
                    <br />{fixTrimName(model,trim)}</button>)
            ));
        blockQueries.current = false;
        setCalcStep(2);
        break;
    case 2: //lease,finance,buy
        if (trim === '') {
            setTrim(query);
        }
        const options = ['Lease', 'Finance', 'Buy'];
        setMessages((m) => [...m, { msg: "Would you like to lease, finance, or buy?", author: "Ford Chat", line: true }]);
        setOptionButtons(<div className='option-buttons'>
            {options.map(option => (<button className='button-small' key={option} value={option} 
                onClick={() => 
                    {setQuery(option);
                        setMessages((m) => [...m, { msg: option, author: "You" }]);
                        setOptionButtons([]);}}>{option}</button>))}
        </div>);
        blockQueries.current = false;
        setCalcStep(3);
        break;
    case 3:
        setPayment(carPrices[model][fixTrimName(model,trim)]);
        switch (calcMode) {
            case 0:
                if (query === "Lease") {
                    setMessages((m) => [...m, { msg: "Please enter your down payment (enter 0 for none)", author: "Ford Chat", line: true }]);
                    setCalcMode(1);
                    setLeaseStep(1);
                }
                else if (query === "Finance") {
                    setMessages((m) => [...m, { msg: "Please enter your down payment (enter 0 for none)", author: "Ford Chat", line: true }]);
                    setCalcMode(2);
                    setFinanceStep(1);
                }
                else if (query === "Buy") {
                    setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                    setCalcStep(4);
                    setCalcMode(3);
                }
                blockQueries.current = false;
                break;
            case 1: // lease
                switch (leaseStep) {
                    case 1: // trade-in
                        if (isNaN(query)) {
                            setMessages((m) => [...m, { msg: "Please enter a numeric value", author: "Ford Chat", line: true }]);
                            blockQueries.current = false;
                            break;
                        } 
                        setPayment(payment => {return (payment - query)});
                        setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                        blockQueries.current = false;
                        setLeaseStep(2);
                        break;
                    case 2: // months
                        if (isNaN(query)) {
                            setMessages((m) => [...m, { msg: "Please enter a numeric value", author: "Ford Chat", line: true }]);
                            blockQueries.current = false;
                            break;
                        } 
                        setPayment(payment => {return (payment - query)});
                        let durations = [24, 36, 39, 48];
                        setMessages((m) => [...m, { msg: "Please select your desired lease duration, in months", author: "Ford Chat", line: true }]);
                        setOptionButtons(<div className='option-buttons'>
                            {durations.map(dur => (<button className='button-small' key={dur.toString()} value={dur} 
                            onClick={() => 
                                {setQuery(dur.toString());
                                    setMessages((m) => [...m, { msg: `${dur.toString()} months`, author: "You"}]);
                                    setOptionButtons([]);}}>{dur.toString()}</button>))}
                        </div>);
                        blockQueries.current = false;
                        setLeaseStep(3);
                        break;
                    case 3: // miles
                        setPayment(payment => {return Math.round(payment/(query*2))})
                        setMessages((m) => [...m, { msg: "Please enter the expected miles driven annually", author: "Ford Chat", line: true }]);
                        blockQueries.current = false;
                        setLeaseStep(0);
                        setCalcStep(4);
                        break;
                }
                break;
            case 2: // finance
                switch (financeStep) {
                    case 1: // trade-in
                        if (isNaN(query)) {
                            setMessages((m) => [...m, { msg: "Please enter a numeric value", author: "Ford Chat", line: true }]);
                            blockQueries.current = false;
                            break;
                        } 
                        setPayment(payment => {return (payment - query)});
                        setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                        blockQueries.current = false;
                        setFinanceStep(2);
                        break;
                    case 2: // months
                        if (isNaN(query)) {
                            setMessages((m) => [...m, { msg: "Please enter a numeric value", author: "Ford Chat", line: true }]);
                            blockQueries.current = false;
                            break;
                        } 
                        setPayment(payment => {return (payment - query)});
                        let durations = [36, 48, 60, 72, 84];
                        setMessages((m) => [...m, { msg: "Please select your desired loan duration, in months", author: "Ford Chat", line: true }]);
                        setOptionButtons(<div className='option-buttons'>
                            {durations.map(dur => (<button className='button-small' key={dur.toString()} value={dur} 
                            onClick={() => 
                                {setQuery(dur.toString());
                                    //setDura(dur);
                                    setMessages((m) => [...m, { msg: `${dur.toString()} months`, author: "You" }]);
                                    setPayment(payment => {return Math.round(((mosToAPR[dur]/12)*payment)/(1-((1+(mosToAPR[dur]/12))**(0-dur))))});
                                    setOptionButtons([]);
                                    blockQueries.current = false;}}>{dur.toString()}</button>))}
                        </div>);                        
                        blockQueries.current = false;
                        setFinanceStep(0);
                        setCalcStep(4);
                        break;
                }
                break;
        }
        break;
    case 4:
        switch (calcMode) {
            case 1: // lease
                if (isNaN(query)) {
                    setMessages((m) => [...m, { msg: "Please enter a numeric value", author: "Ford Chat", line: true }]);
                    blockQueries.current = false;
                    break;
                }
                setMessages((m) => [...m, { msg: `Your expected monthly payment for the 2024 ${model} ${fixTrimName(model,trim)} is $${payment}`, author: "Ford Chat", line: true }]);
                break;
            case 2: // finance 
                setMessages((m) => [...m, { msg: `Your expected monthly payment for the 2024 ${model} ${fixTrimName(model,trim)} is $${payment}`, author: "Ford Chat", line: true }]);
                break;
            case 3: // buy
                if (isNaN(query)) {
                    setMessages((m) => [...m, { msg: "Please enter a numeric value", author: "Ford Chat", line: true }]);
                    blockQueries.current = false;
                    break;
                } 
                setPayment(payment => { return (Math.round(payment - query))});
                setMessages((m) => [...m, { msg: `Your expected price for the 2024 ${model} ${fixTrimName(model,trim)} is $${Math.round(payment - query)}`, author: "Ford Chat", line: true }]);
                break;
        }
        if ((calcMode===3 || calcMode===1) && isNaN(query)) {
            break;
        }
        setChatGap(true);
        blockQueries.current = false;
        setMessages((m) => [...m, { msg: "Is there anything else I can help you with?", author: "Ford Chat", line: true }]);
        
        setMenuButtons(origButtons);
        setCalcStep(0);
        setCalcMode(0);
        break;
    }
  }