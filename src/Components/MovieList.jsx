import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_KEY } from '../tmdb';
import GenreBlock from './GenreBlock';
import './MovieList.css';

function MovieList({ onDataLoaded }) {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGenres() {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        );
        setGenres(res.data.genres);
        
        setTimeout(() => {
          setIsLoading(false);
          if (onDataLoaded) onDataLoaded();
        }, 800);
        
      } catch (err) {
        console.error('Error fetching genres:', err);
        setIsLoading(false);
        if (onDataLoaded) onDataLoaded();
      }
    }
    fetchGenres();
  }, [onDataLoaded]);

  return (
    <div className="movie-list-container">
      {/* Enhanced Header */}
      <div className="movie-list-header">
        <div className="header-content">
          <h1 className="main-title">Discover Movies</h1>
          <p className="main-subtitle">Explore thousands of movies across different genres</p>
        </div>
        <div className="header-decoration">
          <div className="decoration-dot"></div>
          <div className="decoration-dot"></div>
          <div className="decoration-dot"></div>
        </div>
      </div>

      {/* Genre Blocks */}
      <div className={`genres-container ${isLoading ? 'loading' : ''}`}>
        {genres.map((genre, index) => (
          <GenreBlock 
            key={genre.id} 
            genre={genre} 
            index={index}
            isVisible={!isLoading}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieList;
