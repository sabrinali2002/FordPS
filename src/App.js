import logo from './logo.svg';
import './App.css';
import { Card, CardContent, Typography, CardActions, Button, TextField } from '@mui/material';
import { Fragment, useState } from 'react';

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
  const [query, setQuery] = useState("")

  return (
    <div className="App">
      <div className="ChatArea">
        <Card variant='outlined' style={{maxWidth: '45%', flex: 'none', marginTop: '2%'}}>{introCardContent}</Card>
        <div style={{flex: 'none'}}>

        </div>
      </div>
      <div classname="InputArea">
        <form onSubmit={(e)=>{
          e.preventDefault()
          alert(query)
        }}>
        <TextField onChange={(e)=>{
          setQuery(e.target.value)
        }} style={{backgroundColor: 'white', width: '90%', marginTop: '1%', marginLeft: '5%'}} label={"Enter your query here..."}/>
        </form>
      </div>
    </div>
  );
}

export default App;
