import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/metflix.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-left">
        <div className="logo-container">
          <img className="navbar_logo" src={logo} alt="Metflix Logo" />
          <div className="logo-glow"></div>
        </div>
        <h1 className="navbar_title">
          <span className="title-accent">Metflix</span>
        </h1>
      </div>
      
      <div className="navbar-center">
        <nav className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/movies" 
            className={`nav-link ${isActive('/movies') ? 'active' : ''}`}
          >
            Movies
          </Link>
          <Link 
            to="/series" 
            className={`nav-link ${isActive('/series') ? 'active' : ''}`}
          >
            TV Shows
          </Link>
          <Link 
            to="/genres" 
            className={`nav-link ${isActive('/genres') ? 'active' : ''}`}
          >
            Genres
          </Link>
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
      </div>
      
      <div className="navbar-backdrop"></div>
    </div>
  );
};

export default Navbar;
