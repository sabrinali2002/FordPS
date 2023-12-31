import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import data from "../jsons/zipLocations.json";
import "./Map.css";
import TestDriveScheduler from "./TestDriveScheduler";
import dealerToTrim from "../jsons/dealerToTrim.json";
import info from "../jsons/dealerInfo.json";
import { FaLocationArrow } from "react-icons/fa";
import { BsTelephoneFill, BsLink } from "react-icons/bs";
import {
  AiFillClockCircle,
  AiFillStar,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { FiLink2 } from "react-icons/fi";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { BiRegistered } from "react-icons/bi";
import images from "../images/image_link.json";
import { FaMapMarked } from "react-icons/fa";
import SchedDisp from "./scheduleComponents/SchedDisp";
import { setDate } from "date-fns";
import Sched1 from "./scheduleComponents/sched1";
import Sched3 from "./scheduleComponents/sched3";

//import { scheduler } from "timers/promises";

function Map({
  zip,
  dist,
  loc,
  deal,
  coords,
  maintenanceMode = "",
  selectedModel = "Bronco",
  selectedTrim = "Base",
  requestInfo,
  setRequestSent,
  setMenuButtons,
  origButtons,
  setMessages,
  changeChoice,
  setQuery,
  setSchedSent,
  setChatGap
}) {
  const [latlong, changeLatLong] = useState([39, -98]);
  const [locations, changeLocations] = useState([]);
  const [isSchedulerVisible, setIsSchedulerVisible] = useState(false);
  const [pickedLoc, setPickedLoc] = useState("");
  const [showWindow, setShowWindow] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupPos, setPopupPos] = useState([]);
  const [blockPopup, setBlockPopup] = useState(false);
  const [window1Content, setWindow1Content] = useState([]);
  const [window2Content, setWindow2Content] = useState([]);
  const [window3Content, setWindow3Content] = useState([]);
  const [dealer1, setDealer1] = useState("");
  const [phone1, setPhone1] = useState("");
  const [link1, setLink1] = useState("");
  const [hour1, setHours1] = useState("");
  const [address1, setAddress1] = useState("");
  const [isScheduler2Visible, setIsScheduler2Visible] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [vis2, setVis2] = useState(false);
  const [vis3, setVis3] = useState(false);
  const [window4Content, setWindow4Content] = useState("");
  const [showRequestInfo, setShowRequestInfo] = useState(requestInfo);
  const [address, setAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [numError, setNumError] = useState("");
  const [requestSent1, setRequestSent1] = useState(false);
  const [model1,setModel1] = useState('');
  const [trim1, setTrim1] = useState('');

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
  
  const customMarkerIcon = L.icon({
    iconUrl: "https://www.freeiconspng.com/thumbs/pin-png/pin-png-28.png",
    iconSize: [20, 20], // Adjust the icon size if necessary
  });

  const goToMap = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps?q=${encodedAddress}`;
    window.open(mapsUrl, "_blank"); // Open the Google Maps link in a new tab/window
  };

  const popupHoverOff = () => {
    setShowPopup(false);
    setPopupText("");
    setBlockPopup(false);
  };

  const openScheduler = (dealer, maintenanceMode) => {
    setIsSchedulerVisible(true);
    setShowWindow(false);
    setPickedLoc(dealer);
  };

  const returnCars = (dealer, n) => {
    const similar = {
      Bronco: "Bronco Sport",
      "Bronco Sport": "Bronco",
      "E-Transit Cargo Van": "Transit Cargo Van",
      "Transit Cargo Van": "E-Transit Cargo Van",
      Edge: "Escape",
      Escape: "Edge",
      Explorer: "Expedition",
      Expedition: "Explorer",
      "F-150": "F-150 Lightning",
      "Mustang Mach-E": "Edge",
      Ranger: "F-150",
      "Transit Cargo Van": "Transit Connect Cargo Van",
      "Transit Connect Cargo Van": "Transit Cargo Van",
      "Transit Passenger Van": "Transit Crew Van",
      "Transit Crew Van": "Transit Passenger Van",
    };
    let models = [];
    if (selectedModel !== "" && selectedTrim !== "") {
      console.log(1);
      // know model & trim
      if (
        Object.values(dealerToTrim[dealer][selectedModel]).includes(
          selectedTrim
        )
      ) {
        models.push([selectedModel, selectedTrim]);
        for (let trims of dealerToTrim[dealer][selectedModel]) {
          if (trims != selectedTrim && selectedModel !== 'E-Transit Cargo Van' && selectedModel !== 'Transit Cargo Van') {
            models.push([selectedModel, trims]);
            break;
          }
        }
      } else {
        // trim unavailable
        for (let trims of dealerToTrim[dealer][selectedModel]) {
          if (models.length < n && selectedModel !== 'E-Transit Cargo Van' && selectedModel !== 'Transit Cargo Van') {
            models.push([selectedModel, trims]);
          }
        }
        let sim = similar[selectedModel];
        let i = 0;
        while (models.length < n) {
          // not enough trims of model
          if (sim == 'E-Transit Cargo Van' || sim == 'Transit Cargo Van') {
            break;
          }
          else if (i >= dealerToTrim[dealer][sim].length) {
            break;
          }
          else if (sim !== 'E-Transit Cargo Van' && sim !== 'Transit Cargo Van') {
            models.push([sim, dealerToTrim[dealer][sim][i]]);
            i = i + 1; 
          } 
          else {
            break;       
          }
          // append trims of similar model
        }
      }
    } else if (selectedModel !== "") {
      console.log(2);
      let sim = similar[selectedModel];
      // know model, not trim
      for (let trims of dealerToTrim[dealer][selectedModel]) {
        if (models.length < n && selectedModel !== 'E-Transit Cargo Van' && selectedModel !== 'Transit Cargo Van') {
          models.push([selectedModel, trims]);
        }
      }
      let j = 0;
      while (models.length < n) {
        // not enough trims of model
        if (sim == 'E-Transit Cargo Van' || sim == 'Transit Cargo Van') {
          break;
        }
        else if (j >= dealerToTrim[dealer][sim].length) {
          break;
        }
        else if (sim !== 'E-Transit Cargo Van' && sim !== 'Transit Cargo Van') {
          models.push([sim, dealerToTrim[dealer][sim][j]]);
          j = j + 1; 
        } 
        else {
          break;       
        }
      }
    } else {
      // know neither
      for (let currmodel of Object.keys(dealerToTrim[dealer])) {
        if (models.length < n) {
          if (dealerToTrim[dealer][currmodel].length != 0 && currmodel !== 'E-Transit Cargo Van' && currmodel != 'Transit Cargo Van') {
            models.push([currmodel, dealerToTrim[dealer][currmodel][0]]);
          } else {
            continue;
          }
        }
      }
    }
    return models;
  };

  const returnAppts = (n) => {
    let today = new Date();
    let currHr = today.getHours();
    let currMonth = today.getMonth() + 1;
    let currDay = today.getDate();
    let currTime = currHr;
    let currMin = today.getMinutes();
    if (currMin < 30) {
      currMin = 3;
    }
    else if (currMin < 60) {
      currMin = 0;
      currTime = currHr + 1;
    }
    if (currHr < 8) {
      currTime = 8;
    } else if (currHr >= 20) {
      currTime = 8;
      currDay = currDay + 1;
    }
    let appts = [];
    for (let i = 0; i < n; i++) {
      let day = new Date("2023", today.getMonth(), currDay).getDay();
      let dayOfWeek = new Date(
        Date.UTC(2023, today.getMonth(), day)
      ).toLocaleString("en-US", { weekday: "long" });
      let useTime = currTime;
      let ending = "am";
      if (currTime > 12) {
        useTime = currTime - 12;
        ending = "pm";
      }
      if (currTime == 12) {
        ending = "pm";
      }
      appts.push([
        `${dayOfWeek} ${currMonth}/${currDay}`,
        `${useTime.toString()}:${currMin.toString()}0${ending}`,
      ]);
      if (currMin == 3) {
        currTime = currTime + 1;
        currMin = 0;
      } else {
        currMin = 3;
      }
      if (currTime > 20) {
        currTime = 8;
        currMin = 0;
      }
    }
    return appts;
  };

  const handleRequest = () => {
    let errors = 0;
    let num = phoneNumber
      .replaceAll("-", "")
      .replaceAll("/", "")
      .replaceAll("(", "")
      .replaceAll(")", "");
    const regex = /^\d{10}$/;
    setNameError("");
    setEmailError("");
    setNumError("");
    if (name === "") {
      setNameError("Please enter a name");
      errors = errors + 1;
    }
    if (email.split("@").length!==2 || email.split("@")[1].split(".").length!==2) {
      setEmailError("Please enter a valid email");
      errors = errors + 1;
    }
    if (!regex.test(num)) {
      setNumError("Please enter a valid phone number");
      errors = errors + 1;
    }
    if (errors == 0) {
      setRequestSent1(true);
      setRequestSent(true);
      setName("");
      setEmail("");
      setPhoneNumber("");
      setMessages((m) => [
        ...m,
        {
          msg: "Is there anything else I can help you with?",
          author: "Ford Chat",
          line: true,
          zip: { requestSent: true },
        },
      ]);
      setMenuButtons(origButtons);
      setChatGap(true);
      return;
    }
  };

  const markerHoverOver = (d) => {
    if (blockPopup) {
      return;
    }
    let dealer = d[0];
    let models = returnCars(dealer, 2);
    if (models.length == 0) {
      models = [["Bronco","Base"],["Explorer","Base"]];
    }
    console.log(models);
    let addr = info[dealer]["address"];
    let phone = info[dealer]["number"];
    let rating = info[dealer]["rating"];
    if (rating == "") {
      rating = "4";
    }
    let link = `www.${dealer
      .replaceAll(" ", "")
      .replaceAll("'", "")
      .replaceAll(",", "")
      .replaceAll(".", "")
      .toLowerCase()}.com`;
    let today = new Date();
    let currHr = today.getHours();
    let hrStr = "Open - closes at 8pm";
    if (currHr > 20 || currHr < 8) {
      hrStr = "Closed - opens at 8am";
    }
    let appts = returnAppts(4);
    let text = (
      <div className="hover-content">
        <span
          style={{
            color: "#322964",
            paddingTop: "10px",
            fontSize: "22px",
            fontWeight: "bold",
            marginLeft: '15px'
          }}
        >
          {dealer}
        </span>
        <br />
        <div style={{ display:'flex',flexDirection:'column',lineHeight:.4,marginLeft:'15px'}}>
          <div>
            <FaLocationArrow />
            <span style={{ fontSize: "12px", paddingLeft: "8px" }}>{addr}</span>            
          </div>
          <div>
            <BsTelephoneFill />
            <span style={{ fontSize: "12px", paddingLeft: "8px" }}>{phone}</span>
          </div>
          <div>
            <FiLink2 />
            <span style={{ fontSize: "12px", paddingLeft: "8px" }}>{link}</span>            
          </div>
          <div>
            <AiFillStar />
            <span style={{ fontSize: "12px", paddingLeft: "8px" }}>
              {rating + " stars"}
            </span>
          </div>
          <div>
            <AiFillClockCircle />
            <span style={{ fontSize: "12px", paddingLeft: "8px" }}>{hrStr}</span>            
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {maintenanceMode.length == 0 && (
            <span style={{ width: "50%" }}>
              <span
                style={{
                  color: "#322964",
                  fontSize: "12px",
                  textDecoration: "underline",
                }}
              >
                Available models/trims{" "}
              </span>
              <span style={{ paddingLeft: "20px" }}>
                <MdOutlineArrowForwardIos />
              </span>
              <div className="modelprev-container">
                {models.map((model) => (
                  <div className="modelprev-map">
                    <img
                      style={{
                        justifySelf: "center",
                        position: "relative",
                        right: "8px",
                        width: "120%",
                        height: "auto",
                      }}
                      src={images[model[0]][model[1]]}
                    />
                    <div>
                      {model[0]}
                      <BiRegistered />
                      {` ${fixTrimName(model[0],model[1])}`}
                    </div>
                  </div>
                ))}
              </div>
            </span>
          )}
          <span style={{ width: "50%", right: "-40%" }}>
            <span
              style={{
                color: "#322964",
                fontSize: "12px",
                textDecoration: "underline",
                paddingLeft: "10px",
              }}
            >
              Available appointments
            </span>
            <span style={{ paddingLeft: "20px" }}>
              <MdOutlineArrowForwardIos />
            </span>
            <div>
              <div
                style={{
                  display: "flex",
                  marginTop: "1px",
                  alignContent: "left",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {appts.slice(0, 2).map((appt) => (
                    <div className="time-slot-mini">
                      {appt[0]}
                      <br />
                      <span style={{ fontWeight: "bold" }}>{appt[1]}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {appts.slice(2, 4).map((appt) => (
                    <div className="time-slot-mini">
                      {appt[0]}
                      <br />
                      <span style={{ fontWeight: "bold" }}>{appt[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </span>
        </div>
      </div>
    );
    setShowPopup(true);
    setPopupText(text);
    setBlockPopup(true);
    //setShowPopup(false);
  };

  const backButton = () => {
    setIsScheduler2Visible(false);
    setIsSchedulerVisible(false);
    setShowWindow(true);
  };

  const handleAppointment = (name, email, phoneNumber, notes) => {
    alert("called")
    setSchedSent(true);
    console.log("handling");
    setName(name);
    setEmail(email);
    setPhoneNumber(phoneNumber);
    setNotes(notes);
    setVis2(false);
    setVis3(true);
    setIsScheduler2Visible(false);
    changeChoice("");
    setQuery("")
    setMessages((m) => {
      return [
        ...m,
        { msg: "Is there anything else I can help you with?", author: "Ford Chat" },
      ];
    });
    setMenuButtons(origButtons);
    setChatGap(true);
  };

  const showScheduler2 = (event) => {
    setIsScheduler2Visible(true);
    setShowWindow(false);
  };

  const onExit = () => {
    setShowWindow(false);
    setBlockPopup(false);
    setRequestSent1(false);
    setNumError("");
    setNameError("");
    setEmailError("");
  };

  const locClickHandler = (d) => {
    let dealer = d[0];
    setDealer1(dealer);
    let models = returnCars(dealer, 11);
    let url = "https://images.jazelc.com/uploads/robinsford-m2en/Ford_Service.jpeg";
    let addr = info[dealer]["address"];
    let phone = info[dealer]["number"];
    let rating = info[dealer]["rating"];
    if (rating == "") {
      rating = "4";
    }
    let link = `www.${dealer
      .replaceAll(" ", "")
      .replaceAll("'", "")
      .toLowerCase()}.com`;
    let today = new Date();
    let currHr = today.getHours();
    let hrStr = "Open - closes at 8pm";
    if (currHr > 20 || currHr < 8) {
      hrStr = "Closed - opens at 8am";
    }
    let selection = "based on your selection";
    if (selectedModel == "" && selectedTrim == "") {
      selection = "";
    }
    console.log("------")
    let appts = returnAppts(6);
    setShowWindow(true);
    let window1 = (<div className={'dealer-window'+(maintenanceMode.length==0?'1':'3')}>
      <button className='close-button' onClick={onExit}>
        <span style={{position:'relative',right:'6px',bottom:'1px'}}><IoMdClose/></span>
      </button>
      <span style={{color:'#322964',fontSize:'22px',fontWeight:'bold'}}>{dealer}</span>
      <span style={{position: 'absolute', right:'227px'}}><FaMapMarked/></span>
      <span style={{textDecoration:'underline',position:'absolute',fontSize:'18px',right:'60px',cursor:'pointer'}} onClick={() => goToMap(`${dealer}, ${addr}`)}>
        View on Google Maps</span>
      <br/>
      <div style={{display:'flex',flexDirection:'row'}}>
      <span style={{fontSize:'15px',lineHeight:'1.5',position:'relative',left:'4px',top:'5px',width:'65%'}}>
        <FaLocationArrow /><span style={{ paddingLeft: '8px' }}>{addr}</span><br />
        <BsTelephoneFill /><span style={{ paddingLeft: '8px' }}>{phone}</span><br />
        <FiLink2 /><span style={{ paddingLeft: '8px' }}>{link}</span><br />
        <AiFillStar /><span style={{ paddingLeft: '8px' }}>{rating + ' stars'}</span><br />
        <AiFillClockCircle /><span style={{ paddingLeft: '8px' }}>{hrStr}</span><br /></span>
      <img style={{position:'absolute',right:'70px',height:'auto',width:'150px'}} alt='' src={url}/>
      </div>
    </div>
    )
    //{` ${fixTrimName(model[0],model[1])}`}   
    let window2 = maintenanceMode.length==0?(<div className='dealer-window2'>
      <span style={{fontWeight:'bold',fontSize:'18px',color:'#322964'}}>Models & trims available</span>
      <span style={{paddingLeft:'7px',fontSize:'14px'}}>{selection}</span>
      <br/>
      <div className='button-container1'>
          {models.map(model => (<div key={model} className='model-button-scroll' onClick={() =>{
                setModel1(model[0]);
                setTrim1(model[1]);
                setDealer1(dealer);
                setAddress1(addr);
                setPhone1(phone);
                setHours1(hrStr);
                setLink1(link);
                openScheduler(dealer, maintenanceMode);
                }}>
                  <span style={{marginLeft:'-10px'}}>
                    <img style={{width:'120%',height:'auto'}} src={images[model[0]][model[1]]}/>
                  </span>
                  <br/>
                    {model[0]}<BiRegistered/> <br/>
                    <span style={{fontSize:'10px'}}>{model[1]}</span>                          
              </div>))}     
      </div>

    </div>):(<></>)
    let window3 = (<div className={'dealer-window'+(maintenanceMode.length==0?'2':'3')}>
          <span style={{fontWeight:'bold',fontSize:'18px',color:'#322964'}}>Next appointments available</span>
          <span className='view-more' onClick={() => {openScheduler(dealer, maintenanceMode);
                              setDealer1(dealer);
                              setAddress1(addr);
                              setPhone1(phone);
                              setHours1(hrStr);
                              setLink1(link);}}>View more
          <span style={{leftPadding:'5px'}}><MdOutlineArrowForwardIos/></span></span>
          <br/>
          <div style={{display:'flex',marginTop:'5px',marginLeft:'5px',flexDirection:'row',width:'100%'}}>
            <div style={{width:'23%'}}>
            <button className='schedule-button' onClick={() => 
              {openScheduler(dealer, maintenanceMode)
                setDealer1(dealer);
                setAddress1(addr);
                setPhone1(phone);
                setHours1(hrStr);
                setLink1(link);
                }}>Click here to schedule an appointment</button>              
            </div>

            <div style={{width:'77%'}}>
              <div className='timeslot-container'>
                {appts.slice(0,3).map(appt => (<button key={appt[1]} date={appt[0]} time={appt[1]} onClick={
                  () => {showScheduler2();
                        setDealer1(dealer);
                        setDate(appt[0]);
                        setTime(appt[1]);
                        setAddress1(addr);
                        setPhone1(phone);
                        setHours1(hrStr);
                        setLink1(link);
                        }} className='time-slot'>{appt[0]}<br/>
                  <span style={{fontWeight:'bold'}}>{appt[1]}</span></button>))}
              </div>
              <div className='timeslot-container'>
                {appts.slice(3,6).map(appt => (<button key={appt[1]} date={appt[0]} time={appt[1]} onClick={
                  () => {showScheduler2();
                        setDealer1(dealer);
                        setDate(appt[0]);
                        setTime(appt[1]);
                        setAddress1(addr);
                        setPhone1(phone);
                        setHours1(hrStr);
                        setLink1(link);
                        }} className='time-slot'>{appt[0]}<br/>
                  <span style={{fontWeight:'bold'}}>{appt[1]}</span></button>))}
              </div>              
            </div>            
          </div>
      </div>);
    setWindow2Content(window2);
    setWindow3Content(window3);
    setWindow1Content(window1);
    if (requestInfo) {
      window4(dealer);
    }
  };
  useEffect(() => {
    window4(dealer1);
  }, [requestSent1, emailError, nameError, numError, email, name, phoneNumber]);

  const window4 = (dealer) => {
    if (!requestInfo) {
      return;
    }
    let content = (<div className='dealer-window4'>
      <span style={{fontWeight:'bold',fontSize:'22px',color:'#322964'}}>
          {requestSent1 ? "Your request has been sent" : "Send a request"}</span><br/>
        <div
        style={{backgroundColor:"white",width:"100%",height:'30px',color:"#00095B",borderRadius: 5,marginRight:10,
          fontWeight:500,fontSize:18,marginBottom:10,marginTop:5,boxShadow:"0px 2px 4px rgba(0, 0, 0, 0.2)",position:'relative'}}>
            <span style={{position:'absolute',right:'50%'}}>{dealer}</span></div>
      <div style={{display:"flex",flexDirection:"row",justifyContent:"start",marginBottom:10,width:'100%'}}>
        <div style={{display:"flex",flexDirection:"column",marginRight:50,justifyContent:"start",
            alignItems: "start",marginLeft: 10,width:'100%'}}>
          <div style={{fontWeight: 500,color: "#00095B",fontSize:18,alignSelf:"start",textAlign:"start"}}>
            Customer Information
          </div>
          <a
            style={{ marginBottom: 10, color: "#575757", fontWeight: 100, fontSize:11}}
            href="https://www.example.com"
            target="_blank"
            rel="noopener noreferrer"
          >
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
            style={{color:requestSent1 ? 'gray' : 'black',backgroundColor:"white",borderRadius:5,width:'100%',height:30,border:"none",
              marginBottom: 10,boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize: 15,paddingLeft: 5}}
            placeholder=" Email*"/>
            {emailError != '' && <span style={{fontSize:'10px',color:'black',padding:'0px',marginTop:'-6px'}}>{emailError}</span>}
          <input
            onChange={e => {setPhoneNumber(e.target.value);
                            setNumError('');}}
            style={{color:requestSent1 ? 'gray' : 'black',backgroundColor: "white",borderRadius: 5,width: '100%',height: 30,border: "none",
              marginBottom: 10,boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize: 15,paddingLeft: 5}}
            placeholder=" Phone number*"/>
            {numError != '' && <span style={{fontSize:'10px',color:'black',padding:'0px',marginTop:'-6px'}}>{numError}</span>}
          <input
            style={{color:requestSent1 ? 'gray' : 'black',backgroundColor: "white",borderRadius: 5,width: '100%',height: 30,border: "none",marginBottom: 10,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",fontSize: 15,paddingLeft: 5,marginBottom: 10}}
            placeholder=" Notes/Requests"/>
        </div>
        <div
          style={{
            alignItems: "start",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}>
          <div
            style={{fontWeight: 500,color: "#00095B",fontSize: 18,alignSelf:"start",textAlign: "start",marginBottom:'10px',marginTop:'10px'}}>
            Car to be picked up:
          </div>
          <div className='model-button-sched'>
            <img src={images[selectedModel][selectedTrim]} style={{width:'100%',height:'auto'}}></img>
            <span style={{fontSize:'11px',color:'#322964',paddingRight:'5px',lineHeight:.5}}>2023 Ford {selectedModel}<BiRegistered/> {selectedTrim}</span>
          </div>
          <button
            onClick={handleRequest}
            style={{color: "white",backgroundColor: "#322964",border: "none",borderRadius: 10,
              paddingHorizontal: "10px",padding:2,marginTop: 10,
              fontSize: 16,width: '60%',cursor: 'pointer'}}>
            {requestSent1 ? "Request sent" : "Send request"}
          </button>
          </div>
          </div>
      </div>
    );
    setWindow4Content(content);
  };

  const findLocations = async (distance) => {
    const result = await findLatLong(zip);
    const distances = {};
    const l = [result.latitude, result.longitude];
    for (const coords in data) {
      if (deal.size === 0 || deal.has(data[coords].name)) {
        const [lat, lon] = coords.split(" ");
        const address =
          data[coords].address +
          " " +
          data[coords].city +
          " " +
          lat +
          " " +
          lon;
        const dist = calculateDistance(
          l[0],
          l[1],
          parseFloat(lat),
          parseFloat(lon)
        );
        distances[data[coords].name + "----" + address] = dist;
      }
    }
    const sortedLocations = Object.entries(distances).sort(
      (a, b) => a[1] - b[1]
    );
    let count = 0;
    if (distance === -1) {
      count = 3;
    } else {
      while (true) {
        if (sortedLocations[count][1] > distance) {
          break;
        }
        count += 1;
      }
    }
    const closestLocations = sortedLocations.slice(0, count);
    let topLatLongs = [];
    for (let i = 0; i < closestLocations.length; i++) {
      let address = closestLocations[i][0];
      let name = address.split("----")[0];
      let rest = address.split("----")[1];
      let loc = rest.split(" ");
      let lat = loc[loc.length - 2];
      let long = loc[loc.length - 1];
      topLatLongs.push([name, info[name]["address"], lat, long]);
    }
    return topLatLongs;
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = (R * c) / 1.609;
    return distance;
  }
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  const findLatLong = (zip) => {
    const s =
      "https://api.weatherapi.com/v1/current.json?key=c722ececb1094322a31191318231606&q=" +
      zip;
    return fetch(s)
      .then((response) => response.json())

      .then((data) => {
        let latitude = data.location.lat;
        let longitude = data.location.lon;
        const res = { latitude, longitude };
        changeLatLong([res.latitude, res.longitude]);
        return res;
        //{latitude, longitude}
      });
  };
  useEffect(() => {
    async function fetchInfo() {
      if (locations.length === 0) {
        findLatLong(zip).then((res) => {
          findLocations(dist).then((locas) => {
            changeLocations(locas);
            //output the locations [location1, location2, location3, etc.]
          });
        });
      }
    }
    fetchInfo();
  }, [zip, latlong]);
  return (
  <div>
      {(showWindow && requestInfo) && 
          <div style={{width:'50%'}}>
            {window1Content}
            {window4Content}
        </div>
      }
      {(showWindow && !showRequestInfo && !requestInfo) && (<div style={{width:'50%'}}>
          {window1Content}
          {window2Content}
          {window3Content}
        </div>
      )}
      {isSchedulerVisible && (
        <SchedDisp
          dealer={dealer1}
          phone={phone1}
          setPhone={setPhone1}
          address={address1}
          setAddress={setAddress1}
          link={link1}
          setLink={setLink1}
          hours={hour1}
          setHours={setHours1}
          maintenanceMode={maintenanceMode}
          model={model1===''?selectedModel:model1}
          trim={trim1===''?selectedTrim:trim1}
          backButton={backButton}
          setMenuButtons={setMenuButtons}
          setMessages={setMessages}
          origButtons={origButtons}
          setSchedSent={setSchedSent}
          changeChoice={changeChoice}
          setQuery={setQuery}
          setChatGap={setChatGap}
        />
      )}
      {isScheduler2Visible && (
        <Sched1 dealer={dealer1} date={date} time={time} handleAppointment={handleAppointment} 
        maintenanceMode={maintenanceMode}  model={model1===''?selectedModel:model1} trim={trim1===''?selectedTrim:trim1}
          backButton={backButton} phoneNum={phone1} address={address1} link={link1} hours={hour1} />
        )}
      {vis3 && (
        <Sched3
          dealer={dealer1}
          date={date}
          time={time}
          name={name}
          email={email}
          phoneNumber={phoneNumber}
          notes={notes}
          phone={phone1}
          address={address1}
          link={link1}
          hours={hour1}
          maintenanceMode={maintenanceMode}
          model={model1===''?selectedModel:model1}
          trim={trim1===''?selectedTrim:trim1}
        />
      )}
      {!showWindow && !isSchedulerVisible && !isScheduler2Visible && !vis3 && (
        <div
          style={{
            position: "relative",
            backgroundColor: "#113B7A1A",
            width: "70%",
            height: "350px",
            borderRadius: "15px",
            left: "calc(2% + 54px)",
            padding: "25px",
            marginBottom: "15px",
          }}
        >
          <MapContainer
            key={latlong.toString()}
            center={latlong}
            zoom={9}
            style={{
              height: "300px",
              width: "50%", // Increase width to desired value
              display: "flex",
              float: "left",
              marginRight: "20px",
              marginBottom: "0px",
              borderRadius: "15px", // Add this for rounded corners
              overflow: "hidden", // Add this to apply border radius to inner layers
            }}
            id={"map"}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="Map data &copy; OpenStreetMap contributors"
            />
            {locations.map((d) => {
              return (
                <Marker
                  position={[d[2], d[3]]}
                  icon={customMarkerIcon}
                  id={d[0]}
                  eventHandlers={{ mouseover: () => markerHoverOver(d) }}
                />
              );
            })}
          </MapContainer>
          {showPopup && (
            <div
              className="hover-popup"
              onMouseLeave={popupHoverOff}
              style={{ position: popupPos }}
            >
              {popupText}
            </div>
          )}
          <div
            style={{
              marginLeft: "50px",
              alignItems: "center",
              marginTop: "5px",
            }}
          >
            <div
              style={{
                alignItems: "flex-start",
                justifyContent: "flex-start",
                alignContent: "flex-start",
                display: "flex",
                marginBottom: "5px",
                overflowY: "scroll",
              }}
            >
              {dist !== -1 ? (
                <h3
                  style={{
                    marginTop: "0",
                    marginBottom: "4px",
                    fontSize: "22px",

                    color: "#00095B",
                  }}
                >
                  {`Dealerships within ${dist} miles of ${zip}`}
                </h3>
              ) : (
                <h3
                  style={{
                    marginTop: "0",
                    marginBottom: "4px",
                    fontSize: "24px",

                    color: "#00095B",
                  }}
                >
                  {`Top 3 dealerships near ${zip}`}
                </h3>
              )}
            </div>
            <div className="custom-scrollbar" 
            style={{ overflowY: "scroll", maxHeight: "260px" }}>
              {locations.map((e, index) => {
                return (
                  <button
                    style={{
                      color: "#00095B",

                      backgroundColor: "white",

                      padding: "10px",

                      borderRadius: "15px",

                      marginBottom: "10px",

                      width: "100%",
                    }}
                    onClick={() => locClickHandler(e)}
                  >
                    <div
                      style={{
                        display: "flex",

                        position: "relative",

                        flexDirection: "row",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",

                          padding: "0px",

                          marginRight: "0px",

                          marginLeft: "5px",

                          alignItems: "center",

                          justifyContent: "center",

                          color: "#00095B",

                          fontSize: "22px",
                        }}
                      >
                        {index + 1}
                      </div>

                      <div
                        style={{
                          width:'90%'
                        }}
                      >
                        <div
                          style={{
                            display: "flex",

                            marginBottom: "10px",

                            alignItems: "center",

                            justifyContent: "center",

                            fontSize: "22px",
                          }}
                        >
                          {e[0]}
                        </div>

                        <div style={{ fontSize: "15px" }}>{e[1]}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
