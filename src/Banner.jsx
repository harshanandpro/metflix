import { useEffect, useState } from 'react';
import axios from 'axios';
import { TRENDING_URL } from './tmdb';
import './Banner.css';

export default function Banner() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Fetch trending movies on mount
  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await axios.get(TRENDING_URL);
        setMovies(res.data.results);
      } catch (err) {
        console.error('Error fetching trending:', err);
      }
    }
    fetchTrending();
  }, []);

  // Handle rotation with preload and fade
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setIsFading(true);

      const nextIndex = (currentIndex + 1) % movies.length;
      const nextMovie = movies[nextIndex];

      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/original${nextMovie.backdrop_path}`;

      img.onload = () => {
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setIsFading(false);
        }, 1000); 
      };
    }, 7000); 

    return () => clearInterval(interval);
  }, [movies, currentIndex]);

  const movie = movies[currentIndex];

  if (!movie) return null;

  return (
    <div
      className={`banner-fade-wrapper ${isFading ? 'fade-out' : 'fade-in'}`}
      style={{
        backgroundImage: movie
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : '',
      }}
    >
      <div className="banner-overlay"></div>
      <div className="banner-content">
        <h1>{movie?.title}</h1>
        <p>{movie?.overview?.slice(0, 200)}...</p>
        <div className="banner-buttons">
          <button className="play-btn">▶️ Play</button>
          <button className="list-btn">+ My List</button>
        </div>
      </div>
      <div className="banner-fadeBottom"></div>
    </div>
  );
}
