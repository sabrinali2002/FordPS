import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'

test('ask me anything input area works', () => {
  window.HTMLElement.prototype.scrollIntoView = function() {};
  render(<App/>)

  const questionInput = screen.getByLabelText('Ask me anything...');
  questionInput.value = 'hello world';
  expect(questionInput).toBeInTheDocument();
  expect(questionInput.value).toBe('hello world');
});