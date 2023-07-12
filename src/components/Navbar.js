import React, { useState, useEffect, useRef} from 'react';
import '../styles/Navbar.css'
import { MdClose } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';
// ...
const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const ref = useRef();
  const [existOpen, changeExist] = useState(false);
  const [buyOpen, changeBuy] = useState(false);
  const [infoOpen, changeInfo] = useState(false);
  const [knowOpen, changeKnow] = useState(false);
  function existListener(){
    changeExist(!existOpen);
  }
  function buyListener(){
    changeBuy(!buyOpen);
  }
  function infoListener(){
    changeInfo(!infoOpen);
  }
  function knowListener(){
    changeKnow(!knowOpen);
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
  <ul className={`menu-nav${navbarOpen ? ' show-menu' : ''}`} style = {{paddingLeft:"0px"}}>
  <button className="toggle" onClick={() => setNavbarOpen((prev) => !prev)}>
  <MdClose style={{ width: '32px', height: '32px', position: 'relative', top:'-25px'}} />
  </button>
    <li className = "title"><strong>HenrAI Menu</strong></li>
    <li><a href = "#" onClick = {buyListener}><strong>Buying a Ford</strong></a></li>
    {
      (buyOpen && <div className = "sub" style = {{backgroundColor:"white"}}>
        <li><a href = "#" style = {{backgroundColor:"white",color:"black"}}>Info on a specific car</a></li>
        <li><a href = "#" style = {{backgroundColor:"white",color:"black"}}>Car recommendation</a></li>
        <li><a href = "#" style = {{backgroundColor:"white",color:"black"}}>Car pricing estimator</a></li>
        <li><a href = "#" style = {{backgroundColor:"white",color:"black"}}>Find a dealership</a></li>
      </div>
      )
    }
    <li><a href = "#" onClick = {existListener}><strong>Existing Owner</strong></a></li>
    {
      (existOpen && <div className = "sub" style = {{backgroundColor:"white"}}>
        <li><a href = "#" style = {{backgroundColor:"white",color:"black"}}>Maintenance Request</a></li>
        <li><a href = "#" style = {{backgroundColor:"white",color:"black"}}>Car resale</a></li>
        <li><a href = "#" style = {{backgroundColor:"white",color:"black"}}>Owner service center</a></li>
      </div>
      )
    }
    <li><a href = "#" onClick = {infoListener}><strong>Info about Ford</strong></a></li>
    {
      (infoOpen && <div className = "sub" style = {{backgroundColor:"white"}}>
        <li><a href = "#" style = {{backgroundColor:"white",color:"black"}}>Innovation and Sustainability</a></li>
      </div>)
    }
    <li><a href = "#" onClick = {knowListener}><strong>Know my car's price</strong></a></li>
  </ul>
</nav>
  );
};
export default Navbar;
