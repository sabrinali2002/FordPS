import React from 'react';
import '../styles/Homepage.css';
import img from './henraicircle.jpg';
import TopBar from './TopBar.js';

const Homepage = ({ handleClick }) => {

  //ford navy is 322964 
  //other blue is BLUE
  const handleChatClick =() => {
    console.log('chat clicked again');
  }

  return (
    <div className="homepage-container">
    <TopBar />
    <div className="home">
    <div className="center">
      <img src={img} className="henrai" alt='henrai'/>
      <h1 className="welcome">Hey there and welcome! <br /> 
       I am HenrAI, a chatbot to help you with your Ford journey. 
       </h1>
      <button className="enter" onClick={handleClick}>get started</button>
    </div>
    </div>
    </div>
  );
};

export default Homepage;