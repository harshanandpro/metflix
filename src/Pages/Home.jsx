import React, { useState } from 'react';
import Banner from '../Components/Banner';
import MovieList from '../Components/MovieList';
import Loader from '../Components/Loader';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleDataLoaded = () => {
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}>
        <Banner />
        <MovieList onDataLoaded={handleDataLoaded} />
      </div>
    </div>
  );
};

export default Home;
