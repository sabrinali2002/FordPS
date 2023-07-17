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

const handleTakeRec = (rec) => {
    setQuery(`${restOfString} ${rec}`);
    lastWord=" ";
}

const recommendations = [];

const y=464;
const x=68 + (7 * chars);

  const style = {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
  };

//recommending the model 
const fordModels = ['Fiesta', 'Focus', 'Mustang', 'Explorer', 'Escape', 'Bronco', 'EcoBoost',
 'Shelby', 'Lariat', 'Platinum', 'Limited','Titanium', 'Edge', 'Vignale', 'Ranger', 'Bronco2'
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
<label  className="toggle-button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
      <input type="checkbox" checked={recOn} onChange={handleClick}/>
      <span className="slider"></span>
    </label>
{isHovered && (recOn ? (<p className="label">Autofill on</p>) : (<p className="label">Autofill off</p>))}
    </div>
    
    {recOn && recommendations.length>0 &&
        <div style={style}>
          <select className="fill" value={currentPick} onChange={(e) => handleTakeRec(e.target.value)} >
          {recommendations.map((rec) => (
              <option key={rec} value={rec}>{rec}</option>
            ))}
          </select>
        </div>
      }
</div>
  );
};

export default Autofill;