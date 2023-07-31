import React, { useState } from 'react';
import "../styles/Autofill.css";

const Autofill = ({ lastWord , chars, setQuery, restOfString }) => {

  console.log(restOfString);

if(lastWord != null) lastWord.toString();
if(restOfString != null)restOfString.toString();

const [recOn, setRecOn] = useState(false);
const [isHovered, setIsHovered] = useState(false);

const handleClick = () => {
  setRecOn(!recOn);
};

const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };


const [currentPick, setCurrentPick] = useState('');

const handleButtonPress = (rec) => {
  setQuery(`${restOfString} ${rec}`);
  lastWord=" ";
}



const recommendations = [" "];

const y=68;
const x=105 + (7 * chars);

  const style = {
    position: 'fixed',
    left: `${x}px`,
    bottom: `${y}px`,
    fontSize: '18px',
    fontFamily: 'Antenna, sans-serif',
    backgroundColor: '#f0d6ff',
    borderRadius:'10px',

  };

//recommending the model 
const fordModels = ['Fiesta', 'Focus', 'Mustang', 'Explorer', 'Escape', 'Bronco', 'EcoBoost',
 'Shelby', 'Lariat', 'Platinum', 'Limited','Titanium', 'Edge', 'Vignale', 'Ranger',
 "recommendation",
  "off-roading",
  "efficiency",
  "safety",
  "technology",
  "interior",
  "all-wheel-drive",
  "hybrid",
  "performance",
  "space",
  "luxury",
  "integration",
  "sustainability",
  "connectivity",
  "innovation",
  "eco-friendly",
  "family-friendly",
  "financing",
  "collision",
  "cruise-control",
  "infotainment",
  "driver-assist",
  "sound-system",
  "reliability",
  "durability",
  "configurations",
  "best-in-class",
  "capability",
  "lifestyle",
  "value",
  "aesthetics",
  "personalization",
  "emissions",
  "warranty",
  "responsive",
  "state-of-the-art",
  "adaptive",
  "visibility",
  "versatility",
  "innovative",
  "responsive",
  "premium",
  "ultimate",
  "efficient",
  "smartphone",
  "adaptive",
  "premium",
  "customizable",
  "urban",
  "effortless",
  "adventurous",
  "forward-thinking",
  "comfort",
  "performance",
  "crossover",
  "suspension",
  "iconic",
  "superior",
  "forward-facing",
  "connected",
  "traction",
  "eco-conscious",
  "user-friendly",
  "sporty",
  "fuel-saving",
  "ergonomic",
  "tailored",
  "eco-boost",
  "responsive",
  "versatile",
  "innovative",
  "acceleration",
  "architecture",
  "efficiency",
  "safety",

];
  let recTaken = '';

//edit distance function 
function calculateEditDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;

  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) + 1;
      }
    }
  }

  return dp[m][n];
}

  // Check if the word matches any Ford model
  if (lastWord != null && lastWord.length > 1) {
    for (let i = 0; i < fordModels.length; i++) {
        const model = fordModels[i];
        // console.log(model);
        const start2 = (lastWord.substring(0, 2).toLowerCase() === model.substring(0, 2).toLowerCase()) && (lastWord.length < model.length);
        const closeEdit = (calculateEditDistance(model, lastWord) < 3) && !(model.toLowerCase() === lastWord.toLowerCase());
        if (start2 || closeEdit) {
          recommendations.push(model);
          console.log(model);
        }
      }
  }

  return (
<div>
<div className="toggle-container">
      <label className="toggle-button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <input type="checkbox" checked={recOn} onChange={handleClick} />
        <div className="slider"></div>
      </label>
      {isHovered && <p className="label">Autofill {recOn ? 'on' : 'off'}</p>}
    </div>
    
    {recOn && recommendations.length>1 &&
    <div>
    {recommendations.map((item, index) => (
      <button style={style} key={index} onClick={() => handleButtonPress(item)}>
        {item}
      </button>
    ))}
  </div>
      }
</div>
  )
    };

export default Autofill;