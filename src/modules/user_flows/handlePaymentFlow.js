import trims from "../../jsons/trims.json";
import electric from "../../jsons/EV.json";
import carPrices from "../../jsons/carPrices.json";
import '../../styles/App.css';
import images from "../../images/image_link.json";

export default function handlePaymentFlow(calcStep, model, setModel, query, setQuery, setMessages, setMenuButtons, setCalcButtons, blockQueries, setCalcStep, trim, setTrim, calcMode, setCalcMode, setLeaseStep, setFinanceStep, leaseStep, financeStep, changeChoice, setShowCalcButtons, setCalcHeadingText, payment, setPayment, origButtons, setOptionButtons) {
  const mosToAPR = { 36: .009, 48: .019, 60: .029, 72: .049, 84: .069 };
  console.log("Top");
  console.log(calcStep);
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
                    setMessages((m) => [...m, { msg: trim, author: "You" }]);
                    setCalcButtons([]);
                    setShowCalcButtons(false);}}>
                        <img style={{ width: "160px", height: "auto" }} src={images[model][trim]} />
                    <br />{trim}</button>)
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
                        //setCalcHeadingText('Choose lease duration (months)');
                        setMessages((m) => [...m, { msg: "Please select your desired lease duration, in months", author: "Ford Chat", line: true }]);
                        //setShowCalcButtons(true);
                        setOptionButtons(<div className='option-buttons'>
                            {durations.map(dur => (<button className='button-small' key={dur.toString()} value={dur} 
                            onClick={() => 
                                {setQuery(dur);
                                    setMessages((m) => [...m, { msg: `${dur.toString()} months`, author: "You" }]);
                                    setOptionButtons([]);}}>{dur.toString()}</button>))}
                        </div>);
                        blockQueries.current = false;
                        setLeaseStep(3);
                        break;
                    case 3: // miles
                        setPayment(payment => {return (payment/(query*2))})
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
                        setMessages((m) => [...m, { msg: "Please select your desired loan duration, in months", author: "Ford Chat", line: true, zip:"" }]);
                        setOptionButtons(<div className='option-buttons'>
                            {durations.map(dur => (<button className='button-small' key={dur.toString()} value={dur} 
                            onClick={() => 
                                {setQuery(dur);
                                    setMessages((m) => [...m, { msg: `${dur.toString()} months`, author: "You" }]);
                                    setOptionButtons([]);}}>{dur.toString()}</button>))}
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
        console.log("here");
        let final = 0;
        switch (calcMode) {
            case 1: // lease
                setPayment(payment);
                final = payment;
                setMessages((m) => [...m, { msg: `Your expected monthly payment is $${Math.round(final)}`, author: "Ford Chat", line: true }]);
                break;
            case 2: // finance 
                let apr = mosToAPR[query];
                setPayment(payment => {return (((apr/12)*payment)/(1-((1+(apr/12))**(0-query))))});
                final = ((apr/12)*payment)/(1-((1+(apr/12))**(0-query)));
                setMessages((m) => [...m, { msg: `Your expected monthly payment is $${Math.round(final)}`, author: "Ford Chat", line: true }]);
                break;
            case 3: // buy
                setPayment(payment => { return (payment - query)});
                final = payment - query;
                setMessages((m) => [...m, { msg: `Your expected price is $${Math.round(final)}`, author: "Ford Chat", line: true }]);
                break;
        }
        blockQueries.current = false;
        setMessages((m) => [...m, { msg: "Is there anything else I can help you with?", author: "Ford Chat", line: true }]);
        setMenuButtons(origButtons);
        setCalcStep(0);
        setCalcMode(0);
        break;
    }
  }