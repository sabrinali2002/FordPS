import trims from "../../jsons/trims.json";
import EV from "../../jsons/EV.json";

export default function handlePaymentFlow(calcStep, model, setModel, query, setMessages, setCalcButtons, calcButtonHandler, blockQueries, setCalcStep, trim, setTrim, calcMode, setCalcMode, setLeaseStep, setFinanceStep, leaseStep, financeStep, changeChoice, showCalcButtons, setShowCalcButtons, calcHeadingText, setCalcHeadingText, payment, setPayment) {
  switch (calcStep) {
    case 1: //trim 
        if (model === '') {
            setModel(query);
        }
        setCalcHeadingText('Choose specific trim');
        setMessages((m) => [...m, { msg: "What trim are you interested in?", author: "Ford Chat", line: true }]);
        setShowCalcButtons(true);
        setCalcButtons(trims[query].map(trim => (<button className='model-button' style={{width:'140px',height:'100px', textAlign:'center',wordWrap:'wrap',overflowWrap:'wrap'}} key={trim} value={trim} onClick={calcButtonHandler}>{trim}</button>)));
        blockQueries.current = false;
        setCalcStep(2);
        break;
    case 2: //lease,finance,buy
        if (trim === '') {
            setTrim(query);
        }
        setCalcHeadingText('Choose purchase type');
        const options = ['Lease', 'Finance', 'Buy'];
        setMessages((m) => [...m, { msg: "Would you like to lease, finance, or buy?", author: "Ford Chat", line: true }]);
        setShowCalcButtons(true);
        setCalcButtons(options.map(option => (<button className='calc-button' key={option} value={option} onClick={calcButtonHandler}>{option}</button>)));
        blockQueries.current = false;
        setCalcStep(3);
        break;
    case 3:
        setPayment(carPrices[model][trim]);
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
                        setPayment(payment => {return (payment - query)});
                        setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                        blockQueries.current = false;
                        setLeaseStep(2);
                        break;
                    case 2: // months
                        setPayment(payment => {return (payment - query)});
                        let durations = [24, 36, 39, 48];
                        setCalcHeadingText('Choose lease duration (months)');
                        setMessages((m) => [...m, { msg: "Please select the desired lease duration, in months", author: "Ford Chat", line: true }]);
                        setShowCalcButtons(true);
                        setCalcButtons(durations.map(dur => (<button className='calc-button' key={dur.toString()} value={dur} onClick={calcButtonHandler}>{dur.toString()}</button>)));
                        blockQueries.current = false;
                        setLeaseStep(3);
                        break;
                    case 3: // miles
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
                        setPayment(payment => {return (payment - query)});
                        setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                        blockQueries.current = false;
                        setFinanceStep(2);
                        break;
                    case 2: // months
                        setPayment(payment => {return (payment - query)});
                        let durations = [36, 48, 60, 72, 84];
                        setCalcHeadingText('Choose loan duration (months)');
                        setMessages((m) => [...m, { msg: "Please select the desired loan duration, in months", author: "Ford Chat", line: true }]);
                        setShowCalcButtons(true);
                        setCalcButtons(durations.map(dur => (<button className='calc-button' key={dur.toString()} value={dur} onClick={calcButtonHandler}>{dur.toString()}</button>)));
                        blockQueries.current = false;
                        setFinanceStep(0);
                        setCalcStep(4);
                        break;
                }
                break;
        }
        break;
    case 4:
        let final = 0;
        switch (calcMode) {
            case 1: // lease
                setPayment('0');
                final = payment;
                break;
            case 2: // finance 
                let apr = mosToAPR[query];
                setPayment(payment => {return (((apr/12)*payment)/(1-((1+(apr/12))**(0-query))))});
                final = ((apr/12)*payment)/(1-((1+(apr/12))**(0-query)));
                break;
            case 3: // buy
                setPayment(payment => { return (payment - query)});
                final = payment - query;
                break;
        }
        setMessages((m) => [...m, { msg: `Your expected monthly payment is ${Math.round(final)}`, author: "Ford Chat", line: true }]);
        blockQueries.current = false;
        setCalcStep(5);
    case 5:
        if (model in Object.keys(EV)) {
            if (trim in EV[model]) {
                setMessages((m) => [...m, { msg: "Would you like car delivery or pickup?", author: "Ford Chat", line: true }]);
                setCalcStep(6);
            }
        }
        else {
            setMessages((m) => [...m, { msg: "Would you like to send a request to the dealer?", author: "Ford Chat", line: true }]);
            // send to negotiation assistance
        }
        blockQueries.current = false;
    case 6:
        if (query.includes('deliver')) {
            setMessages((m) => [...m, { msg: "Enter your delivery address", author: "Ford Chat", line: true }]);
        }
        else if (query.includes('pick')) {
            setMessages((m) => [...m, { msg: "Type in your zip code to find the nearest dealership", author: "Ford Chat", line: true }]);
            changeChoice('B');
            blockQueries.current = false;
            setCalcStep(0);
            setCalcMode(0);  
        }
        break;
    }
  }