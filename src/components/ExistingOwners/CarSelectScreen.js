import { Card, CardActionArea, CardContent, CardMedia, Grid, Tooltip, Typography } from "@mui/material";
import { tooltipClasses } from '@mui/material/Tooltip';
import { signOut } from "firebase/auth";
import { Fragment, useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import images from "../../images/image_link.json";
import '../../styles/App.css';
let maintenanceButtons
let ownerButtons

export default function CarSelectScreen({user, auth, username, setMessages, setMenuButtons, handleUserInput, justSelect, selectedCar, setSelectedCar, onResaleButton}){
    const [updated, setUpdated] = useState(false);
    const [myCars, setMyCars] = useState([
        {
            model: "Edge",
            trim: "Sport",
            vin: "2FMDK4AKXDBB80428",
            year: "2013"
        },
        {
            model: "F-150",
            trim: "FX-2 Sport",
            vin: "1FTFX1ET9BFC21014",
            year: "2010"
        },
        {
            model: "Escape",
            trim: "Limited",
            vin: "1FMCU0E74BK291268",
            year: "2011"
        }
    ])
    const BigTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          fontSize: '1.0rem',
          padding: '5%'
        },
      }));
      
      const scheduleButtons = (
        <div className="buttons">
            <BigTooltip placement="top" title="Regular maintenance keeps your car in great shape. It includes routine tasks like oil changes, tire rotations, and brake inspections. Proper maintenance ensures your vehicle stays safe and reliable.">
                <button classname="menu button-standard" onClick={()=>{
                }}>Regular maintenance</button>
            </BigTooltip>
            <BigTooltip placement="top" title="Tire service involves routine tasks and maintenance to keep your car's tires in excellent condition. This includes services like tire rotations, balancing, and checking tire pressure regularly. Proper tire maintenance ensures better handling, longer tire life, and improved safety while driving.">
            <button classname="menu button-standard" onClick={()=>{
            }}>Tire service</button>
            </BigTooltip>
            <BigTooltip placement="top" title="Brake service involves routine maintenance and repairs to ensure your car's braking system operates effectively. It includes inspections, brake pad replacements, and brake fluid checks. Proper brake service is crucial for your safety and the overall performance of your vehicle.">
            <button classname="menu button-standard" onClick={()=>{
            }}>Brake service</button>
            </BigTooltip>
            <BigTooltip placement="top" title="Vehicle diagnostics refer to the process of identifying and troubleshooting any issues or malfunctions in your car's systems. Using specialized tools and software, technicians can pinpoint problems, allowing for accurate and efficient repairs.">
            <button classname="menu button-standard" onClick={()=>{
            }}>Vehicle diagnostics</button>
            </BigTooltip>
        </div>
      )
      useEffect(()=>{
        maintenanceButtons = (
            <div className="buttons">
              <button classname="menu button-standard" onClick={()=>{
                    setMessages(m=>{return [...m, {msg: "Schedule a maintenance appointment", author: "You"}, {msg: "What type of help with maintenance would you like?", author: "Ford Chat"}]})
                    setMenuButtons([scheduleButtons])
                }}>Schedule a maintenance appointment</button>
              <button classname="menu button-standard" onClick={()=>{
                console.log(selectedCar)
                setMessages(m=>{return [...m, {msg: "When is my service due?", author: "You"}, {msg: "Based on the information we have on your "+myCars[selectedCar].model+" "+myCars[selectedCar].trim+", you should schedule a maintenance appointment before August 11th. This is one year after the purchase date, following a regular schedule of maintenance annually.", author: "Ford Chat"}, {msg:"Or, you can schedule maintenance before you hit 10,000 miles.", author: "Ford Chat"}, {msg: "Please select a maintenance option for your "+myCars[selectedCar].model+" "+myCars[selectedCar].trim+", or select another car to restart the flow.", author: "Login"}]})
                setMenuButtons([scheduleButtons])
                }}>When is my service due?</button>
              <button classname="menu button-standard" onClick={()=>{
                setMessages(m=>{return [...m, {msg: "Questions about maintenance", author: "You"}, {msg: "What would you like to know for maintenance?", author: "Ford Chat"}]})
                setMenuButtons([])
                handleUserInput("maintenanceQuestions")
                }}>Questions about maintenance</button>
            </div>
          );
          setUpdated(!updated);
      }, [selectedCar])

      useEffect(()=>{
        ownerButtons = (
            <div className="buttons">
            <BigTooltip placement="top" title="Maintenance requests for cars are when you ask for repairs or services to keep your vehicle in good condition and running well. It's important to address issues promptly for safety and longevity.">
              <button className = "menu" onClick={()=>{
                    setMessages(m=>{return [...m, {msg: "Maintenance requests", author: "You"}, {msg: "What type of help with maintenance would you like?", author: "Ford Chat"}]})
                    setMenuButtons([maintenanceButtons])
                }}>Maintenance requests</button>
                </BigTooltip>
            <BigTooltip placement="top" title="Car resale value is the amount you can expect to get when you sell your car. Regular maintenance and proper care help maintain a higher resale value.">
              <button className = "menu" onClick={()=>{
                    onResaleButton(myCars[selectedCar]);
                }}>Car resale value</button>
            </BigTooltip>
            <BigTooltip placement="top" title="An owner service center is a facility provided by Ford dealerships exclusively for Ford vehicles. It offers specialized expertise, genuine Ford parts, and trained technicians for optimal maintenance and warranty support. Choosing this center helps maintain your Ford's value and ensure reliable service.">
              <button className = "menu" onClick={()=>{
                }}>Owner service center</button>
            </BigTooltip>
            <BigTooltip placement="top" title="We will help you find the closest Ford dealerships to you based on your preferred radius.">
              <button className = "menu" onClick={()=>{
                }}>Find a dealership</button>
            </BigTooltip>
            </div>
          );
      }, [updated])

      console.log("re-render", selectedCar)
    return (
        <div>
            {!justSelect && <Fragment>
                <h1 style={{textAlign: 'center'}}>Welcome back, {username.length>0?username:user.displayName}!</h1>
                <p style={{textAlign: 'center'}}>Not you? <button className="link" onClick={() =>{ 
                signOut(auth) }}>Click here</button> to sign out.</p>
                <h5>Which of your cars do you need help with?</h5>
            </Fragment>}
            <br/>
            <Grid container spacing={2} style={{alignSelf:'center'}}>
                {
                    myCars.map((car, index)=>{
                        return (
                            <Grid key={index} p xs={4}>
                                <Card>
                                    <CardActionArea onClick={()=>{
                                        const model=myCars[index].model
                                        const trim=myCars[index].trim
                                        setSelectedCar(index)
                                        setMessages(m=>{return [...m, {msg: "You have chosen your "+model+" "+trim+". Which of the following options do you need help with?", author: "Ford Chat"}]})
                                        setMenuButtons([ownerButtons])
                                    }}>
                                        <CardContent>
                                            <CardMedia
                                            component="img"
                                            image={`${images[myCars[index].model][myCars[index].trim]}`}
                                            height="160"
                                            alt="your car"
                                            />
                                            <Typography variant="h5">
                                                {car.model}
                                            </Typography>
                                            <Typography>
                                                {car.trim}
                                            </Typography>
                                            <Typography>
                                                {car.year}
                                            </Typography>
                                            <Typography>
                                                {car.vin}
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