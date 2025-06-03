import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assuming you will create a CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">My Portfolio</Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;