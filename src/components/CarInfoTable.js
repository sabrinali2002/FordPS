import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const CarInfoTable = ({data}) => {

  return (
    
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Model</TableCell>
            <TableCell>Trim</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>MSRP</TableCell>
            <TableCell>Body Size</TableCell>
            <TableCell>Body Style</TableCell>
            <TableCell>Cylinders</TableCell>
            <TableCell>Engine Aspiration</TableCell>
            <TableCell>Drivetrain</TableCell>
            <TableCell>Transmission</TableCell>
            <TableCell>Horsepower(hp)</TableCell>
            <TableCell>Torque(ft-lbs)</TableCell>
            <TableCell>Seating Capacity</TableCell>
            <TableCell>Range</TableCell>
            <TableCell>Vehicle Length</TableCell>
            <TableCell>Combined Fuel Economy</TableCell>
            <TableCell>Curb Weight</TableCell>
            <TableCell>Ground Clearance</TableCell>
            <TableCell>Payload Capacity</TableCell>
            <TableCell>Towing Capacity</TableCell>
            <TableCell>Max Cargo Capacity</TableCell>
            <TableCell>Full Recharge Time(EV)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.model}</TableCell>
              <TableCell>{item.trim}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.msrp}</TableCell>
              <TableCell>{item.body_size}</TableCell>
              <TableCell>{item.body_style}</TableCell>
              <TableCell>{item.cylinders}</TableCell>
              <TableCell>{item.engine_aspiration}</TableCell>
              <TableCell>{item.drivetrain}</TableCell>
              <TableCell>{item.transmission}</TableCell>
              <TableCell>{item.horsepower}</TableCell>
              <TableCell>{item.torque}</TableCell>
              <TableCell>{item.seating_capacity}</TableCell>
              <TableCell>{item.range}</TableCell>
              <TableCell>{item.vehicle_length}</TableCell>
              <TableCell>{item.combined_fuel_economy}</TableCell>
              <TableCell>{item.curb_weight}</TableCell>
              <TableCell>{item.ground_clearance}</TableCell>
              <TableCell>{item.payload_capacity}</TableCell>
              <TableCell>{item.towing_capacity}</TableCell>
              <TableCell>{item.max_cargo_capacity}</TableCell>
              <TableCell>{item.full_recharge_time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CarInfoTable;