import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../assets/metflix.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-left">
        <div className="logo-container">
          <img className="navbar_logo" src={logo} alt="Metflix Logo" />
          <div className="logo-glow"></div>
        </div>
        <h1 className="navbar_title">
          <span className="title-main">Met</span>
          <span className="title-accent">flix</span>
        </h1>
      </div>
      
      <div className="navbar-center">
        <nav className="nav-links">
          <a href="#home" className="nav-link active">Home</a>
          <a href="#movies" className="nav-link">Movies</a>
          <a href="#series" className="nav-link">TV Shows</a>
          <a href="#genres" className="nav-link">Genres</a>
          <a href="#favorites" className="nav-link">My List</a>
        </nav>
      </div>
      
      <div className="navbar-right">
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search movies..."
          />
          <div className="search-icon">🔍</div>
        </div>
        
        <div className="user-menu">
          <div className="user-avatar">
            <span>U</span>
          </div>
          <div className="dropdown-arrow">▼</div>
        </div>
      </div>
      
      {/* Background blur effect */}
      <div className="navbar-backdrop"></div>
    </div>
  );
};

export default Navbar;