import React, { useState, useEffect, useRef} from 'react';
import '../styles/Navbar.css'
import { MdClose } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';
// ...
const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const ref = useRef();
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
  return (
    <nav ref={ref} className="navbar">
        <button className="toggle" onClick={() => setNavbarOpen((prev) => !prev)}>
        {navbarOpen ? ( <MdClose style={{ width: '32px', height: '32px' }} />) : (
    <FiMenu style={{width: '32px',height: '32px',}}/>
  )}
</button>
  <ul className={`menu-nav${navbarOpen ? ' show-menu' : ''}`}>
    <li><a href = "#"><strong>Existing Owner</strong></a></li>
    <li><a href = "#"><strong>Buying a Ford</strong></a></li>
    <li><a href = "#"><strong>Info about Ford</strong></a></li>
    <li><a href = "#"><strong>Negotiation Assistance</strong></a></li>
    <li><a href = "#"><strong>Accessibility</strong></a></li>
  </ul>
</nav>
  );
};
export default Navbar;