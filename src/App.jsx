import { useState } from 'react'

import './App.css'
import Navbar from './Navbar'
import Banner from './Banner'
import MovieList from './MovieList'
import Footer from './Footer'
// API KEY = 3653d331d1f8bb5723ac783e3820216b
// API READ ACCESS TOKEN = eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjUzZDMzMWQxZjhiYjU3MjNhYzc4M2UzODIwMjE2YiIsIm5iZiI6MTc1MjMxNDk1OC42OTIsInN1YiI6IjY4NzIzNDRlZTBkMzY1OTA4MDEwNTg3MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Z9Verzw_CyacGEzS95XH2kc6e4lPWQuIESToTe7rv_o
function App() {

  return (
    <div>
      <Navbar/>
      <Banner/>
      <MovieList/>
      <Footer/>
  </div>
  )
}

export default App
