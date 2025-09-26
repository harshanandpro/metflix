import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_KEY } from '../tmdb';
import GenreBlock from './GenreBlock';

function MovieList({ onDataLoaded }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        );
        setGenres(res.data.genres);
        
        // Hide loader after a short delay to let the first few genre blocks start loading
        setTimeout(() => {
          if (onDataLoaded) onDataLoaded();
        }, 1500); // Adjust this timing as needed
        
      } catch (err) {
        console.error('Error fetching genres:', err);
        // Still hide loader even if there's an error
        if (onDataLoaded) onDataLoaded();
      }
    }
    fetchGenres();
  }, [onDataLoaded]);

  return (
    <div>
      {genres.map((genre) => (
        <GenreBlock key={genre.id} genre={genre} />
      ))}
    </div>
  );
}

export default MovieList;