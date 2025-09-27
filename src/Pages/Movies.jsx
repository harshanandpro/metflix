import React, { useState, useEffect } from 'react';
import { API_KEY, BASE_URL } from '../tmdb';
import './Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Image base URL for TMDB
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  // Fetch movie genres from TMDB API
  const fetchGenres = async () => {
    try {
      const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setError('Failed to fetch genres');
    }
  };

  // Fetch movies from TMDB API
  const fetchMovies = async (page = 1, genreIds = []) => {
    try {
      setIsLoading(true);
      let url;
      
      if (genreIds.length > 0) {
        // Use discover endpoint with genre filtering
        const genreString = genreIds.join(',');
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreString}&page=${page}&sort_by=popularity.desc`;
      } else {
        // Get popular movies
        url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (page === 1) {
        setMovies(data.results);
        setFilteredMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
        setFilteredMovies(prev => [...prev, ...data.results]);
      }
      
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      await fetchGenres();
      await fetchMovies();
    };
    initializeData();
  }, []);

  // Handle genre selection
  const handleGenreToggle = (genreId) => {
    let newSelectedGenres;
    if (selectedGenres.includes(genreId)) {
      newSelectedGenres = selectedGenres.filter(id => id !== genreId);
    } else {
      newSelectedGenres = [...selectedGenres, genreId];
    }
    
    setSelectedGenres(newSelectedGenres);
    setCurrentPage(1);
    fetchMovies(1, newSelectedGenres);
  };

  // Clear all genre filters
  const clearGenreFilters = () => {
    setSelectedGenres([]);
    setCurrentPage(1);
    fetchMovies(1, []);
  };

  // Load more movies (pagination)
  const loadMoreMovies = () => {
    if (currentPage < totalPages) {
      fetchMovies(currentPage + 1, selectedGenres);
    }
  };

  // Get genre name by ID
  const getGenreNames = (genreIds) => {
    return genreIds
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  if (error) {
    return (
      <div className="movies-error">
        <h2>Error Loading Movies</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="movies-container">
      <div className="movies-header">
        <h1>Movies</h1>
        <p>Discover amazing movies by genre</p>
      </div>

      {/* Genre Filter Section */}
      <div className="genre-filters">
        <div className="genre-filters-header">
          <h3>Filter by Genres</h3>
          {selectedGenres.length > 0 && (
            <button className="clear-filters-btn" onClick={clearGenreFilters}>
              Clear Filters ({selectedGenres.length})
            </button>
          )}
        </div>
        
        <div className="genre-buttons">
          {genres.map(genre => (
            <button
              key={genre.id}
              className={`genre-btn ${selectedGenres.includes(genre.id) ? 'selected' : ''}`}
              onClick={() => handleGenreToggle(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="movies-content">
        {isLoading && currentPage === 1 ? (
          <div className="movies-loading">
            <div className="loading-spinner"></div>
            <p>Loading movies...</p>
          </div>
        ) : (
          <>
            <div className="movies-grid">
              {filteredMovies.map(movie => (
                <div key={movie.id} className="movie-card">
                  <div className="movie-poster">
                    <img
                      src={movie.poster_path 
                        ? `${IMAGE_BASE_URL}${movie.poster_path}` 
                        : '/api/placeholder/300/450'
                      }
                      alt={movie.title}
                      loading="lazy"
                    />
                    <div className="movie-overlay">
                      <div className="movie-rating">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <p className="movie-release-date">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                    <p className="movie-genres">
                      {getGenreNames(movie.genre_ids)}
                    </p>
                    <p className="movie-overview">
                      {movie.overview.length > 100 
                        ? `${movie.overview.substring(0, 100)}...` 
                        : movie.overview
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="load-more-section">
                <button 
                  className="load-more-btn" 
                  onClick={loadMoreMovies}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load More Movies'}
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="results-info">
              <p>
                Showing {filteredMovies.length} movies
                {selectedGenres.length > 0 && (
                  <span> in selected genres</span>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Movies;
