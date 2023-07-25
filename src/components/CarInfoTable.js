import React, { Fragment } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import images from "../images/image_link.json";
import Checkbox from '@mui/material/Checkbox';
import { Button } from "react-bootstrap";


//Style functions -----------------------------------------------------
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#2a6bac",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const specList = [
    "Model",
    "Trim",
    "Year",
    "MSRP",
    "Body Size",
    "Body Style",
    "Cylinders",
    "Engine Aspiration",
    "Drivetrain",
    "Transmission",
    "Horsepower",
    "Torque",
    "Seating Capacity",
    "Range",
    "Vehicle Length",
    "Combined Fuel Economy",
    "Curb Weight",
    "Ground Clearance",
    "Payload Capacity",
    "Towing Capacity",
    "Max Cargo Capacity",
    "Full Recharge Time",
    "Electric Range",
    "Android Auto",
    "Apple CarPlay",
    "Basic Years",
    "Basic Miles",
];

const specListSQL = specList.map((spec) => spec.toLowerCase().replace(/ /g, "_"));

const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD"
})

const CarInfoTable = ({ data, mode, intro, onCheckboxSelect, messageIndex, selectedCars, onCompare, onTableBack }) => {
    let car1data, car2data;
    console.log("received data" + data);
    if (data[0] !== undefined) {
        car1data = data[0][0];
    }
    if (data[1] !== undefined) car2data = data[1][0];
    return (
        <Fragment>
            {intro !== undefined && <p>{intro}</p>}
            {data[0].length !== 0 && mode === "single" && selectedCars.length < 2 && (
                <Button disabled>Select Cars to Compare</Button>
            )}
            {data[0].length !== 0 && mode === "single" && selectedCars.length >= 2 && (
                <Button onClick={onCompare}>Compare These Cars</Button>
            )}
            {data[0].length !== 0 && mode === "single" && (
                <TableContainer component={Paper} className="mt-2">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell>Image</StyledTableCell>
                                <StyledTableCell>Model</StyledTableCell>
                                <StyledTableCell>Trim</StyledTableCell>
                                <StyledTableCell>Year</StyledTableCell>
                                <StyledTableCell>MSRP</StyledTableCell>
                                <StyledTableCell>Body Size</StyledTableCell>
                                <StyledTableCell>Body Style</StyledTableCell>
                                <StyledTableCell>Cylinders</StyledTableCell>
                                <StyledTableCell>Engine Aspiration</StyledTableCell>
                                <StyledTableCell>Drivetrain</StyledTableCell>
                                <StyledTableCell>Transmission</StyledTableCell>
                                <StyledTableCell>Horsepower(hp)</StyledTableCell>
                                <StyledTableCell>Torque(ft-lbs)</StyledTableCell>
                                <StyledTableCell>Seating Capacity</StyledTableCell>
                                <StyledTableCell>Range</StyledTableCell>
                                <StyledTableCell>Vehicle Length</StyledTableCell>
                                <StyledTableCell>Combined Fuel Economy</StyledTableCell>
                                <StyledTableCell>Curb Weight</StyledTableCell>
                                <StyledTableCell>Ground Clearance</StyledTableCell>
                                <StyledTableCell>Payload Capacity</StyledTableCell>
                                <StyledTableCell>Towing Capacity</StyledTableCell>
                                <StyledTableCell>Max Cargo Capacity</StyledTableCell>
                                <StyledTableCell>Full Recharge Time(EV)</StyledTableCell>
                                <StyledTableCell>Electric Range</StyledTableCell>
                                <StyledTableCell>Android Auto</StyledTableCell>
                                <StyledTableCell>Apple CarPlay</StyledTableCell>
                                <StyledTableCell>Basic Warranty Length</StyledTableCell>
                                <StyledTableCell>Basic Warranty Range</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data[0].map((item) => (
                                <StyledTableRow key={item.id}>
                                    <Checkbox onClick={()=>onCheckboxSelect(item.id, messageIndex)} checked={item.isChecked}/>
                                    <StyledTableCell>
                                        <img src={`${images[item.model][item.trim]}`} style={{ width: "200px" }} alt={`${item.model} image`}></img>
                                    </StyledTableCell>
                                    <StyledTableCell>{item.model}</StyledTableCell>
                                    <StyledTableCell>{item.trim}</StyledTableCell>
                                    <StyledTableCell>{item.year}</StyledTableCell>
                                    <StyledTableCell>{moneyFormatter.format(item.msrp)}</StyledTableCell>
                                    <StyledTableCell>{item.body_size}</StyledTableCell>
                                    <StyledTableCell>{item.body_style}</StyledTableCell>
                                    <StyledTableCell>{item.cylinders}</StyledTableCell>
                                    <StyledTableCell>{item.engine_aspiration}</StyledTableCell>
                                    <StyledTableCell>{item.drivetrain}</StyledTableCell>
                                    <StyledTableCell>{item.transmission}</StyledTableCell>
                                    <StyledTableCell>{item.horsepower}</StyledTableCell>
                                    <StyledTableCell>{item.torque}</StyledTableCell>
                                    <StyledTableCell>{item.seating_capacity}</StyledTableCell>
                                    <StyledTableCell>{item.range}</StyledTableCell>
                                    <StyledTableCell>{item.vehicle_length}</StyledTableCell>
                                    <StyledTableCell>{item.combined_fuel_economy}</StyledTableCell>
                                    <StyledTableCell>{item.curb_weight}</StyledTableCell>
                                    <StyledTableCell>{item.ground_clearance}</StyledTableCell>
                                    <StyledTableCell>{item.payload_capacity}</StyledTableCell>
                                    <StyledTableCell>{item.towing_capacity}</StyledTableCell>
                                    <StyledTableCell>{item.max_cargo_capacity}</StyledTableCell>
                                    <StyledTableCell>{item.full_recharge_time}</StyledTableCell>
                                    <StyledTableCell>{item.electric_range}</StyledTableCell>
                                    <StyledTableCell>{item.android_auto}</StyledTableCell>
                                    <StyledTableCell>{item.apple_carplay}</StyledTableCell>
                                    <StyledTableCell>{item.basic_years}</StyledTableCell>
                                    <StyledTableCell>{item.basic_miles}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {car1data !== undefined && car2data !== undefined && mode === "compare" && (
                <TableContainer component={Paper} className="mt-2">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell>{`${car1data.model} ${car1data.trim}`}</StyledTableCell>
                                <StyledTableCell>{`${car2data.model} ${car2data.trim}`}</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell>Image</StyledTableCell>
                                <StyledTableCell>
                                    <img src={`${images[car1data.model]}`} style={{ width: "200px" }} alt={`${car1data.model} image`}></img>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <img src={`${images[car2data.model]}`} style={{ width: "200px" }} alt={`${car2data.model} image`}></img>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <img src={`${images[car1data.model]}`} style={{ width: "200px" }} alt={`${car1data.model} image`}></img>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <img src={`${images[car2data.model]}`} style={{ width: "200px" }} alt={`${car2data.model} image`}></img>
                                </StyledTableCell>
                            </StyledTableRow>
                            {specList.map((spec, index) => (
                                <StyledTableRow key={spec}>
                                    <StyledTableCell>{spec}</StyledTableCell>
                                    <StyledTableCell>{car1data[`${specListSQL[index]}`]}</StyledTableCell>
                                    <StyledTableCell>{car2data[`${specListSQL[index]}`]}</StyledTableCell>
                                    <StyledTableCell>{car1data[`${specListSQL[index]}`]}</StyledTableCell>
                                    <StyledTableCell>{car2data[`${specListSQL[index]}`]}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {mode === "multiple" && (
                <Fragment>
                    <Button variant="secondary" onClick={onTableBack}>Back</Button>
                    <TableContainer component={Paper} className="mt-2">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell></StyledTableCell>
                                    {selectedCars.map((car) => {
                                        return <StyledTableCell key={car.id}>{`${car.model} ${car.trim}`}</StyledTableCell>;
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow>
                                    <StyledTableCell>Image</StyledTableCell>
                                    {selectedCars.map((car) => {
                                        return (
                                            <StyledTableCell key={car.id}>
                                                <img src={`${images[car.model][car.trim]}`} style={{ width: "200px" }} alt={`${car.model} image`}></img>
                                            </StyledTableCell>
                                        );
                                    })}
                                </StyledTableRow>
                                {specList.map((spec, index) => (
                                    <StyledTableRow key={spec}>
                                        <StyledTableCell>{spec}</StyledTableCell>
                                        {selectedCars.map((car) => {
                                            if(spec === "MSRP") {
                                                return <StyledTableCell key={car.id}>{moneyFormatter.format(car[`${specListSQL[index]}`])}</StyledTableCell>
                                            }
                                            return <StyledTableCell key={car.id}>{car[`${specListSQL[index]}`]}</StyledTableCell>
                                        })}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Fragment>
            )}
        </Fragment>
    );
};

export default CarInfoTable;
