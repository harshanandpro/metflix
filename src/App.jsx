import { useState, useEffect } from "react";
import './App.css'
import Navbar from './Components/Navbar'
import Banner from './Components/Banner'
import MovieList from './Components/MovieList'
import Footer from './Components/Footer'
import Loader from "./Components/Loader";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simple approach: Hide loader after initial data loads
  const handleDataLoaded = () => {
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading && <Loader />}
      
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}>
        <Navbar />
        <Banner />
        <MovieList onDataLoaded={handleDataLoaded} />
        <Footer />
      </div>
    </div>
  );
}

export default App;