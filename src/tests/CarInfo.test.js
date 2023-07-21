import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from '../App'

beforeAll(()=>{
    window.HTMLElement.prototype.scrollIntoView = function() {};
})

describe('clicking car info', ()=>{
    test('brings up "Please select a model/trim...', async()=>{
        render(<App/>)
        
        const fordButton=screen.getAllByText('Buying a Ford').filter(el=>el.className==="menu button-standard")[0]
        await userEvent.click(fordButton)
        
        const carInfoButton=screen.getAllByText('Info about a specific car').filter(el=>el.className==="menu button-standard")[0]
        await userEvent.click(carInfoButton)
      
        expect(screen.getByText("Please select a model/trim of the specific car you're looking for")).toBeInTheDocument()
    })
    test('brings up five buttons to select vehicle type', async()=>{
        render(<App/>)
        
        const fordButton=screen.getAllByText('Buying a Ford').filter(el=>el.className==="menu button-standard")[0]
        await userEvent.click(fordButton)
        
        const carInfoButton=screen.getAllByText('Info about a specific car').filter(el=>el.className==="menu button-standard")[0]
        await userEvent.click(carInfoButton)
        expect(screen.getByRole('button', {name: 'SUVs and Cars'})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Trucks and Vans'})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Electrified'})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Performance Vehicles'})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Commercial Vehicles'})).toBeInTheDocument()
    })
})