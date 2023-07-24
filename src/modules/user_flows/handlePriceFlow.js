import electric from '../../jsons/EV.json';
import trims from '../../jsons/trims.json';
import images from '../../images/image_link.json';
import { BiRegistered } from 'react-icons/bi';
import handlePaymentFlow from './handlePaymentFlow.js';
import carPrices from '../../jsons/carPrices.json';

export default function handlePriceFlow(vehicleMode,priceMode,setPriceMode,EV,priceStep,setPriceStep, model, setModel, query, setQuery, setMessages, setMenuButtons, setCalcButtons, blockQueries, setCalcStep, trim, setTrim, setLeaseStep1, setFinanceStep1, leaseStep1, financeStep1, changeChoice, setShowCalcButtons, setCalcHeadingText, payment, setPayment, origButtons, setOptionButtons,setPriceSummary,setShowPriceSummary) {
    const mosToAPR = { 36: .009, 48: .019, 60: .029, 72: .049, 84: .069 };
    switch(priceStep) {
        case 1: // model
            let dict = trims;
            if (vehicleMode == 'electric') {
                dict = electric;
            }
            setMessages((m) => [...m, { msg: "What model are you interested in?", author: "Ford Chat", line: true }]);
            setShowCalcButtons(true);
            setCalcHeadingText("Choose specific model");
            setCalcButtons(
            Object.keys(dict).map(model => (
                <button
                    className="model-button"
                    key={model}
                    value={model}
                    onClick={() => {
                        setQuery(model);
                        setModel(model);
                        setMessages((m) => [...m, { msg: model, author: "You" }]);
                        setCalcButtons([]);
                        setShowCalcButtons(false);
                        }}>
                    <img style={{ width: "160px", height: "auto" }} src={images["Default"][model]} alt='' />
                    <br />
                        {model}
                        <BiRegistered />
                    </button>)));
            setPriceStep(2);
            blockQueries.current = false;
            break;
        case 2: //trim 
            let dict1 = trims;
            if (vehicleMode == 'electric') {
                dict1 = electric;
            }
            if (model === '') {
                setModel(query);
            }
            setCalcHeadingText("Choose specific trim");
            setMessages((m) => [...m, { msg: "What trim are you interested in?", author: "Ford Chat", line: true }]);
            setShowCalcButtons(true);
            setCalcButtons(dict1[model].map(trim => 
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
            setPriceStep(3);
            break;
        case 3: //lease,finance,buy
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
            setPriceStep(4);
            break;
        case 4:
            setPayment(carPrices[model][trim]);
            switch (priceMode) {
                case 0:
                    if (query === "Lease") {
                        setMessages((m) => [...m, { msg: "Please enter your down payment (enter 0 for none)", author: "Ford Chat", line: true }]);
                        setPriceMode(1);
                        setLeaseStep1(1);
                    }
                    else if (query === "Finance") {
                        setMessages((m) => [...m, { msg: "Please enter your down payment (enter 0 for none)", author: "Ford Chat", line: true }]);
                        setPriceMode(2);
                        setFinanceStep1(1);
                    }
                    else if (query === "Buy") {
                        setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                        setPriceStep(5);
                        setPriceMode(3);
                    }
                    blockQueries.current = false;
                    break;
                case 1: // lease
                    switch (leaseStep1) {
                        case 1: // trade-in
                            setPayment(payment => {return (payment - query)});
                            setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                            blockQueries.current = false;
                            setLeaseStep1(2);
                            break;
                        case 2: // months
                            setPayment(payment => {return (payment - query)});
                            let durations = [24, 36, 39, 48];
                            setMessages((m) => [...m, { msg: "Please select your desired lease duration, in months", author: "Ford Chat", line: true }]);
                            setOptionButtons(<div className='option-buttons'>
                                {durations.map(dur => (<button className='button-small' key={dur.toString()} value={dur} 
                                onClick={() => 
                                    {setQuery(dur.toString());
                                        setMessages((m) => [...m, { msg: `${dur.toString()} months`, author: "You" }]);
                                        setOptionButtons([]);}}>{dur.toString()}</button>))}
                            </div>);
                            blockQueries.current = false;
                            setLeaseStep1(3);
                            break;
                        case 3: // miles
                            setMessages((m) => [...m, { msg: "Please enter the expected miles driven annually", author: "Ford Chat", line: true }]);
                            blockQueries.current = false;
                            setLeaseStep1(0);
                            setPriceStep(5);
                            break;
                    }
                    break;
                case 2: // finance
                    switch (financeStep1) {
                        case 1: // trade-in
                            setPayment(payment => {return (payment - query)});
                            setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                            blockQueries.current = false;
                            setFinanceStep1(2);
                            console.log("here");
                            break;
                        case 2: // months
                            console.log("here");
                            setPayment(payment => {return (payment - query)});
                            let durations = [36, 48, 60, 72, 84];
                            //setCalcHeadingText('Choose loan duration (months)');
                            setMessages((m) => [...m, { msg: "Please select your desired loan duration, in months", author: "Ford Chat", line: true }]);
                            //setShowCalcButtons(true);
                            setOptionButtons(<div className='option-buttons'>
                                {durations.map(dur => (<button className='button-small' key={dur.toString()} value={dur} 
                                onClick={() => 
                                    {setQuery(dur.toString());
                                        setMessages((m) => [...m, { msg: `${dur.toString()} months`, author: "You" }]);
                                        setOptionButtons([]);}}>{dur.toString()}</button>))}
                            </div>);                        
                            blockQueries.current = false;
                            setFinanceStep1(0);
                            setPriceStep(5);
                            break;
                    }
                    break;
            }
            break;
        case 5:
            let final = 0;
            switch (priceMode) {
                case 1: // lease
                    setPayment(payment);
                    final = payment;
                    setMessages((m) => [...m, { msg: `Here is the pricing estimation for ${model} ${trim}`, author: "Ford Chat", line: true }]);
                    //blockQueries.current = false;
                    break;
                case 2: // finance 
                    let apr = mosToAPR[query];
                    setPayment(payment => {return (((apr/12)*payment)/(1-((1+(apr/12))**(0-query))))});
                    final = ((apr/12)*payment)/(1-((1+(apr/12))**(0-query)));
                    setMessages((m) => [...m, { msg: `Here is the pricing estimation for ${model} ${trim}`, author: "Ford Chat", line: true }]);
                    //blockQueries.current = false;
                    break;
                case 3: // buy
                    setPayment(payment => { return (payment - query)});
                    final = payment - query;
                    setMessages((m) => [...m, { msg: `Here is the pricing estimation for ${model} ${trim}`, author: "Ford Chat", line: true }]);
                    //blockQueries.current = false;
                    break;
            }
            let text = (<div>
                <span style={{fontSize:'20px'}}>2023 <span style={{fontWeight:'bold'}}>{model}<BiRegistered/> {trim}<BiRegistered/></span> model</span>
            </div>)
            setShowPriceSummary(true);
            setPriceSummary(text);
            switch(vehicleMode) {
                case "electric":
                    setMessages((m) => [...m, { msg: "Would you like to place an order?", author: "Ford Chat", line: true }]);
                    let opts = ['Yes','No'];
                    setOptionButtons(<div className='option-buttons'>
                        {opts.map(o => (<button className='button-small' key={o.toString()} value={o} 
                        onClick={() => 
                            {setQuery(o);
                                setMessages((m) => [...m, { msg: o, author: "You" }]);
                                setOptionButtons([]);}}>{o}</button>))}
                        </div>);
                    //setShowCalcButtons(true);
                    blockQueries.current = false;
                    setPriceStep(6);
                    break;
                case "combustion":
                    setMessages((m) => [...m, { msg: "Would you like to send a request to the dealer?", author: "Ford Chat", line: true }]);
                    let opts1 = ['Yes','No'];
                    setOptionButtons(<div className='option-buttons'>
                        {opts1.map(o => (<button className='button-small' key={o.toString()} value={o} 
                        onClick={() => 
                            {setQuery(o);
                                setMessages((m) => [...m, { msg: o, author: "You" }]);
                                setOptionButtons([]);}}>{o}</button>))}
                        </div>);                
                    blockQueries.current = false;
                    //setShowCalcButtons(true);
                    setPriceStep(7);
                    break;
            }
        case 6:
            switch(query) {
                case 'Yes':
                    //setCalcHeadingText('Delivery or pickup?');
                    setMessages((m) => [...m, { msg: "Would you like car delivery or pickup?", author: "Ford Chat", line: true }]);
                    let opts = ['Delivery','Pickup'];
                    setOptionButtons(<div className='option-buttons'>
                        {opts.map(o => (<button className='button-small' key={o.toString()} value={o} 
                        onClick={() => 
                            {setQuery(o);
                                setMessages((m) => [...m, { msg: o, author: "You" }]);
                                setOptionButtons([]);}}>{o}</button>))}
                        </div>);                
                    //setShowCalcButtons(true);
                    setPriceStep(7);
                    blockQueries.current = false;
                    break;
                case 'No':
                    setPriceStep(0);
                    blockQueries.current = false;
                    //setMenuButtons(origButtons);
                    break;
            }
            break;
        case 7:
            switch(query) {
                case 'Delivery':
                    setMessages((m) => [...m, { msg: "Please enter your delivery address:", author: "Ford Chat", line: true }]);
                    blockQueries.current = false;
                    setPriceStep(8);
                    break;
                case 'Pickup':
                    setMessages((m) => [...m, { msg: "You will now be directed to the dealership finder", author: "Ford Chat", line: true }]);
                    setMessages((m) => [...m, { msg: "Please enter your zipcode below:", author: "Ford Chat", line:true,zip:{} }]);
                    blockQueries.current = false;
                    changeChoice('B');
                    //handleUserInput('B');
                    setPriceStep(0);
                    break;                
                case 'Yes':
                    setMessages((m) => [...m, { msg: "You will now be directed to the dealership finder", author: "Ford Chat", line: true }]);
                    setMessages((m) => [...m, { msg: "Please enter your zipcode below:", author: "Ford Chat", line:true,zip:{} }]);
                    blockQueries.current = false;
                    changeChoice('B');
                    //handleUserInput('B');
                    setPriceStep(0);
                    break;
                case 'No':
                    setPriceStep(0);
                    //setMenuButtons(origButtons);
                    blockQueries.current = false;
                    break;
            }
            break;
        case 8:
            setMessages((m) => [...m, { msg: "Please enter your email address:", author: "Ford Chat", line: true }]);
            blockQueries.current = false;
            setPriceStep(9);
            break;
        case 9:
            setMessages((m) => [...m, { msg: "Thank you! We will process your request and send you a confirmation email shortly.", author: "Ford Chat", line: true }]);
            blockQueries.current = false;
            setPriceStep(0);
            //setMenuButtons(origButtons);
            break;
        }
}
