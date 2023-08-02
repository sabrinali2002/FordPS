import images from '../images/image_link.json';
import { useState } from 'react';
import { BiRegistered } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import '../styles/App.css';

export default function DeliveryRegistration({model,trim,setMenuButtons,origButtons,setMessages}) {
    const [requestSent1, setRequestSent1] = useState(false);
    const [address, setAddress] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [numError, setNumError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [show, setShow] = useState(true);
    console.log(show);
    if (model === '') {
        return;
    }
    const handleRequest = () => {
        let errors = 0;
        let num = phoneNumber.replaceAll('-','').replaceAll('/','').replaceAll('(','').replaceAll(')','');
        const regex = /^\d{10}$/;   
        setNameError('');
        setEmailError('');
        setNumError('');
        setAddressError('');
        if (name == '') {
          setNameError("Please enter a name");
          errors = errors + 1;
        }
        if (address == '') {
            setAddressError("Please enter an address");
            errors = errors + 1;
        }
        if (!email.includes('@')) {
          setEmailError("Please enter a valid email");
          errors = errors + 1;
        }
        if (!regex.test(num)) {
          setNumError("Please enter a valid phone number");
          errors = errors + 1;
        }
        if (errors == 0) {
          setRequestSent1(true);
          setName('');
          setAddress('');
          setEmail('');
          setPhoneNumber('');
          //setMessages((m) => [...m, { msg: "Is there anything else I can help you with?", author: "Ford Chat", line: true }]);
          setMenuButtons(origButtons);
        }
      }

      const onExit = () => {
        setRequestSent1(false);
        setNumError('');
        setNameError('');
        setEmailError('');
        setAddressError('');
        setShow(false);
        //setMessages((m) => [...m, { msg: "Is there anything else I can help you with?", author: "Ford Chat", line: true }]);
        setMenuButtons(origButtons);
      };

    return (show && (<div style={{width:'50%'}}>
         <div className='dealer-window5'>
        <button className='close-button' onClick={onExit}>
            <span style={{position:'relative',right:'6px',bottom:'0px'}}><IoMdClose/></span>
        </button>
        <span style={{fontWeight:'bold',fontSize:'22px',color:'#322964'}}>
            {requestSent1 ? "Your request has been sent" : "Send a request"}</span><br/>
        <div style={{display: "flex",flexDirection: "row",justifyContent: "start",marginBottom:10}}>
        <div style={{display: "flex",flexDirection: "column",marginRight:50,justifyContent: "start",
            alignItems: "start",width:'100%',marginLeft: 10,}}>
            <div style={{fontWeight: 500,color: "#00095B",fontSize:18,alignSelf: "start",textAlign: "start"}}>
            Customer Information
            </div>
            <a
            style={{ marginBottom: 10, color: "#575757", fontWeight: 100, fontSize:11}}
            href="https://www.example.com"
            target="_blank"
            rel="noopener noreferrer">
            Or login/create a Ford account{" "}
            </a>
            <input
            onChange={e => {setName(e.target.value);
                            setNameError('');}}
            style={{color:requestSent1 ? 'gray' : 'black',backgroundColor: "white",borderRadius: 5,width: '100%',height: 30,border: "none",
                marginBottom: 10,boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize: 15,paddingLeft: 5}}
            placeholder=" Name*"/>
            {nameError != '' && <span style={{fontSize:'10px',color:'black',padding:'0px',marginTop:'-6px'}}>{nameError}</span>}
            <input
            onChange={e => {setEmail(e.target.value);
                            setEmailError('');}}
            style={{color:requestSent1 ? 'gray' : 'black',backgroundColor:"white",borderRadius:5,width:'100%',height:30,border: "none",
                marginBottom: 10,boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize:15,paddingLeft:5}}
            placeholder=" Email*"/>
            {emailError != '' && <span style={{fontSize:'10px',color:'black',padding:'0px',marginTop:'-6px'}}>{emailError}</span>}
            <input
            onChange={e => {setPhoneNumber(e.target.value);
                            setNumError('');}}
            style={{color:requestSent1 ? 'gray' : 'black',backgroundColor:"white",borderRadius:5,width:'100%',height: 30,border: "none",
                marginBottom: 10,boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize:15,paddingLeft:5}}
            placeholder=" Phone number*"/>
            {numError != '' && <span style={{fontSize:'10px',color:'black',padding:'0px',marginTop:'-6px'}}>{numError}</span>}
            <input
            onChange={e => {setAddress(e.target.value);
                            setAddressError('');}}
            style={{color:requestSent1 ? 'gray' : 'black',backgroundColor:"white",borderRadius:5,width:'100%',height:30,border: "none",
                marginBottom: 10,boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize:15,paddingLeft:5}}
            placeholder=" Address*"/>
            {addressError != '' && <span style={{fontSize:'10px',color:'black',padding:'0px',marginTop:'-6px'}}>{addressError}</span>}
            <input
            style={{color:requestSent1 ? 'gray' : 'black',backgroundColor:"white",borderRadius:5,width:'100%',height:30,border: "none",marginBottom: 10,
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize:15,paddingLeft:5,marginBottom:10}}
            placeholder=" Notes/Requests"/>
        </div>
        <div
            style={{alignItems: "start",display: "flex",flexDirection: "column",width: "100%"}}>
            <div
            style={{fontWeight: 500,color: "#00095B",fontSize: 18,alignSelf:"start",textAlign: "start",marginBottom:'10px',marginTop:'10px'}}>
            Car to be delivered:
            </div>
            <div className='model-button-sched'>
            <img src={images[model][trim]} style={{width:'100%',height:'auto'}}></img>
            <span style={{fontSize:'11px',color:'#322964',paddingRight:'5px',lineHeight:.5}}>2023 Ford {model}<BiRegistered/> {trim}</span>
            </div>
            <button
            onClick={handleRequest}
            style={{color: "white",backgroundColor: "#322964",border: "none",borderRadius: 10,
                paddingHorizontal: "10px",padding: 2,marginTop: 10,
                fontSize: 16,width: '60%',cursor: 'pointer'}}>
            {requestSent1 ? "Request sent" : "Send request"}
            </button>
        </div>
        </div>
        </div>
        </div>));
}