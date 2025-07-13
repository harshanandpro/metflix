import React from 'react'
import './Navbar.css'
import logo from './metflix.png'
const Navbar = () => {
 
  return (
    <div className='navbar'>
     <img className='navbar_logo' src={logo} alt="" />
     <p className="navbar_title">Metflix</p>
    </div>
  )
}

export default Navbar