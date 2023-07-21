import React, { useState, useEffect } from "react";
export default function Sched1({ dealer, date, time, handleAppointment, backButton }) {
  const [time1, setTime1] = useState(null);
  const [date1, setDate1] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
        Schedule Test Drive Appointment
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
          <a
            style={{ marginBottom: 10, color: "#575757", fontWeight: 100 }}
            href="https://www.example.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Or login/create a Ford account{" "}
          </a>
          <input
            onChange={(e) => setName(e.target.value)}
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              width: 400,
              height: 40,
              border: "none",
              marginBottom: 10,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              fontSize: 18,
              paddingLeft: 5,
            }}
            placeholder=" Name*"
          ></input>
          <input
            onChange={(e) => setEmail(e.target.value)}
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              width: 400,
              height: 40,
              border: "none",
              marginBottom: 10,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              fontSize: 18,
              paddingLeft: 5,
            }}
            placeholder=" Email*"
          />
          <input
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              width: 400,
              height: 40,
              border: "none",
              marginBottom: 10,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              fontSize: 18,
              paddingLeft: 5,
            }}
            placeholder=" Phone number*"
          />
          <input
            onChange={(e) => setNotes(e.target.value)}
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              width: 400,
              height: 50,
              border: "none",
              marginBottom: 10,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              fontSize: 18,
              paddingLeft: 5,
              marginBottom: 50,
            }}
            placeholder=" Notes/Requests"
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
            Trims to Test Drive
          </div>

          <div style={{ marginTop: 10, marginBottom: 10, color: "#575757" }}>
            limited to 2 cars to test drive during your appointment.
          </div>
          <img src="/bronco.png" style={{ alignSelf: "start" }}></img>
          <div style={{ marginBottom: 0, marginTop: 10 }}>
            <a
              href="https://www.example.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00095B" }}
            >
              {`Select more cars available at ${dealer}`}
            </a>
          </div>
          <button
            onClick={() => handleAppointment(name, email, phoneNumber, notes)}
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
