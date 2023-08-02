import electric from '../../jsons/EV.json';
import trims from '../../jsons/trims.json';
import images from '../../images/image_link.json';
import { BiRegistered } from 'react-icons/bi';
import handlePaymentFlow from './handlePaymentFlow.js';
import carPrices from '../../jsons/carPrices.json';
import { useState } from 'react';
import { MdSpeakerPhone } from 'react-icons/md';

export default function handlePriceFlow(vehicleMode,priceMode,setPriceMode,EV,priceStep,setPriceStep, model, setModel, query, setQuery, setMessages, setMenuButtons, setCalcButtons, blockQueries, setCalcStep, trim, setTrim, setLeaseStep1, setFinanceStep1, leaseStep1, financeStep1, changeChoice, setShowCalcButtons, setCalcHeadingText, payment, setPayment, origButtons, setOptionButtons,setPriceSummary,setShowPriceSummary,dura,setDura,down,setDown,forceUpdate,setForceUpdate) {
    const mosToAPR = { 36: .009, 48: .019, 60: .029, 72: .049, 84: .069 };
    const proceedClick = () => {
        setPriceStep(3);
        setQuery('Proceed');
        setMessages((m) => [...m, { msg: 'Proceed', author: "You" }]);
        setOptionButtons([]);
    };
    const newClick = () => {
        setQuery('Choose a new vehicle');
        setMessages((m) => [...m, { msg: 'Choose a new vehicle', author: "You" }]);
        setOptionButtons([]);
        setModel('');
        setTrim('');
        setPriceStep(1);
    };
    switch(priceStep) {
        case 1: // model
            if (model !== '') {
                setMessages((m) => [...m, { msg: `What would you like to proceed with the 2024 ${model} ${trim} or select a new vehicle?`, author: "Ford Chat", line: true, zip: {} }]);
                let opts0 = ['Proceed','Choose a new vehicle'];
                setOptionButtons(<div className='option-buttons'>
                {opts0.map(option => (<button className='button-small' key={option} value={option} 
                    onClick={option==='Proceed'?proceedClick:newClick}>{option}</button>))}</div>);
                blockQueries.current = false;
                break;
            }
            setMessages((m) => [...m, { msg: "What model are you interested in?", author: "Ford Chat", line: true, zip: {} }]);
            setShowCalcButtons(true);
            setCalcHeadingText("Choose specific model");
            if (vehicleMode == 'electric') {
                setCalcButtons(Object.keys(electric).map(model => (electric[model].length !== 0 && 
                    <button
                        className="model-button"
                        key={model}
                        value={model}
                        onClick={() => {setQuery(model);
                            setModel(model);
                            setMessages((m) => [...m, { msg: model, author: "You" }]);
                            setCalcButtons([]);
                            setShowCalcButtons(false);
                            }}>
                        <img style={{ width: "160px", height: "auto" }} src={images["Default"][model]} alt='' />
                        <br />{model}<BiRegistered /></button>)));
            }       
            else {
                setCalcButtons(Object.keys(trims).map(model => (electric[model].length < trims[model].length && 
                    <button
                        className="model-button"
                        key={model}
                        value={model}
                        onClick={() => {setQuery(model);
                            setModel(model);
                            setMessages((m) => [...m, { msg: model, author: "You" }]);
                            setCalcButtons([]);
                            setShowCalcButtons(false);
                            }}>
                        <img style={{ width: "160px", height: "auto" }} src={images["Default"][model]} alt='' />
                        <br />{model}<BiRegistered /></button>)));
            }     
            setPriceStep(2);
            blockQueries.current = false;
            break;
        case 2: //trim 
            setCalcHeadingText("Choose specific trim");
            setMessages((m) => [...m, { msg: "What trim are you interested in?", author: "Ford Chat", line: true, zip: {} }]);
            setShowCalcButtons(true);
            if (vehicleMode == 'electric') {
                setCalcButtons(electric[model].map(trim => 
                (<button className='model-button' key={trim} value={trim} onClick={() => 
                    {setQuery(trim);
                        setTrim(trim);
                        setMessages((m) => [...m, { msg: trim, author: "You" }]);
                        setCalcButtons([]);
                        setShowCalcButtons(false);}}>
                            <img style={{ width: "160px", height: "auto" }} src={images[model][trim]} />
                        <br/>{trim}</button>)
                ));
            }
            else {
                setCalcButtons(trims[model].map(trim => (!electric[model].includes(trim) &&
                <button className='model-button' key={trim} value={trim} onClick={() => 
                    {setQuery(trim);
                        setTrim(trim);
                        setMessages((m) => [...m, { msg: trim, author: "You" }]);
                        setCalcButtons([]);
                        setShowCalcButtons(false);}}>
                            <img style={{ width: "160px", height: "auto" }} src={images[model][trim]} />
                        <br/>{trim}</button>)
                ));     
            }
            blockQueries.current = false;
            setPriceStep(3);
            break;
        case 3: //lease,finance,buy
            if (trim === '') {
                setTrim(query);
            }
            const options = ['Lease', 'Finance', 'Buy'];
            setMessages((m) => [...m, { msg: "Would you like to lease, finance, or buy?", author: "Ford Chat", line: true, zip: {} }]);
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
                        setMessages((m) => [...m, { msg: "Please enter your down payment (enter 0 for none)", author: "Ford Chat", line: true}]);
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
                            if (isNaN(query)) {
                                setMessages((m) => [...m, { msg: "Please enter a numeric value", author: "Ford Chat", line: true }]);
                                blockQueries.current = false;
                                break;
                            } 
                            setDown(query);
                            setPayment(payment => {return (payment - query)});
                            setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true}]);
                            blockQueries.current = false;
                            setLeaseStep1(2);
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
                                        setDura(dur);
                                        setMessages((m) => [...m, { msg: `${dur.toString()} months`, author: "You" }]);
                                        setOptionButtons([]);}}>{dur.toString()}</button>))}
                            </div>);
                            blockQueries.current = false;
                            setLeaseStep1(3);
                            break;
                        case 3: // miles
                            setPayment(payment => {return Math.round(payment/(query*2))});
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
                            if (isNaN(query)) {
                                setMessages((m) => [...m, { msg: "Please enter a numeric value", author: "Ford Chat", line: true }]);
                                blockQueries.current = false;
                                break;
                            } 
                            setDown(query);
                            setPayment(payment => {return (payment - query)});
                            setMessages((m) => [...m, { msg: "Please enter your trade-in value (enter 0 for none)", author: "Ford Chat", line: true }]);
                            setFinanceStep1(2);
                            blockQueries.current = false;
                            break;
                        case 2: // months
                            if (isNaN(query)) {
                                setMessages((m) => [...m, { msg: "Please enter a numeric value", author: "Ford Chat", line: true }]);
                                blockQueries.current = false;
                                break;
                            } 
                            setPayment(payment => {return (payment - query)});
                            let durations = [36, 48, 60, 72, 84];
                            setMessages((m) => [...m, { msg: "Please select your desired loan duration, in months", author: "Ford Chat", line: true, zip:"" }]);
                            setOptionButtons(<div className='option-buttons'>
                                {durations.map(dur => (<button className='button-small' key={dur.toString()} value={dur} 
                                onClick={() => 
                                    {setQuery(dur.toString());
                                        setDura(dur);
                                        setPayment(payment => {return Math.round(((mosToAPR[dur]/12)*payment)/(1-((1+(mosToAPR[dur]/12))**(0-dur))))});
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
            let apr = 0;
            switch (priceMode) {
                case 1: // lease
                    if (isNaN(query)) {
                        setMessages((m) => [...m, { msg: "Please enter a numeric value", author: "Ford Chat", line: true }]);
                        blockQueries.current = false;
                        break;
                    }
                    apr = mosToAPR[dura];
                    //setMessages((m) => [...m, { msg: `Here is the pricing estimation for ${model} ${trim}`, author: "Ford Chat", line: true}]);
                    break;
                case 2: // finance 
                    apr = mosToAPR[dura];
                    //setMessages((m) => [...m, { msg: `Here is the pricing estimation for ${model} ${trim}`, author: "Ford Chat", line: true }]);
                    break;
                case 3: // buy
                    if (isNaN(query)) {
                        setMessages((m) => [...m, { msg: "Please enter a numeric value", author: "Ford Chat", line: true }]);
                        blockQueries.current = false;
                        break;
                    }
                    setPayment(payment => { return (payment - query)});
                    //setMessages((m) => [...m, { msg: `Here is the pricing estimation for ${model} ${trim}`, author: "Ford Chat", line: true }]);
                    break;
            }
            if ((priceMode===3 || priceMode===1) && isNaN(query)) {
                break;
            }
            let buttons = ['Lease','Finance','Buy'];
            let percentdown = 100*down/carPrices[model][trim];
            percentdown = percentdown.toFixed(2);
            apr = (apr*100).toFixed(2);
            let text = '';
            switch(vehicleMode) {
                case "electric":
                    text = (<div>
                        <span style={{fontSize:'22px'}}>2023 <span style={{fontWeight:'bold'}}>{model}<BiRegistered/> {trim}<BiRegistered/></span> model</span><br/>
                        <div style={{display:'flex',flexDirection:'x',justifyContent:'center'}}>{buttons.map(val => 
                            <button key={val} style={{backgroundColor: buttons.indexOf(val)+1 == priceMode ? 'rgb(208,208,208)' : 'white',
                                borderRadius:'10px',textAlign:'center',width:'120px',height:'50px',margin:'10px',boxShadow: '1px 2px 1px rgba(95, 112, 133, 0.5)'
                            }}>{val}</button>)}
                        </div>
                        <div style={{fontStyle:'bold',font:'15px',paddingLeft:'10px',marginTop:'10px'}}>
                            {priceMode == 1 && <span>Estimated lease payment: </span>}
                            {priceMode == 2 && <span>Estimated loan payment: </span>}
                            {priceMode == 3 && <span>Estimated purchase price: </span>}
                            <span style={{fontWeight:'bold',fontSize:'15px',paddingLeft:'70px'}}>
                            {`$${payment}`}</span>
                        {priceMode < 3 && `/mo`}
                        </div>
                        <div style={{fontSize:'13px',paddingLeft:'10px'}}>
                            {priceMode == 1 && <div>{`$${down} (${percentdown}%) down, ${apr}% APR, ${dura} months`}</div>}
                            {priceMode == 2 && <div>{`$${down} (${percentdown}%) down, ${apr}% APR, ${dura} months`}</div>}
                            <span style={{fontSize:'10px'}}>
                                Excludes other taxes & fees<br/>
                                Electronic payments required<br/>
                                Subject to credit approval<br/>                                
                            </span>
  
                        </div>
                        </div>);
                case "combustion":
                    let msrp = Math.round(payment);
                    let avg = msrp+Math.round(4000*Math.random());
                    let retail = Math.round((avg+msrp)/2); 
                    text = (<div>
                        <span style={{fontSize:'22px'}}>2023 <span style={{fontWeight:'bold'}}>{model}<BiRegistered/> {trim}<BiRegistered/></span> model</span><br/>
                        <div style={{display:'flex',flexDirection:'x',justifyContent:'center'}}>{buttons.map(val => 
                            <button key={val} style={{backgroundColor: buttons.indexOf(val)+1 == priceMode ? 'rgb(208,208,208)' : 'white',
                                borderRadius:'10px',textAlign:'center',width:'120px',height:'50px',margin:'10px',boxShadow: '1px 2px 1px rgba(95, 112, 133, 0.5)'
                            }}>{val}</button>)}
                        </div>
                        <div style={{fontStyle:'bold',paddingLeft:'10px',marginTop:'7px',fontSize:'15px',lineHeight:1.3}}>
                            {priceMode == 1 && <span>Estimated lease payment: <span style={{fontWeight:'bold'}}>${msrp}</span> </span>}
                            {priceMode == 2 && <span>Estimated loan payment: <span style={{fontWeight:'bold'}}>${msrp}</span></span>}
                            {priceMode == 3 && <span>
                                MSRP: <span style={{fontWeight:'bold'}}>${msrp}</span><br/>
                                Market average: <span style={{fontWeight:'bold'}}>${avg}</span> <br/> 
                                Suggested retail price: <span style={{fontWeight:'bold'}}>${retail}{priceMode < 3 && `/mo`}</span> <br/></span>}
                        
                        </div>
                        <div style={{fontSize:'13px',paddingLeft:'10px'}}>
                            {priceMode == 1 && <div>{`$${down} (${percentdown}%) down, ${apr}% APR, ${dura} months`}</div>}
                            {priceMode == 2 && <div>{`$${down} (${percentdown}%) down, ${apr}% APR, ${dura} months`}</div>}
                            <span style={{marginTop:'6px',fontSize:'10px'}}>
                            Excludes other taxes & fees<br/>
                            Electronic payments required<br/>
                            Subject to credit approval<br/>                                
                            </span>
                        </div>
                    </div>)
            }
            setShowPriceSummary(true);
            setPriceSummary(text);
            switch(vehicleMode) {
                case "electric":
                    setMessages((m) => [...m, { msg: "Would you like to purchase this car?", author: "Ford Chat", line: true, zip: {} }]);
                    let opts = ['Yes, contact a dealer','No'];
                    setOptionButtons(<div className='option-buttons'>
                        {opts.map(o => (<button className='button-small' key={o.toString()} value={o} 
                        onClick={() => 
                            {setQuery(o);
                                setMessages((m) => [...m, { msg: o, author: "You" }]);
                                setOptionButtons([]);}}>{o}</button>))}
                        </div>);
                    blockQueries.current = false;
                    setPriceStep(6);
                    break;
                case "combustion":
                    setMessages((m) => [...m, { msg: "Based on these prices, would you like to contact a dealer to find availability?", author: "Ford Chat", line: true, zip: {} }]);
                    let opts1 = ['Yes, contact a dealer','No'];
                    setOptionButtons(<div className='option-buttons'>
                        {opts1.map(o => (<button className='button-small' key={o.toString()} value={o} 
                        onClick={() => 
                            {setQuery(o);
                                setMessages((m) => [...m, { msg: o, author: "You" }]);
                                setOptionButtons([]);}}>{o}</button>))}
                        </div>);                
                    blockQueries.current = false;
                    setPriceStep(6);
                    break;
            }
            break;
        case 6:
            switch(query) {
                case 'Yes, contact a dealer':
                    setPriceSummary('');
                    setShowPriceSummary(false);
                    setMessages((m) => [...m, { msg: "Would you like pickup or delivery?", author: "Ford Chat", line: true, zip: {} }]);
                    let opts2 = ['Pickup','Delivery'];
                    setOptionButtons(<div className='option-buttons'>
                        {opts2.map(o => (<button className='button-small' key={o.toString()} value={o} 
                        onClick={() => 
                            {setQuery(o);
                                setMessages((m) => [...m, { msg: o, author: "You" }]);
                                setOptionButtons([]);}}>{o}</button>))}
                        </div>);  
                    blockQueries.current = false;
                    setPriceStep(7);
                    setPriceMode(0);
                    break;
                case 'No':
                    setMessages((m) => [...m, { msg: "Is there anything else I can help you with?", author: "Ford Chat", line: true }]);
                    setPriceSummary('');
                    setShowPriceSummary(false);
                    setMenuButtons(origButtons);
                    setPriceStep(0);
                    setPriceMode(0);
                    blockQueries.current = false;
                    break;
            }
            break;
        case 7:
            switch(query) {
                case 'Pickup':
                    setMessages((m) => [...m, { msg: "Please enter your zipcode to find dealers to send your offer to", author: "Ford Chat", line: true, zip: { requestInfo:true} }]);
                    blockQueries.current = false;
                    setPriceStep(8);
                    break;
                case 'Delivery':
                    setMessages((m) => [...m, { msg: "Please fill in the following form to send your request", author: "Ford Chat...", line: true }]);
                    blockQueries.current = false;
                    setPriceStep(9);
                    break;
            }
            break;
        case 8:
            changeChoice("purchase request");
            blockQueries.current = false;
            setPriceStep(9);
            break;
        case 9:
            setMessages((m) => [...m, { msg: "Is there anything else I can help you with?", author: "Ford Chat", line: true }]);
            setPriceStep(0);
            blockQueries.current = false;
            break;
        }
}