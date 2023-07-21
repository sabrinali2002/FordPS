import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from '../App'

beforeAll(()=>{
    window.HTMLElement.prototype.scrollIntoView = function() {};
})
