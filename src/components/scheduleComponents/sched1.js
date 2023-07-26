import React, { useState, useEffect } from "react";
import images from "../../images/image_link.json";
import { TextField } from "@mui/material";

export default function Sched1({ dealer, date, time, handleAppointment, maintenanceMode="", model="", trim="", backButton, dispName="", userEmail="" }) {
  const [time1, setTime1] = useState(null);
  const [date1, setDate1] = useState(null);
  const [name, setName] = useState(dispName);
  const [email, setEmail] = useState(userEmail);
  const [notes, setNotes] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  function checkForValidEmail(email){
    return email.split("@").length===2 && email.split("@")[1].split(".").length===2
  }

  function checkForValidUsername(username){
      return username.match("^[A-Za-z ]+$");
  }

  function checkForValidPhoneNumber(phoneNum){
    return phoneNum.length===10 && phoneNum.match("^[0-9]+$");
  }
  useEffect(() => {
    if (time && date) {
      setTime1(time);
      setDate1(date);
      console.log(date, time);
    }
  }, [time, date]);
  return (
    <div
      style={{
        width: "1082px",
        backgroundColor: "#113B7A1A",
        height: "auto",
        borderRadius: "30px",
        marginBottom: "10px",
        flexDirection: "column",
        justifyContent: "flex-start",
        display: "flex",
        padding: 20,
        marginLeft: '35px',
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        style={{
          color: "#00095B",
          fontWeight: "bold",
          fontSize: 27,
          alignSelf: "flex-start",
          marginBottom: 10,
        }}
      >
        Schedule a {maintenanceMode.length==0?"Test Drive":maintenanceMode} Appointment
      </div>
      <div
        style={{
          backgroundColor: "white",
          width: "100%",
          color: "#00095B",
          borderRadius: 5,
          marginRight: 10,
          marginLeft: 10,
          fontWeight: 500,
          fontSize: 20,
          padding: 3,
          marginBottom: 20,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          alignSelf: "center",
        }}
      >
        {`${dealer} - ${date} @${time}`}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: 50,
            justifyContent: "start",
            alignItems: "start",
            marginLeft: 30,
          }}
        >
          <div
            style={{
              fontWeight: 500,
              color: "#00095B",
              fontSize: 23,
              alignSelf: "start",
              textAlign: "start",
            }}
          >
            Guest Information
          </div>
          {maintenanceMode.length===0&&<a
            style={{ marginBottom: 10, color: "#575757", fontWeight: 100 }}
            href="https://www.example.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Or login/create a Ford account{" "}
          </a>}

          <TextField
          error={name.length>0 && !checkForValidUsername(name)}
          value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              input: { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", backgroundColor: 'white' },
              width: 400,
              border: "none",
              fontSize: 18,
            }}
            margin="dense"
            label=" Name*"
            helperText={name.length>0 && !checkForValidUsername(name)?"Please enter a valid name":""}
          ></TextField>
          <TextField
          value={email}
          error={email.length>0 && !checkForValidEmail(email)}
            helperText={email.length>0 && !checkForValidEmail(email)?"Please enter a valid email":""}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              input: { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", backgroundColor: 'white' },
              width: 400,
              border: "none",
              fontSize: 18,
            }}
            margin="dense"
            label=" Email*"
          />
          <TextField
            onChange={(e) => setPhoneNumber(e.target.value)}
            sx={{
              input: { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", backgroundColor: 'white' },
              width: 400,
              border: "none",
              fontSize: 18,
            }}
            margin="dense"
            error={phoneNumber.length>0 && !checkForValidPhoneNumber(phoneNumber)}
            helperText={phoneNumber.length>0 && !checkForValidPhoneNumber(phoneNumber)?"Please enter a valid phone number":""}
            label=" Phone number*"
          />
          <TextField
            onChange={(e) => setNotes(e.target.value)}
            sx={{
              input: { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", backgroundColor: 'white' },
              width: 400,
              border: "none",
              fontSize: 18,
            }}
            margin="dense"
            label=" Notes/Requests"
          />
        </div>
        <div
          style={{
            alignItems: "start",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{
              fontWeight: 500,
              color: "#00095B",
              fontSize: 23,
              alignSelf: "start",
              textAlign: "start",
            }}
          >
            {maintenanceMode.length===0?"Trims to Test Drive":"This Appointment is for:"}
          </div>

          <div style={{ marginTop: 10, marginBottom: 10, color: "#575757" }}>
          {maintenanceMode.length===0?"limited to 2 cars to test drive during your appointment.":"Your "+model+" "+trim}
          </div>
          <img src={model.length===0?"/bronco.png":`${images[trim.length>0?model:"Default"][trim.length>0?trim:model]}`} style={{ alignSelf: "start", width: '300px' }}></img>
          {maintenanceMode.length==0 && <div style={{ marginBottom: 0, marginTop: 10 }}>
            <a
              href="https://www.example.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00095B" }}
            >
              {`Select more cars available at ${dealer}`}
            </a>
          </div>}
          <button
            onClick={() => {
              if(name.length===0 || email.length===0 || phoneNumber.length===0 || !checkForValidEmail(email) || !checkForValidPhoneNumber(phoneNumber) || !checkForValidUsername(name)){
                alert("Please fill out all required fields with valid information")
                return
              }
              handleAppointment(name, email, phoneNumber, notes)
            }}
            style={{
              marginTop: 0,
              color: "white",
              backgroundColor: "#00095B",
              border: "none",
              borderRadius: 10,
              paddingHorizontal: "10px",
              paddingTop: 5,
              paddingRight: 10,
              paddingLeft: 10,
              paddingBottom: 10,
              marginTop: 30,
              marginLeft: 230,
              fontSize: 18,
              width: 300,
              marginBottom: 10,
              cursor: 'pointer'
            }}
          >
            Confirm appointment
          </button>
        </div>
      </div>

      <img
        src="/back.png"
        style={{
          alignSelf: "start",
          height: 22,
          marginTop: -30,
          marginLeft: 8,
          cursor:'pointer'
        }}
        onClick={backButton}
      ></img>
    </div>
  );
}
