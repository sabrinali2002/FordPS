import trims from "../../jsons/trims.json";
import EV from "../../jsons/EV.json";
import carPrices from "../../jsons/carPrices.json";
import '../../styles/App.css';
import images from "../../images/image_link.json";

export default function handlePaymentFlow(calcStep, model, setModel, query, setQuery, setMessages, setMenuButtons, setCalcButtons, blockQueries, setCalcStep, trim, setTrim, calcMode, setCalcMode, setLeaseStep, setFinanceStep, leaseStep, financeStep, changeChoice, setShowCalcButtons, setCalcHeadingText, payment, setPayment, origButtons, setOptionButtons) {
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
        //setCalcHeadingText('Choose purchase type');
        const options = ['Lease', 'Finance', 'Buy'];
        setMessages((m) => [...m, { msg: "Would you like to lease, finance, or buy?", author: "Ford Chat", line: true }]);
        //setShowCalcButtons(true);
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
        //setShowCalcButtons(false);
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
                                {setQuery(dur.toString());
                                    setMessages((m) => [...m, { msg: `${dur.toString()} months`, author: "You" }]);
                                    setOptionButtons([]);}}>{dur.toString()}</button>))}
                        </div>);
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
                setPayment(payment);
                final = payment;
                setMessages((m) => [...m, { msg: `Your expected monthly payment is $${Math.round(final)}`, author: "Ford Chat", line: true }]);
                //blockQueries.current = false;
                break;
            case 2: // finance 
                let apr = mosToAPR[query];
                setPayment(payment => {return (((apr/12)*payment)/(1-((1+(apr/12))**(0-query))))});
                final = ((apr/12)*payment)/(1-((1+(apr/12))**(0-query)));
                setMessages((m) => [...m, { msg: `Your expected monthly payment is $${Math.round(final)}`, author: "Ford Chat", line: true }]);
                //blockQueries.current = false;
                break;
            case 3: // buy
                setPayment(payment => { return (payment - query)});
                final = payment - query;
                setMessages((m) => [...m, { msg: `Your expected price is $${Math.round(final)}`, author: "Ford Chat", line: true }]);
                //blockQueries.current = false;
                break;
        }
        if (Object.keys(EV).includes(model)) {
            if (EV[model].includes(trim)) {
                //setCalcHeadingText('Place an order?');
                setMessages((m) => [...m, { msg: "Would you like to place an order?", author: "Ford Chat", line: true }]);
                const opts = ['Yes','No'];
                setOptionButtons(<div className='option-buttons'>
                    {opts.map(o => (<button className='button-small' key={o.toString()} value={o} 
                    onClick={() => 
                        {setQuery(o);
                            setMessages((m) => [...m, { msg: o, author: "You" }]);
                            setOptionButtons([]);}}>{o}</button>))}
                    </div>);
                //setShowCalcButtons(true);
                blockQueries.current = false;
                setCalcStep(5);
                break;
            }
            else {
                //setCalcHeadingText('Send a request?');
                setMessages((m) => [...m, { msg: "Would you like to send a request to the dealer?", author: "Ford Chat", line: true }]);
                const opts = ['Yes','No'];
                setOptionButtons(<div className='option-buttons'>
                    {opts.map(o => (<button className='button-small' key={o.toString()} value={o} 
                    onClick={() => 
                        {setQuery(o);
                            setMessages((m) => [...m, { msg: o, author: "You" }]);
                            setOptionButtons([]);}}>{o}</button>))}
                    </div>);                
                blockQueries.current = false;
                //setShowCalcButtons(true);
                setCalcStep(6);
                break;
            }
        }
        else {
            //setCalcHeadingText('Send a request?');
            setMessages((m) => [...m, { msg: "Would you like to send a request to the dealer?", author: "Ford Chat", line: true }]);
            const opts = ['Yes','No'];
            setOptionButtons(<div className='option-buttons'>
                {opts.map(o => (<button className='button-small' key={o.toString()} value={o} 
                onClick={() => 
                    {setQuery(o);
                        setMessages((m) => [...m, { msg: o, author: "You" }]);
                        setOptionButtons([]);}}>{o}</button>))}
                </div>);            
            blockQueries.current = false;
            //setShowCalcButtons(true);
            setCalcStep(6);
            break;
        }
    case 5:
        switch(query) {
            case 'Yes':
                //setCalcHeadingText('Delivery or pickup?');
                setMessages((m) => [...m, { msg: "Would you like car delivery or pickup?", author: "Ford Chat", line: true }]);
                const opts = ['Delivery','Pickup'];
                setOptionButtons(<div className='option-buttons'>
                    {opts.map(o => (<button className='button-small' key={o.toString()} value={o} 
                    onClick={() => 
                        {setQuery(o);
                            setMessages((m) => [...m, { msg: o, author: "You" }]);
                            setOptionButtons([]);}}>{o}</button>))}
                    </div>);                
                //setShowCalcButtons(true);
                setCalcStep(6);
                blockQueries.current = false;
                break;
            case 'No':
                setCalcStep(0);
                blockQueries.current = false;
                //setMenuButtons(origButtons);
                break;
        }
        break;
    case 6:
        switch(query) {
            case 'Delivery':
                setMessages((m) => [...m, { msg: "Please enter your delivery address:", author: "Ford Chat", line: true }]);
                blockQueries.current = false;
                setCalcStep(7);
                break;
            case 'Pickup':
                setMessages((m) => [...m, { msg: "You will now be directed to the dealership finder", author: "Ford Chat", line: true }]);
                setMessages((m) => [...m, { msg: "Please enter your zipcode below:", author: "Ford Chat", line:true,zip:{} }]);
                blockQueries.current = false;
                changeChoice('B');
                //handleUserInput('B');
                setCalcStep(0);
                break;                
            case 'Yes':
                setMessages((m) => [...m, { msg: "You will now be directed to the dealership finder", author: "Ford Chat", line: true }]);
                setMessages((m) => [...m, { msg: "Please enter your zipcode below:", author: "Ford Chat", line:true,zip:{} }]);
                blockQueries.current = false;
                changeChoice('B');
                //handleUserInput('B');
                setCalcStep(0);
                break;
            case 'No':
                setCalcStep(0);
                //setMenuButtons(origButtons);
                blockQueries.current = false;
                break;
        }
        break;
    case 7:
        setMessages((m) => [...m, { msg: "Please enter your email address:", author: "Ford Chat", line: true }]);
        blockQueries.current = false;
        setCalcStep(8);
        break;
    case 8:
        setMessages((m) => [...m, { msg: "Thank you! We will process your request and send you a confirmation email shortly.", author: "Ford Chat", line: true }]);
        blockQueries.current = false;
        setCalcStep(0);
        //setMenuButtons(origButtons);
        break;
    }
  }