import React, { useState, useEffect, useRef } from 'react';
import '../styles/Navbar.css';
import { MdClose } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const ref = useRef();
  const [existOpen, changeExist] = useState(false);
  const [buyOpen, changeBuy] = useState(false);
  const [infoOpen, changeInfo] = useState(false);
  const [knowOpen, changeKnow] = useState(false);
  const [maintainOpen, changeMaintain] = useState(false);

  function existListener() {
    changeExist(!existOpen);
  }

  function maintainListener() {
    changeMaintain(!maintainOpen);
  }

  function buyListener() {
    changeBuy(!buyOpen);
  }

  function infoListener() {
    changeInfo(!infoOpen);
  }

  function knowListener() {
    changeKnow(!knowOpen);
  }

  useEffect(() => {
    const handler = (event) => {
      if (navbarOpen && ref.current && !ref.current.contains(event.target)) {
        setNavbarOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [navbarOpen]);

  return (
    <nav ref={ref} className="navbar">
      <button className="toggle" onClick={() => setNavbarOpen((prev) => !prev)}>
        {navbarOpen ? (
          <MdClose style={{ width: '32px', height: '32px' }} />
        ) : (
          <FiMenu style={{ width: '32px', height: '32px' }} />
        )}
      </button>
      <ul className={`menu-nav${navbarOpen ? ' show-menu' : ''}`}>
        <button className="toggle" onClick={() => setNavbarOpen((prev) => !prev)}>
          <MdClose style={{ width: '32px', height: '32px', position: 'relative', top: '-28px', right: '-5px' }} />
        </button>
        <li className="title">
          <strong>HenrAI Menu</strong>
        </li>
        <li>
          <a href="#" onClick={buyListener}>
            <strong>Buying a Ford</strong>
            {/* <span className={`dropdown-arrow${buyOpen ? ' open' : ''}`}>&#9660;</span> */}
          </a>
        </li>
        {buyOpen && (
          <div className="sub" style={{ backgroundColor: 'white' }}>
            <li>
              <a href="#" style={{ backgroundColor: 'white', color: 'black', marginBottom: '0px' }}>
                Info on a specific car
              </a>
            </li>
            <li>
              <a href="#" style={{ backgroundColor: 'white', color: 'black', marginBottom: '0px' }}>
                Car recommendation
              </a>
            </li>
            <li>
              <a href="#" style={{ backgroundColor: 'white', color: 'black', marginBottom: '0px' }}>
                Car pricing estimator
              </a>
            </li>
            <li>
              <a href="#" style={{ backgroundColor: 'white', color: 'black', marginBottom: '0px' }}>
                Find a dealership
              </a>
            </li>
          </div>
        )}
        <li>
          <a href="#" onClick={existListener}>
            <strong>Existing Owner</strong>
            {/* <span className={`dropdown-arrow${existOpen ? ' open' : ''}`}>&#9660;</span> */}
          </a>
        </li>
        {existOpen && (
          <div className="sub" style={{ backgroundColor: 'white' }}>
            <li>
              <a href="#" onClick={maintainListener} style={{ backgroundColor: 'white', color: 'black', marginBottom: '0px' }}>
                Maintenance Request
              </a>
              {maintainOpen && (
                <div>
                  <li>
                    <a href="#" style={{ backgroundColor: 'white', color: 'black', marginBottom: '0px' }}>
                      Locating Dealers
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ backgroundColor: 'white', color: 'black', marginBottom: '0px' }}>
                      Questions About Maintenance
                    </a>
                  </li>
                </div>
              )}
            </li>
            <li>
              <a href="#" style={{ backgroundColor: 'white', color: 'black', marginBottom: '0px' }}>
                Car resale
              </a>
            </li>
          </div>
        )}
        <li>
          <a href="#" onClick={infoListener}>
            <strong>Info about Ford</strong>
            {/* <span className={`dropdown-arrow${infoOpen ? ' open' : ''}`}>&#9660;</span> */}
          </a>
        </li>
        {infoOpen && (
          <div className="sub" style={{ backgroundColor: 'white' }}>
            <li>
              <a href="#" style={{ backgroundColor: 'white', color: 'black', marginBottom: '0px' }}>
                Innovation and Sustainability
              </a>
            </li>
          </div>
        )}
        <li>
          <a href="#" onClick={knowListener}>
            <strong>Know my car's price</strong>
            <span className={`dropdown-arrow${knowOpen ? ' open' : ''}`}>&#9660;</span>
          </a>
        </li>
        {knowOpen && (
          <div className="sub" style={{ backgroundColor: 'white' }}>
            <li>
              <a href="#" style={{ backgroundColor: 'white', color: 'black', marginBottom: '0px' }}>
                Electric Vehicles
              </a>
            </li>
            <li>
              <a href="#" style={{ backgroundColor: 'white', color: 'black', marginBottom: '0px' }}>
                Dealer Negotiation
              </a>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
