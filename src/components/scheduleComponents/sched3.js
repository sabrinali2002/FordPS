import React, { useState } from "react";
import images from "../../images/image_link.json";
import { BiRegistered } from 'react-icons/bi';

export default function Sched3({
  dealer,
  date,
  time,
  name,
  phoneNumber,
  notes,
  email,
  phone,
  address,
  link,
  hours,
  maintenanceMode="",
  trim="",
  model=""
}) {
  return (
    <div
      style={{
        width: "70%",
        backgroundColor: "#113B7A1A",
        height: "400px",
        borderRadius: "30px",
        marginTop: 20,
        position: "relative",
        justifyContent: "start",
        alignContent: "start",
        display: "flex",
        flexDirection: "column",
        padding: 15,
        marginBottom: 20,
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        marginLeft:'100px'
      }}
    >
      <div
        style={{
          color: "#00095B",
          fontWeight: "bold",
          fontSize: 26,
          alignSelf: "flex-start",
          marginBottom: 5,
        }}
      >
        Your appointment is confirmed
      </div>
      <div style={{ fontSize:'15',alignSelf: "start", marginBottom: 5, color: "black" }}>
        A confirmation email has been sent. Please arrive 15 minutes before your
        scheduled appointment time.
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
          fontSize: 18,
          padding: 3,
          marginBottom: 10,
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
          alignContent: "start",
          textAlign: "start",
          marginLeft: 10,
          width:'100%'
        }}
      >
        <div
          style={{
            fontWeight: 500,
            color: "#00095B",
            fontSize: 18,
            marginRight: 5,
            width:'90%'
          }}
        >
          Name:
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              width: '90%',
              height: 30,
              border: "none",
              marginBottom: 5,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              fontSize: 18,
              color: "gray",
              fontWeight: 400,
              display: "flex",
              alignItems: "center",
              paddingLeft: 5,
            }}
          >
            {name}
          </div>
          Email:
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              width: '90%',
              height: 30,
              border: "none",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              fontSize: 18,
              color: "gray",
              fontWeight: 400,
              marginBottom: 5,
              display: "flex",
              alignItems: "center",
              paddingLeft: 5,
            }}
          >
            {email}
          </div>
          Phone number:
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              width: '90%',
              height: 30,
              border: "none",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              fontSize: 18,
              color: "gray",
              fontWeight: 400,
              marginBottom: 5,
              display: "flex",
              alignItems: "center",
              paddingLeft: 5,
            }}
          >
            {phoneNumber}
          </div>
          Notes:
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              width: '90%',
              height: 30,
              border: "none",
              marginBottom: 10,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              fontSize: 18,
              color: "gray",
              fontWeight: 400,
              marginBottom: 5,
              display: "flex",

              alignItems: "center",
              paddingLeft: 5,
            }}
          >
            {notes}
          </div>
        </div>
        <div style={{width:"70%" }}>
          <div
            style={{
              fontWeight: 500,
              color: "#00095B",
              fontSize: 22,
              alignSelf: "start",
              textAlign: "start",
              marginBottom: 20,
            }}
          >
            {maintenanceMode.length==0?"Trims to test drive":maintenanceMode+" for your "+trim+" "+model}
          </div>
          <div className="model-button-sched3">
            <img src={model.length===0?images["Default"]["Bronco"]:`${images[trim.length>0?model:"Default"][trim.length>0?trim:model]}`} 
            style={{alignSelf:'center', width: '100%',height:'auto' }}/>
            <br/>{model.length===0?"Bronco":model}<BiRegistered/>{model.length===0?" Base":` ${trim}`}
          </div>
        </div>
        <div style={{ width: "65%",marginLeft:'-50px' }}>
          <div
            style={{
              fontWeight: 500,
              color: "#00095B",
              fontSize: 22,
              marginBottom: 10,
            }}
          >
            {dealer}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "70%",
              textOverflow:'break-word'
            }}
          >
            <div
              style={{
                fontWeight: 400,
                color: "black",
                fontSize: 15,
                display: "flex",
                position: "relative",
              }}
            >
              <img
                src="/3.png"
                style={{ height: 30, position: "absolute", left: 0, top: 0 }}
              ></img>

              <div style={{ position: "absolute", left: 40, top: 0 }}>
                {address}
              </div>
            </div>
            <div
              style={{
                marginTop: 20,
                fontWeight: 400,
                color: "black",
                fontSize: 15,
                display: "flex",
                position: "relative",
              }}
            >
              <img
                src="/2.png"
                style={{ alignSelf: "start", height: 25, left: 30, marginTop:10 }}
              ></img>

              <div style={{ position: "absolute", left: 40, top: 11 }}>
                {phone}
              </div>
            </div>
            <div
              style={{
                fontWeight: 400,
                color: "black",
                fontSize: 15,
                display: "flex",
                position: "relative",
              }}
            >
              <img src="/1.png" style={{ alignSelf: "start", width: 31 }}></img>
              <div style={{ position: "absolute", left: 42, top: -3 }}>
                {link}
              </div>
            </div>
            <div
              style={{
                fontWeight: 400,
                color: "black",
                fontSize: 15,
                display: "flex",
                position: "relative",
              }}
            >
              <img
                src="/4.png"
                style={{ alignSelf: "start", height: 25, left: 33, top: 0 }}
              ></img>

              <div style={{ position: "absolute", left: 40, top: 2 }}>
                {hours}{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
