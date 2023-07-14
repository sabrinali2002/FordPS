import React from 'react';
import '../styles/TopBar.css';
import img from './fordlogo.png';
import {useState} from 'react';

const TopBar = ({ handleClick }) => {

  //ford navy is 322964 
  //other blue is BLUE

  const [isClicked, setIsClicked] = useState(false);

  const chatEnter = () => {
    setIsClicked(true);
    handleClick();
  }

  return (
    <div className="top">
      <div className="leftbuttons">
        <button className="btnn">Vehicles</button>
        <button className="btnn">Shop</button>
        <button className="support">Support and Service</button>
        </div>
        <div className="fordlogo">
        <img src={img} className="logo" alt='logo'/>
        </div>
        <button className={`chatbtn ${isClicked ? "clicked" : ""}`} onClick={chatEnter}>Chatbot</button>
    </div>
  );
};

export default TopBar;