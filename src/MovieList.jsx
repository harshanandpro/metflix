import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_KEY } from './tmdb';
import GenreBlock from './GenreBlock';

function MovieList() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
        setGenres(res.data.genres);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    }
    fetchGenres();
  }, []);

  return (
    <div>
      {genres.map((genre) => (
        <GenreBlock key={genre.id} genre={genre} />
      ))}
    </div>
  );
}

export default MovieList