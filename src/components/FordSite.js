import React from 'react';
import '../styles/FordSite.css';
import car from './ford.jpg'
import TopBar from './TopBar.js'

const FordSite = ({ handleClick }) => {

  //ford navy is 322964 
  //other blue is BLUE

  return (
    <div className="page">
    <TopBar handleClick={handleClick}/>
    <div className="bar">
      <h1>Certain Mustang® Mach-E® and F-150® Lightning® Models are Currently Eligible for Potential Federal Tax Credits*</h1>
    </div>
        <img src={car} className="fordpic" alt='car'/>
    </div>
  );
};

export default FordSite;