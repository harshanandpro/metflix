import { useEffect, useState } from "react";
import axios from "axios";
import { TRENDING_URL } from "../tmdb";
import "./Banner.css";

export default function Banner() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch trending movies on mount
  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await axios.get(TRENDING_URL);
        setMovies(res.data.results);
      } catch (err) {
        console.error("Error fetching trending:", err);
      }
    }
    fetchTrending();
  }, []);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto rotate banner with smooth transition
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % movies.length;
        setCurrentIndex(nextIndex);
        
        // Preload next image
        if (movies[nextIndex]?.backdrop_path) {
          const img = new Image();
          img.src = `https://image.tmdb.org/t/p/original${movies[nextIndex].backdrop_path}`;
        }
        
        setTimeout(() => setIsTransitioning(false), 200);
      }, 600);
    }, 8000);

    return () => clearInterval(interval);
  }, [movies, currentIndex]);

  const movie = movies[currentIndex];
  if (!movie) return null;

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  const navigateToMovie = (index) => {
    if (index === currentIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 200);
    }, 600);
  };

  return (
    <div className="banner-container">
      {/* Dynamic Background with Parallax */}
      <div 
        className={`banner-background ${isTransitioning ? 'transitioning' : ''}`}
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          transform: `translate(${(mousePos.x - 50) * 0.02}px, ${(mousePos.y - 50) * 0.02}px) scale(1.05)`
        }}
      />

      {/* Animated Overlays */}
      <div className="banner-overlay-primary" />
      <div className="banner-overlay-gradient" />
      
      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle particle-${i % 5}`} />
        ))}
      </div>

      {/* Main Content */}
      <div className={`banner-content ${isTransitioning ? 'content-transitioning' : ''}`}>
        
        {/* Movie Rating Badge */}
        <div className="rating-badge">
          <span className="rating-stars">★</span>
          <span className="rating-value">{movie?.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>

        {/* Movie Title with Glitch Effect */}
        <h1 className="banner-title-enhanced">
          <span className="title-main">{movie?.title || movie?.name}</span>
          <span className="title-glitch">{movie?.title || movie?.name}</span>
        </h1>

        {/* Genre Tags */}
        <div className="genre-tags">
          <span className="tag">Trending</span>
          <span className="tag">HD</span>
          <span className="tag">New</span>
        </div>

        {/* Enhanced Overview */}
        <p className="banner-overview-enhanced">
          {movie?.overview?.length > 180
            ? movie.overview.slice(0, 180) + "..."
            : movie.overview}
        </p>

        {/* Action Buttons with Animation */}
        <div className="banner-actions">
          <button className={`btn-enhanced play-btn-enhanced ${isPlaying ? 'playing' : ''}`} 
                  onClick={handlePlayClick}>
            <div className="btn-background"></div>
            <div className="btn-icon">
              {isPlaying ? '⏸' : '▶'}
            </div>
            <span className="btn-text">{isPlaying ? 'Pause' : 'Play'}</span>
            <div className="btn-ripple"></div>
          </button>

          <button className="btn-enhanced info-btn-enhanced">
            <div className="btn-background"></div>
            <div className="btn-icon">ⓘ</div>
            <span className="btn-text">More Info</span>
          </button>

          <button className="btn-enhanced list-btn-enhanced">
            <div className="btn-background"></div>
            <div className="btn-icon">+</div>
            <span className="btn-text">My List</span>
          </button>
        </div>

        {/* Movie Navigation Dots */}
       {/* Movie Navigation Dots - Show all movies */}
<div className="movie-indicators">
  {movies.map((_, index) => (
    <button
      key={index}
      className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
      onClick={() => navigateToMovie(index)}
    >
      <div className="dot-inner"></div>
    </button>
  ))}
</div>
      </div>

      {/* Side Navigation */}
      <div className="side-navigation">
        <button 
          className="nav-arrow nav-prev"
          onClick={() => navigateToMovie((currentIndex - 1 + movies.length) % movies.length)}
        >
          ‹
        </button>
        <button 
          className="nav-arrow nav-next"
          onClick={() => navigateToMovie((currentIndex + 1) % movies.length)}
        >
          ›
        </button>
      </div>

      {/* Progress Bar */}
  <div className="progress-container">
  <div className="progress-bar">
    <div 
      className="progress-fill"
      style={{ width: `${movies.length > 0 ? ((currentIndex + 1) / movies.length) * 100 : 0}%` }}
    ></div>
  </div>
</div>

      {/* Bottom Fade Enhanced */}
      <div className="banner-fade-bottom-enhanced" />
    </div>
  );
}