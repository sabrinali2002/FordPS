import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ChatItem from '../components/ChatItem'

describe('A basic chat item', ()=>{
    test('renders your message text', ()=>{
        render(<ChatItem message="Hello world" author="You"/>)
        expect(screen.getByText("Hello world")).toBeInTheDocument()
    })
    test('renders bot\'s message text', ()=>{
        render(<ChatItem message="Beep boop" author="Ford Chat"/>)
        expect(screen.getByText("Beep boop")).toBeInTheDocument()
    })
})

describe('A "table" chat item', ()=>{
    const carInfoData=[[{
        "android_auto": "N/A",
        "apple_carplay": "N/A",
        "basic_miles": "36,000 miles",
        "basic_years": "3 years",
        "body_size": "Midsize",
        "body_style": "SUV",
        "combined_fuel_economy": "N/A",
        "curb_weight": "3298 lbs",
        "cylinders": "I3",
        "drivetrain": "FWD",
        "electric_range": "N/A",
        "engine_aspiration": "Turbocharged",
        "full_recharge_time": "N/A",
        "ground_clearance": "N/A",
        "highway_fuel_economy": "N/A",
        "horsepower": "181 hp @ 6000 rpm",
        "id": 127,
        "invoice_price": 27691,
        "make": "Ford",
        "max_cargo_capacity": "65.4 ft³",
        "model": "F-150",
        "msrp": 28845,
        "navigation_system": "N/A",
        "number_of_doors": 4,
        "payload_capacity": "N/A",
        "range": "N/A",
        "seating_capacity": 316,
        "torque": "190 ft-lbs. @ 3000 rpm",
        "towing_capacity": "2000 lbs",
        "transmission": "automatic",
        "trim": "Active",
        "used_new_price": 28845,
        "vehicle_length": "180.1 in.",
        "year": 2023,
        "isChecked": true
    },
    {
        "android_auto": "N/A",
        "apple_carplay": "N/A",
        "basic_miles": "36,000 miles",
        "basic_years": "3 years",
        "body_size": "Midsize",
        "body_style": "SUV",
        "combined_fuel_economy": "N/A",
        "curb_weight": "3474 lbs",
        "cylinders": "I3",
        "drivetrain": "AWD",
        "electric_range": "N/A",
        "engine_aspiration": "Turbocharged",
        "full_recharge_time": "N/A",
        "ground_clearance": "N/A",
        "highway_fuel_economy": "N/A",
        "horsepower": "181 hp @ 6000 rpm",
        "id": 36656,
        "invoice_price": 29486,
        "make": "Ford",
        "max_cargo_capacity": "65.4 ft³",
        "model": "Escape",
        "msrp": 30715,
        "navigation_system": "N/A",
        "number_of_doors": 4,
        "payload_capacity": "N/A",
        "range": "N/A",
        "seating_capacity": 456,
        "torque": "190 ft-lbs. @ 3000 rpm",
        "towing_capacity": "2000 lbs",
        "transmission": "automatic",
        "trim": "Active",
        "used_new_price": 30715,
        "vehicle_length": "181.2 in.",
        "year": 2023,
        "isChecked": true
    }
    ], []]
    const carInfoMode="single"
   
    test('renders columns correctly', ()=>{
        render(<ChatItem message="Beep boop" author="Table" carInfoData={carInfoData} carInfoMode={carInfoMode}/>)
        expect(screen.getByText("Model")).toBeInTheDocument()
        expect(screen.getByText("Trim")).toBeInTheDocument()
        expect(screen.getByText("Year")).toBeInTheDocument()
    })

    test('has correct curb weights for both elements', ()=>{
        render(<ChatItem message="Beep boop" author="Table" carInfoData={carInfoData} carInfoMode={carInfoMode}/>)
        expect(screen.getByText("3298 lbs")).toBeInTheDocument()
        expect(screen.getByText("3474 lbs")).toBeInTheDocument()
    })
    test('has correct seating capacities for both elements', ()=>{
        render(<ChatItem message="Beep boop" author="Table" carInfoData={carInfoData} carInfoMode={carInfoMode}/>)
        expect(screen.getByText("316")).toBeInTheDocument()
        expect(screen.getByText("456")).toBeInTheDocument()
    })
    test('has correct images for both elements', ()=>{
        render(<ChatItem message="Beep boop" author="Table" carInfoData={carInfoData} carInfoMode={carInfoMode}/>)
        expect(screen.getByAltText("F-150 image")).toBeInTheDocument()
        expect(screen.getByAltText("Escape image")).toBeInTheDocument()
    })
})