import React, { useState } from 'react';
import QuestionButton from './QuestionButton.js';
import Autofill from './Autofill.js';
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { TextFieldsOutlined, TextFields, Brightness7, Brightness4 } from '@mui/icons-material';
import "../styles/AccessibilityButton.css";
import  img  from './accesspic.png';

const AccessibilityButton = ({toggleTextSize, toggleDarkMode, queryText, setQueryText, darkMode, textSize}) => {
  const [showBottom, setShowBottom] = useState(false);

  // Function to toggle the "bottom" div visibility
  const toggleBottom = () => {
    setShowBottom((prevShowBottom) => !prevShowBottom);
  };

  return (
    <div className="access">
      {/* Accessibility Icon */}
      <IconButton onClick={toggleBottom} color="blue" aria-label="Toggle Accessibility">
      <img className="accesspic" src={img} alt="access icon" />
      </IconButton>

      {/* "bottom" div, shown conditionally based on the state */}
      {showBottom && (
        <div className="bottom">
          <IconButton onClick={toggleTextSize} color="blue" aria-label="Toggle Text Size">
            {textSize === "medium" ? <TextFieldsOutlined /> : <TextFields />}
          </IconButton>
          <IconButton onClick={toggleDarkMode} color="blue" aria-label="Toggle Dark Mode">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <QuestionButton />
          <Autofill
            lastWord={queryText.trim().split(' ').pop()}
            chars={queryText.length}
            setQuery={setQueryText}
            restOfString={queryText.trim().split(' ').slice(0, -1).join(' ')}
          />
        </div>
      )}
    </div>
  );
};

export default AccessibilityButton;
