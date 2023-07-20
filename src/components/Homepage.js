import React from 'react';
import '../styles/Homepage.css';
import { useSpring, animated } from '@react-spring/web';
import { Fragment, useEffect, useState, useRef } from "react";
import img from './henrai.jpg'
import { Link } from '@mui/material';
import TopBar from './TopBar.js';
import ParticleBackground from './ParticleBackground.js';

const Homepage = ({handleClick}) => {

  //ford navy is 322964 
  //other blue is BLUE

  return (
    <div className="homepage-container">
    <TopBar handleClick={handleClick}/>
    <div className="home">
      <ParticleBackground />
    <div className="center">
      <img src={img} className="henrai" alt='henrai'/>
      <h1 className="welcome">Hey there and welcome! <br /> 
       I am HenrAI, a chatbot to help you with your Ford journey. 
       </h1>
       <button className="enter" onClick={()=>{
        window.location.href="/chat"
       }}>get started</button>
    </div>
    </div>
    </div>
  );
};

export default Homepage;