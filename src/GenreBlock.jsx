import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { API_KEY } from './tmdb';
import MovieCard from './MovieCard';
import './GenreBlock.css';
import left from './left.svg'
import right from './right.svg'

export default function GenreBlock({ genre }) {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    async function fetchMoviesByGenre() {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc`
        );
        setMovies(res.data.results);
      } catch (err) {
        console.error(`Error fetching movies for genre ${genre.name}:`, err);
      }
    }
    fetchMoviesByGenre();
  }, [genre]);

  const scrollRow = (direction) => {
    if (rowRef.current) {
      const scrollAmount = 300; // adjust as you like
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="genre-block">
      <h2 className="genre-title">{genre.name}</h2>
      <div className="scroll-container">
        <img src={left} className="scroll-arrow left" onClick={() => scrollRow('left')}/>
        <div className="movie-row" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <img src={right} className="scroll-arrow right" onClick={() => scrollRow('right')}/>
      </div>
    </div>
  );
}
