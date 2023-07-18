import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function CarSelectScreen({user, auth, username, setMessages, setMenuButtons, handleUserInput}){
    const [myCars, setMyCars] = useState([
        {
            model: "Bronco",
            trim: "Base",
        },
        {
            model: "F-150",
            trim: "Raptor",
        },
        {
            model: "Escape",
            trim: "Platinum",
        }
    ])
    const ownerButtons = (
        <div className="buttons">
          <button className = "menu" onClick={()=>{
                setMessages(m=>{return [...m, {msg: "Maintenance requests", author: "You"}, {msg: "What type of help with maintenance would you like?", author: "Ford Chat"}]})
                setMenuButtons([maintenanceButtons])
            }}>Maintenance requests</button>
          <button className = "menu" onClick={()=>{
            }}>Car resale value</button>
          <button className = "menu" onClick={()=>{
            }}>Owner service center</button>
          <button className = "menu" onClick={()=>{
            }}>Find a dealership</button>
        </div>
      );
      const maintenanceButtons = (
        <div className="buttons">
          <button className = "menu" onClick={()=>{
                setMessages(m=>{return [...m, {msg: "Schedule a maintenance appointment", author: "You"}, {msg: "What type of help with maintenance would you like?", author: "Ford Chat"}]})
            }}>Schedule a maintenance appointment</button>
          <button className = "menu" onClick={()=>{
            }}>When is my service due?</button>
          <button className = "menu" onClick={()=>{
            setMessages(m=>{return [...m, {msg: "Questions about maintenance", author: "You"}, {msg: "What would you like to know for maintenance?", author: "Ford Chat"}]})
            setMenuButtons([])
            handleUserInput("maintenanceQuestions")
            }}>Questions about maintenance</button>
        </div>
      );
    return (
        <div>
            <h1 style={{textAlign: 'center'}}>Welcome back, {username.length>0?username:user.displayName}!</h1>
            <p style={{textAlign: 'center'}}>Not you? <button className="link" onClick={() =>{ 
            signOut(auth) }}>Click here</button> to sign out.</p>
            <h5>Which of your cars do you need help with?</h5>
            <br/>
            <Grid container spacing={2}>
                {
                    myCars.map((car, index)=>{
                        return (
                            <Grid p xs={4}>
                                <Card>
                                    <CardActionArea onClick={()=>{
                                        const model=myCars[index].model
                                        const trim=myCars[index].trim
                                        setMessages(m=>{return [...m, {msg: "You have chosen your "+model+" "+trim+". Which of the following options do you need help with?", author: "Ford Chat"}]})
                                        setMenuButtons([ownerButtons])
                                    }}>
                                        <CardContent>
                                            <CardMedia
                                            component="img"
                                            image={require("../../images/bronco.jpg")}
                                            height="140"
                                            alt="your car"
                                            />
                                            <Typography variant="h5">
                                                {car.model}
                                            </Typography>
                                            <Typography>
                                                {car.trim}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
    )
}