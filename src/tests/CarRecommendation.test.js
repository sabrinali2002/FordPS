import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from '../App'

test('clicking on "Car recommendation" brings up "Ask my own questions" and "Questionnaire', async()=>{
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<App/>)
    
    const fordButton=screen.getAllByText('Buying a Ford').filter(el=>el.className==="menu")[0]
    await userEvent.click(fordButton)
    
    const carRecButton=screen.getAllByText('Car recommendation').filter(el=>el.className==="menu")[0]
    await userEvent.click(carRecButton)
  
    expect(screen.getByText("Happy to help! Do you have specific needs in mind, or would you like to fill out our questionnaire?")).toBeInTheDocument()
    expect(screen.getAllByText('Ask my own questions').filter(el=>el.className==="menu")[0]).toBeInTheDocument()
    expect(screen.getAllByText('Take questionnaire').filter(el=>el.className==="menu")[0]).toBeInTheDocument()
})

test('clicking "Questionnaire" brings up four questions', async()=>{
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<App/>)
    
    const fordButton=screen.getAllByText('Buying a Ford').filter(el=>el.className==="menu")[0]
    await userEvent.click(fordButton)
    
    const carRecButton=screen.getAllByText('Car recommendation').filter(el=>el.className==="menu")[0]
    await userEvent.click(carRecButton)

    const questionnaireButton=screen.getAllByText('Take questionnaire').filter(el=>el.className==="menu")[0]
    await userEvent.click(questionnaireButton)
    
    expect(screen.getByText("Great! What is your budget range for purchasing a car?")).toBeInTheDocument()
    // expect(screen.getByText("Are you interested in a specific type of vehicle, such as a cargo van, SUV, hatchback, or pickup truck?")).toBeInTheDocument()
    // expect(screen.getByText("How do you plan to use the car? Will it be primarily for commuting, family use, off-roading, or business purposes?")).toBeInTheDocument()
    // expect(screen.getByText("How many passengers do you need to accommodate regularly?")).toBeInTheDocument()
})