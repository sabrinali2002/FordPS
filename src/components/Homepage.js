import React from 'react';
import '../styles/Homepage.css';
import { useSpring, animated } from '@react-spring/web';
import { Fragment, useEffect, useState, useRef } from "react";
import img from './henrai.jpg'



const Homepage = ({ handleClick }) => {

  //ford navy is 322964 
  //other blue is BLUE

  return (
    <div className="homepage-container">
    <div className="home">
    <div className="center">
      <img src={img} className="henrai" alt='henrai'/>
      <h1 className="welcome">Hey there! <br /> 
       I am HenrAI, a Ford chatbot to help you with your Ford journey. 
       </h1>
      <button className="enter" onClick={handleClick}>get started</button>
    </div>
    </div>
    </div>
  );
};

export default Homepage;