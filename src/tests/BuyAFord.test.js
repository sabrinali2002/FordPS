import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from '../App'

test('buying a ford is present on intial render', () => {
  window.HTMLElement.prototype.scrollIntoView = function() {};
  render(<App/>)
  
  expect(screen.getAllByText('Buying a Ford').filter(el=>el.className==="menu button-standard")[0]).toBeInTheDocument()
});

test('clicking on "buying a ford" brings up four buttons', async() => {
  window.HTMLElement.prototype.scrollIntoView = function() {};
  render(<App/>)
  
  const fordButton=screen.getAllByText('Buying a Ford').filter(el=>el.className==="menu button-standard")[0]
  await userEvent.click(fordButton)

  expect(screen.getAllByText('Info about a specific car').filter(el=>el.className==="menu button-standard")[0]).toBeInTheDocument()
  expect(screen.getAllByText('Car recommendation').filter(el=>el.className==="menu button-standard")[0]).toBeInTheDocument()
  expect(screen.getAllByText('Car pricing estimator').filter(el=>el.className==="menu button-standard")[0]).toBeInTheDocument()
  expect(screen.getAllByText('Schedule a test drive').filter(el=>el.className==="menu button-standard")[0]).toBeInTheDocument()
});