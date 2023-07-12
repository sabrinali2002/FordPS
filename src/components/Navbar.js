import React, { useState, useEffect, useRef} from 'react';
import '../styles/Navbar.css'
import { MdClose } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';
// ...
const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const ref = useRef();
  function addListener(){

  }
  useEffect(() => {
    const handler = (event) => {
      if (
        navbarOpen &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setNavbarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler);
    };
  }, [navbarOpen]);
  //add new list when u click things yay
  return (
    <nav ref={ref} className="navbar">
        <button className="toggle" onClick={() => setNavbarOpen((prev) => !prev)}>
        {navbarOpen ? ( <MdClose style={{ width: '32px', height: '32px' }} />) : (
    <FiMenu style={{width: '32px',height: '32px',}}/>
  )}
</button>
  <ul className={`menu-nav${navbarOpen ? ' show-menu' : ''}`}>
    <li><a href = "#" onClick = {addListener}><strong>Existing Owner</strong></a></li>
    <li><a href = "#" onClick = {addListener}><strong>Buying a Ford</strong></a></li>
    <li><a href = "#" onClick = {addListener}><strong>Info about Ford</strong></a></li>
    <li><a href = "#" onClick = {addListener}><strong>Negotiation Assistance</strong></a></li>
    <li><a href = "#" onClick = {addListener}><strong>Accessibility</strong></a></li>
  </ul>
</nav>
  );
};
export default Navbar;
