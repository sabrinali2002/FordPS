import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from '../App'

test('buying a ford is present on intial render', () => {
  window.HTMLElement.prototype.scrollIntoView = function() {};
  render(<App/>)
  
  expect(screen.getByText('Buying a Ford')).toBeInTheDocument()
});