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
      <div className="fakeinfo">
      <h1 className="text">New 2024 Bronco Sport Free Wheeling</h1>
      <button type="button" classname="fakebtn">Explore Vehicle</button>
      </div>
      
          <img src={car} className="fordpic" alt='car'/>
      </div>}
      </Fragment>
      );
};

export default FordSite;