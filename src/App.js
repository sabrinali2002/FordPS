import logo from './logo.svg';
import './App.css';
import { Card, CardContent, Typography, CardActions, Button, TextField } from '@mui/material';
import { Fragment } from 'react';

const introCardContent = (<Fragment>
  <CardContent>
  <Typography variant="h5" component="div">
    Welcome to Ford Chat! 👋
  </Typography>
  <Typography variant="body2">
    I am a chatbot that can answer any questions you have with Ford vehicles. I can help you with the following:
    <br/>
    <ul>
      <li>Get information about a specific make</li>
      <li>Find nearby dealerships to schedule a test drive</li>
      <li>Get redirected to a relevant payments estimator</li>
    </ul>
  </Typography>
</CardContent>
</Fragment>)

function App() {
  return (
    <div className="App">
      <div className="ChatArea">
        <Card variant='outlined' style={{maxWidth: '45%', flex: 'none', marginTop: '2%'}}>{introCardContent}</Card>
        <div style={{flex: 'none'}}>
          <p>hi</p>
          <p>hi</p>
          <p>hi</p>
          <p>hi</p>
          <p>hi</p>
          <p>hi</p>
          <p>hi</p>
          <p>hi</p>
          <p>hi</p>
        </div>
      </div>
      <div classname="InputArea">
        <TextField style={{backgroundColor: 'white', width: '90%', marginTop: '1%', marginLeft: '5%'}} label={"Enter your query here..."}/>
      </div>
    </div>
  );
}

export default App;
