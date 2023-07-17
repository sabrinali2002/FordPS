import React, { Fragment } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

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

//Sorting functions -------------------------------------------------
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

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

const CarInfoTable = ({ data, mode, intro }) => {
    let car1data, car2data;
    if (data[0] !== undefined) {
        car1data = data[0][0];
    }
    if (data[1] !== undefined) car2data = data[1][0];
    console.log(data);
    return (
        <Fragment>
            {intro !== undefined && <p>{intro}</p>}
            {data[0].length !== 0 && mode === "single" && (
                <TableContainer component={Paper} className="mt-2">
                    <Table>
                        <TableHead>
                            <TableRow>
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
                                    <StyledTableCell>{item.model}</StyledTableCell>
                                    <StyledTableCell>{item.trim}</StyledTableCell>
                                    <StyledTableCell>{item.year}</StyledTableCell>
                                    <StyledTableCell>{item.msrp}</StyledTableCell>
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
                            {specList.map((spec, index) => (
                                <StyledTableRow key={spec}>
                                    <StyledTableCell>{spec}</StyledTableCell>
                                    <StyledTableCell style={{fontWeight: "bold"}}>{car1data[`${specListSQL[index]}`]}</StyledTableCell>
                                    <StyledTableCell>{car2data[`${specListSQL[index]}`]}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Fragment>
    );
};

export default CarInfoTable;
