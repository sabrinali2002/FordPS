import React, { useState } from 'react';
import '../styles/QuestionButton.css';

const QuestionButton = () => {
    //0 is question mark, 1 is short info, 2 is long info
  const [expansion, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(1);
  };

  const handleToggleClick = () => {
    setIsExpanded(2)
  }

  const handleMouseLeave = () => {
    setIsExpanded(0)
  }

  return (
    <div className="question-button-container">
      <button className="question-button" onMouseEnter={handleToggleExpand}>
        ?
      </button>
      {expansion===1 && (
        <div className="explanation-container" onMouseLeave={handleMouseLeave}>
          <p>
            How do this work? <br/> Well, HenrAI uses large data sets to learn about Ford and help answer your questions. Click to learn more..
          </p>
         
          <button className="learn-more-button" onClick={handleToggleClick}>
            Learn More
          </button>
        </div>
      )}
      {expansion===2 && (
        <div className="extra-information">
        <p>HenrAI, our AI tool is built on Google's Vertex AI machine learning platform. 
            Generative AI, or the ability for AI to create information is the super cool new development
             that allows HenrAI to hold a normal conversation! 
             The genAI technology knows the statistics of certain words and phrases going together 
             in a sentence which is why HenrAI's English is so good!
              Play around with the 'ask me anything' to see what HenrAI can do!</p>
        <button onClick={handleMouseLeave}>
            x
            </button>
            </div>
      )}

    </div>
  );
};

export default QuestionButton;
