import { Card, CardActionArea, CardContent, CardMedia, Grid, Tooltip, Typography } from "@mui/material";
import { tooltipClasses } from '@mui/material/Tooltip';
import { signOut } from "firebase/auth";
import { Fragment, useState, useEffect, useRef } from "react";
import { styled } from '@mui/material/styles';
import images from "../../images/image_link.json";
import '../../styles/App.css';
let maintenanceButtons
let ownerButtons
let scheduleButtons

export default function CarSelectScreen({user, auth, username, setMessages, setMenuButtons, handleUserInput, justSelect, selectedCar, setSelectedCar, onResaleButton, setOptionButtons}){
    const BigTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          fontSize: '1.0rem',
          padding: '5%'
        },
      }));

    const [updated, setUpdated] = useState(false);
    const resaleFunction = useRef()
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
      useEffect(()=>{
        
        setUpdated(u=>!u)
      }, [selectedCar])

      useEffect(()=>{
        scheduleButtons = ((
            <div className="option-buttons">
                <BigTooltip placement="top" title="Regular maintenance keeps your car in great shape. It includes routine tasks like oil changes, tire rotations, and brake inspections. Proper maintenance ensures your vehicle stays safe and reliable.">
                    <button className="button-small" onClick={()=>{handleUserInput('SCHEDRegular maintenance MODEL:'+myCars[selectedCar].model+"TRIM:"+myCars[selectedCar].trim);}}>
                        Regular maintenance
                    </button>
                </BigTooltip>
                <BigTooltip placement="top" title="Tire service involves routine tasks and maintenance to keep your car's tires in excellent condition. This includes services like tire rotations, balancing, and checking tire pressure regularly. Proper tire maintenance ensures better handling, longer tire life, and improved safety while driving.">
                <button className="button-small" onClick={()=>{handleUserInput('SCHEDTire service MODEL:'+myCars[selectedCar].model+"TRIM:"+myCars[selectedCar].trim);}}>Tire service</button>
                </BigTooltip>
                <BigTooltip placement="top" title="Brake service involves routine maintenance and repairs to ensure your car's braking system operates effectively. It includes inspections, brake pad replacements, and brake fluid checks. Proper brake service is crucial for your safety and the overall performance of your vehicle.">
                <button className="button-small" onClick={()=>{handleUserInput('SCHEDBrake service MODEL:'+myCars[selectedCar].model+"TRIM:"+myCars[selectedCar].trim);}}>
                    Brake service</button>
                </BigTooltip>
                <BigTooltip placement="top" title="Vehicle diagnostics refer to the process of identifying and troubleshooting any issues or malfunctions in your car's systems. Using specialized tools and software, technicians can pinpoint problems, allowing for accurate and efficient repairs.">
                <button className="button-small" onClick={()=>{handleUserInput('SCHEDVehicle diagnostics MODEL:'+myCars[selectedCar].model+"TRIM:"+myCars[selectedCar].trim);}}>
                    Vehicle diagnostics</button>
                </BigTooltip>
            </div>
          ))
        maintenanceButtons=(
            <div className="option-buttons">
              <button className="button-small" onClick={()=>{
                    setMessages(m=>{return [...m, {msg: "Schedule a maintenance appointment", author: "You"}, {msg: "What type of help with maintenance would you like?", author: "Ford Chat"}]})
                    setMenuButtons([])
                    setOptionButtons([scheduleButtons])
                }}>Schedule a maintenance appointment</button>
              <button className="button-small" onClick={()=>{
                console.log(selectedCar)
                setMessages(m=>{return [...m, {msg: "When is my service due?", author: "You"}, {msg: "Based on the information we have on your "+myCars[selectedCar].model+" "+myCars[selectedCar].trim+", you should schedule a maintenance appointment before August 11th. This is one year after the purchase date, following a regular schedule of maintenance annually.", author: "Ford Chat"}, {msg:"Or, you can schedule maintenance before you hit 10,000 miles.", author: "Ford Chat"}, {msg: "Please select a maintenance option for your "+myCars[selectedCar].model+" "+myCars[selectedCar].trim+", or select another car to restart the flow.", author: "Login"}]})
                setMenuButtons([])
                setOptionButtons([scheduleButtons])
                }}>When is my service due?</button>
              <button className="button-small" onClick={()=>{
                setMessages(m=>{return [...m, {msg: "Questions about maintenance", author: "You"}, {msg: "What would you like to know for maintenance?", author: "Ford Chat"}]})
                setMenuButtons([])
                handleUserInput("maintenanceQuestions")
                }}>Questions about maintenance</button>
            </div>
          )

         }, [updated])

      console.log("re-render", selectedCar)
    return (
        <div style={{marginLeft:"80px"}}>
            {!justSelect && <Fragment>
                <h1 style={{textAlign: 'center', fontSize:"26px"}}>Welcome back, {username.length>0?username:user.displayName}!</h1>
                <p style={{textAlign: 'center', fontSize:"18px"}}>Not you? <button className="link" style={{fontSize:"18px"}}onClick={() =>{ 
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
                                        setMenuButtons([])
                                        setOptionButtons([ <div className="option-buttons">
                                        <BigTooltip placement="top" title="Maintenance requests for cars are when you ask for repairs or services to keep your vehicle in good condition and running well. It's important to address issues promptly for safety and longevity.">
                                          <button className = "button-small" onClick={()=>{
                                                setMessages(m=>{return [...m, {msg: "Maintenance requests", author: "You"}, {msg: "What type of help with maintenance would you like?", author: "Ford Chat"}]})
                                                setMenuButtons([])
                                                setOptionButtons([maintenanceButtons])
                                            }}>Maintenance requests</button>
                                            </BigTooltip>
                                        <BigTooltip placement="top" title="Car resale value is the amount you can expect to get when you sell your car. Regular maintenance and proper care help maintain a higher resale value.">
                                          <button className = "button-small" onClick={()=>{
                                            onResaleButton(myCars[index])
                                            }}>Car resale value</button>
                                        </BigTooltip>
                                        <BigTooltip placement="top" title="An owner service center is a facility provided by Ford dealerships exclusively for Ford vehicles. It offers specialized expertise, genuine Ford parts, and trained technicians for optimal maintenance and warranty support. Choosing this center helps maintain your Ford's value and ensure reliable service.">
                                          <button className = "button-small" onClick={()=>{
                                            setMessages(m=>{return [...m, {msg: "Owner service center", author: "You"}, {msg: "What would you like to know?", author: "Ford Chat"}]})
                                            setMenuButtons([])
                                            handleUserInput("maintenanceQuestions")
                                            }}>Owner service center</button>
                                        </BigTooltip>
                                        <BigTooltip placement="top" title="We will help you find the closest Ford dealerships to you based on your preferred radius.">
                                          <button className = "button-small" onClick={()=>{
                                            handleUserInput('B');
                                            setMenuButtons([]);
                                            setOptionButtons([])
                                            }}>Find a dealership</button>
                                        </BigTooltip>
                                        </div>])
                                    }}>
                                        <CardContent style={{justifyContent:"left"}}>
                                            <CardMedia
                                            component="img"
                                            image={`${images[myCars[index].model][myCars[index].trim]}`}
                                            height="100"
                                            alt="your car"
                                            />
                                            <Typography variant="h5" style={{fontSize:"18px", fontFamily:'Antenna, sans-serif'}}>
                                                {car.model}
                                            </Typography>
                                            <Typography style={{fontSize:"15px", fontFamily:'Antenna, sans-serif'}}>
                                                {car.trim}
                                            </Typography>
                                            <Typography style={{fontSize:"15px", fontFamily:'Antenna, sans-serif'}}>
                                                {car.year}
                                            </Typography>
                                            <Typography style={{fontSize:"15px", fontFamily:'Antenna, sans-serif'}}>
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