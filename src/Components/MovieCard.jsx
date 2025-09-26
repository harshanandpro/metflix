import { useState } from 'react';
import './MovieCard.css';

export default function MovieCard({ movie }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const imgBase = 'https://image.tmdb.org/t/p/w400';
  const fallbackImg = 'https://via.placeholder.com/400x600/1a1a2e/ffffff?text=No+Image';

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const getRatingColor = (rating) => {
    if (rating >= 8) return '#00ff88';
    if (rating >= 6) return '#ffd700';
    return '#ff6b6b';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="movie-card-enhanced">
      {/* Image Container with Loading State */}
      <div className="image-container">
        <div className={`image-skeleton ${imageLoaded ? 'loaded' : ''}`}>
          <div className="skeleton-shimmer"></div>
        </div>
        
        <img
          src={imageError ? fallbackImg : `${imgBase}${movie.poster_path}`}
          alt={movie.title || movie.name}
          className={`movie-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Floating Rating Badge */}
        <div 
          className="rating-badge-floating"
          style={{ '--rating-color': getRatingColor(movie.vote_average) }}
        >
          <span className="rating-icon">★</span>
          <span className="rating-number">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>

        {/* Enhanced Overlay */}
        <div className="movie-overlay-enhanced">
          {/* Gradient Background */}
          <div className="overlay-gradient"></div>
          
          {/* Content */}
          <div className="overlay-content">
            {/* Top Section - Year */}
            <div className="movie-year">
              {formatDate(movie.release_date || movie.first_air_date)}
            </div>

            {/* Middle Section - Title */}
            <h3 className="movie-title-enhanced">
              {movie.title || movie.name}
            </h3>

            {/* Bottom Section - Actions */}
            <div className="movie-actions">
              <button className="action-btn play-btn">
                <span className="btn-icon">▶</span>
                <span className="btn-text">Play</span>
                <div className="btn-ripple"></div>
              </button>
              
              <button className="action-btn info-btn">
                <span className="btn-icon">ⓘ</span>
                <span className="btn-text">Info</span>
                <div className="btn-ripple"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="movie-info-bar">
        <div className="movie-genres">
          <span className="genre-tag">HD</span>
          <span className="genre-tag">Popular</span>
        </div>
        <div className="movie-duration">
          {movie.adult ? '18+' : 'PG'}
        </div>
      </div>
    </div>
  );
}
