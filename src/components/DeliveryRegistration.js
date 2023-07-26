import images from '../images/image_link.json';
import { useState } from 'react';
import { BiRegistered } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import '../styles/App.css';

export default function DeliveryRegistration({model,trim,setMenuButtons,origButtons}) {
    const [requestSent, setRequestSent] = useState(false);
    const [address, setAddress] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [numError, setNumError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [show, setShow] = useState(true);
    
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
          setRequestSent(true);
          setName('');
          setAddress('');
          setEmail('');
          setPhoneNumber('');
          setMenuButtons(origButtons);
        }
      }

      const onExit = () => {
        setRequestSent(false);
        setNumError('');
        setNameError('');
        setEmailError('');
        setAddressError('');
        setShow(false);
        setMenuButtons(origButtons);
      };

    return (show && (<div style={{alignItems:'flex-start',marginLeft:'50px'}}>
         <div className='dealer-window4'>
        <button className='close-button' onClick={onExit}>
            <span style={{position:'relative',right:'6px',top:'0px'}}><IoMdClose/></span>
        </button>
        <span style={{fontWeight:'bold',fontSize:'25px',color:'#322964'}}>
            {requestSent ? "Your request has been sent" : "Send a request"}</span><br/>
        <span style={{fontSize:'14px'}}>{requestSent ? "A confirmation email has been sent" : "Please fill out the following fields"}</span>
        <div style={{display: "flex",flexDirection: "row",justifyContent: "start",marginBottom:10}}>
        <div style={{display: "flex",flexDirection: "column",marginRight:50,justifyContent: "start",
            alignItems: "start",marginLeft: 10,}}>
            <div style={{fontWeight: 500,color: "#00095B",fontSize:23,alignSelf: "start",textAlign: "start"}}>
            Customer Information
            </div>
            <a
            style={{ marginBottom: 10, color: "#575757", fontWeight: 100, fontSize:14}}
            href="https://www.example.com"
            target="_blank"
            rel="noopener noreferrer">
            Or login/create a Ford account{" "}
            </a>
            <input
            onChange={e => {setName(e.target.value);
                            setNameError('');}}
            style={{color:requestSent ? 'gray' : 'black',backgroundColor: "white",borderRadius: 5,width: 400,height: 40,border: "none",
                marginBottom: 10,boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize: 18,paddingLeft: 5}}
            placeholder=" Name*"/>
            {nameError != '' && <span style={{fontSize:'10px',color:'black',padding:'0px',marginTop:'-6px'}}>{nameError}</span>}
            <input
            onChange={e => {setEmail(e.target.value);
                            setEmailError('');}}
            style={{color:requestSent ? 'gray' : 'black',backgroundColor: "white",borderRadius: 5,width: 400,height: 40,border: "none",
                marginBottom: 10,boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize: 18,paddingLeft: 5}}
            placeholder=" Email*"/>
            {emailError != '' && <span style={{fontSize:'10px',color:'black',padding:'0px',marginTop:'-6px'}}>{emailError}</span>}
            <input
            onChange={e => {setPhoneNumber(e.target.value);
                            setNumError('');}}
            style={{color:requestSent ? 'gray' : 'black',backgroundColor: "white",borderRadius: 5,width: 400,height: 40,border: "none",
                marginBottom: 10,boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize: 18,paddingLeft: 5}}
            placeholder=" Phone number*"/>
            {numError != '' && <span style={{fontSize:'10px',color:'black',padding:'0px',marginTop:'-6px'}}>{numError}</span>}
            <input
            onChange={e => {setAddress(e.target.value);
                            setAddressError('');}}
            style={{color:requestSent ? 'gray' : 'black',backgroundColor: "white",borderRadius: 5,width: 400,height: 40,border: "none",
                marginBottom: 10,boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize: 18,paddingLeft: 5}}
            placeholder=" Address*"/>
            {addressError != '' && <span style={{fontSize:'10px',color:'black',padding:'0px',marginTop:'-6px'}}>{addressError}</span>}
            <input
            style={{color:requestSent ? 'gray' : 'black',backgroundColor: "white",borderRadius: 5,width: 400,height: 50,border: "none",marginBottom: 10,
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize: 18,paddingLeft: 5,marginBottom: 10}}
            placeholder=" Notes/Requests"/>
        </div>
        <div
            style={{alignItems: "start",display: "flex",flexDirection: "column",width: "100%"}}>
            <div
            style={{fontWeight: 500,color: "#00095B",fontSize: 23,alignSelf:"start",textAlign: "start",marginBottom:'10px',marginTop:'10px'}}>
            Car to be delivered:
            </div>
            <div style={{width:'200px',height:'150px',backgroundColor:'white',boxShadow:'1px 4px 2px rgba(0, 0, 0, 0.5)',
                borderRadius:'10px',wordWrap:'wrap',overflowWrap:'wrap',textAlign:'center'}}>
            <img src={images[model][trim]} style={{width:'250px',height:'auto',paddingRight:58}}></img>
            <span style={{fontSize:'11px',color:'#322964',paddingRight:'5px',lineHeight:'0px'}}>2023 Ford {model}<BiRegistered/> {trim}</span>
            </div>
            <button
            onClick={handleRequest}
            style={{
                marginTop: 0,color: "white",backgroundColor: "#322964",border: "none",borderRadius: 10,
                paddingHorizontal: "10px",paddingTop: 5,paddingRight: 10,paddingLeft: 10,marginTop: 26,
                fontSize: 18,width: 200,marginBottom: 10,cursor: 'pointer'}}>
            {requestSent ? "Request sent" : "Send request"}
            </button>
        </div>
        </div>
        </div>
        </div>));
}