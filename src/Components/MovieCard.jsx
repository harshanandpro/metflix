import './MovieCard.css';

export default function MovieCard({ movie }) {
  const imgBase = 'https://image.tmdb.org/t/p/w300';

  return (
    <div className="movie-card">
      <img
        src={imgBase + movie.poster_path}
        alt={movie.title}
        className="movie-img"
      />
      <div className="overlay">
        <span className="movie-title">{movie.title}</span>
      </div>
    </div>
  );
}
