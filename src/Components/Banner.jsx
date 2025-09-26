import { useEffect, useState } from "react";
import axios from "axios";
import { TRENDING_URL } from "../tmdb";
import "./Banner.css";

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
        console.error("Error fetching trending:", err);
      }
    }
    fetchTrending();
  }, []);

  // Auto rotate banner
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setIsFading(true);
      const nextIndex = (currentIndex + 1) % movies.length;

      // Preload image
      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/original${movies[nextIndex].backdrop_path}`;
      img.onload = () => {
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setIsFading(false);
        }, 800);
      };
    }, 6000);

    return () => clearInterval(interval);
  }, [movies, currentIndex]);

  const movie = movies[currentIndex];
  if (!movie) return null;

  return (
    <header
      className={`banner ${isFading ? "fade-out" : "fade-in"}`}
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="banner-overlay" />
      <div className="banner-content">
        <h1 className="banner-title">{movie?.title || movie?.name}</h1>
        <p className="banner-overview">
          {movie?.overview?.length > 200
            ? movie.overview.slice(0, 200) + "..."
            : movie.overview}
        </p>
        <div className="banner-buttons">
          <button className="btn play-btn">▶ Play</button>
          <button className="btn list-btn">+ My List</button>
        </div>
      </div>
      <div className="banner-fadeBottom" />
    </header>
  );
}
