import '../styles/FordSite.css';
import car from './ford.jpg'
import TopBar from './TopBar.js'
import Homepage from './Homepage';
import {useState, Fragment} from 'react';
function FordSite() {
  const [showHomepage, setShowHomepage] = useState(false);

  //ford navy is 322964 
  //other blue is BLUE

  return (
      <Fragment>
      {showHomepage?<Homepage handleClick={()=>{
        setShowHomepage(h=>!h);
      }}/>:<div className="page">
      <TopBar handleClick={()=>{
        setShowHomepage(h=>!h);
      }}/>
      <div className="bar">
        <h1>Certain Mustang® Mach-E® and F-150® Lightning® Models are Currently Eligible for Potential Federal Tax Credits*</h1>
      </div>
          <img src={car} className="fordpic" alt='car'/>
      </div>}
      </Fragment>
      );
};

export default FordSite;