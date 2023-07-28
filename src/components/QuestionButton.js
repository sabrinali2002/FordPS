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
        <p>HenrAI, our AI tool, is built on Google's Vertex AI machine learning platform. 
          Generative AI, the ability for AI to create information, is a super cool new development
           that allows HenrAI to hold natural conversations! Generative AI is a category of 
           artificial intelligence that focuses on enabling machines to create original content, 
           such as text, images, or even music. Unlike traditional AI models designed for
            specific tasks, generative AI models can generate new content based on learned patterns 
            from vast amounts of training data. GenAI utilizes the Transformer architecture,
             which consists of multiple layers of self-attention and feed-forward neural networks.
              Transformers are a type of deep learning architecture that excels at processing
              sequences of data, like text. They use self-attention mechanisms to weigh the
              importance of different elements in the sequence during processing, 
              enabling better capture of long-range dependencies and context in the data. 
              When users interact with HenrAI, GenAI processes user inputs, applies the learned 
              patterns, and generates responses based on the context and knowledge it has acquired. 
              Feel free to explore the 'ask me anything' feature to see what HenrAI can do!

</p>
        <button onClick={handleMouseLeave}>
            x
            </button>
            </div>
      )}

    </div>
  );
};

export default QuestionButton;
