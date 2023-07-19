import React, { Fragment } from "react";
import DropDown from "./DropDown";
import {Button} from 'react-bootstrap';

const CarInfoDropdownSection = ({dropDownOptions, carInfoMode}) => {
    return (
        <Fragment>
        {carInfoMode ==="single" && 
            <div>
                <h6>Model:</h6>
                <DropDown onChange={(event)=>{dropDownOptions[0](event)}} options={dropDownOptions[2]} car={"firstCar"} style={{width:"100%"}}/>
                <h6>Trim:</h6>
                <DropDown  onChange={(event)=>{dropDownOptions[1](event)}} options={dropDownOptions[3]} car={"firstCar"}/>
                <Button onClick={dropDownOptions[4]} className="mb-2" style={{marginRight: 8}}>Check it out</Button>
                <Button onClick={dropDownOptions[5]} className="mb-2" variant="secondary">Compare Cars</Button>
            </div>}
        {carInfoMode === "compare" &&
            <div>
                <div style={{display:"flex", justifyContent: "center", gap:"2rem"}}>
                    <div style={{width: "50%"}}>
                    <h6>Model 1:</h6>
                        <DropDown onChange={(event)=>{dropDownOptions[0](event)}} options={dropDownOptions[2]} car={"firstCar"}/>
                        <h6>Trim 1:</h6>
                        <DropDown  onChange={(event)=>{dropDownOptions[1](event)}} options={dropDownOptions[3]} car={"firstCar"}/>
                    </div>
                    <div style={{width: "50%"}}>
                        <h6>Model 2:</h6>
                        <DropDown onChange={(event)=>{dropDownOptions[0](event)}} options={dropDownOptions[2]} car={"secondCar"}/>
                        <h6>Trim 2:</h6>
                        <DropDown  onChange={(event)=>{dropDownOptions[1](event)}} options={dropDownOptions[6]} car={"secondCar"}/>
                    </div>
                </div>
                <Button onClick={dropDownOptions[4]} className="mb-2" variant="primary" style={{marginRight: 8}}>Check it out</Button>
                <Button onClick={dropDownOptions[5]} className="mb-2" variant="secondary">Single Car</Button>
            </div>
            }
        </Fragment>
    );
};

export default CarInfoDropdownSection;