import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { API_KEY } from '../tmdb';
import MovieCard from './MovieCard.jsx';
import './GenreBlock.css';

export default function GenreBlock({ genre, index, isVisible }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const rowRef = useRef(null);

  useEffect(() => {
    async function fetchMoviesByGenre() {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc&page=1`
        );
        setMovies(res.data.results);
        setIsLoading(false);
      } catch (err) {
        console.error(`Error fetching movies for genre ${genre.name}:`, err);
        setIsLoading(false);
      }
    }
    
    if (isVisible) {
      // Stagger the loading of genre blocks
      setTimeout(() => {
        fetchMoviesByGenre();
      }, index * 200);
    }
  }, [genre, isVisible, index]);

  const updateScrollButtons = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scrollRow = (direction) => {
    if (rowRef.current) {
      const scrollAmount = 400;
      const targetScroll = direction === 'left' 
        ? rowRef.current.scrollLeft - scrollAmount 
        : rowRef.current.scrollLeft + scrollAmount;
      
      rowRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
      
      setTimeout(updateScrollButtons, 300);
    }
  };

  useEffect(() => {
    const rowElement = rowRef.current;
    if (rowElement) {
      rowElement.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => rowElement.removeEventListener('scroll', updateScrollButtons);
    }
  }, [movies]);

  if (!isVisible) return null;

  return (
    <div className={`genre-block-enhanced ${isLoading ? 'loading' : ''}`}>
      {/* Enhanced Genre Header */}
      <div className="genre-header">
        <div className="genre-title-section">
          <h2 className="genre-title-enhanced">{genre.name}</h2>
          <div className="genre-count">
            {!isLoading && `${movies.length} movies available`}
          </div>
        </div>
        <div className="genre-actions">
          <button className="view-all-btn">
            View All
            <span className="arrow-right">→</span>
          </button>
        </div>
      </div>

      {/* Enhanced Scroll Container */}
      <div className="scroll-container-enhanced">
        {/* Left Arrow */}
        <button 
          className={`scroll-arrow-enhanced left ${!canScrollLeft ? 'disabled' : ''}`}
          onClick={() => scrollRow('left')}
          disabled={!canScrollLeft}
        >
          <div className="arrow-background"></div>
          <span className="arrow-icon">‹</span>
          <div className="arrow-ripple"></div>
        </button>

        {/* Movie Row */}
        <div 
          className="movie-row-enhanced" 
          ref={rowRef}
          onScroll={updateScrollButtons}
        >
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="movie-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
              </div>
            ))
          ) : (
            movies.map((movie, movieIndex) => (
              <div 
                key={movie.id} 
                className="movie-item-wrapper"
                style={{ 
                  animationDelay: `${movieIndex * 0.1}s`,
                  animationDuration: '0.6s'
                }}
              >
                <MovieCard movie={movie} />
              </div>
            ))
          )}
        </div>

        {/* Right Arrow */}
        <button 
          className={`scroll-arrow-enhanced right ${!canScrollRight ? 'disabled' : ''}`}
          onClick={() => scrollRow('right')}
          disabled={!canScrollRight}
        >
          <div className="arrow-background"></div>
          <span className="arrow-icon">›</span>
          <div className="arrow-ripple"></div>
        </button>

        {/* Progress Indicator */}
        <div className="scroll-progress">
          <div 
            className="progress-fill"
            style={{
              width: rowRef.current 
                ? `${(rowRef.current.scrollLeft / (rowRef.current.scrollWidth - rowRef.current.clientWidth)) * 100}%`
                : '0%'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
