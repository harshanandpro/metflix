import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_KEY, BASE_URL } from '../tmdb';
import './GenreMovies.css';

const GenreMovies = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  // Get genre info from URL params
  const genreId = searchParams.get('genre');
  const genreName = searchParams.get('name');
  const genreType = searchParams.get('type') || 'movie'; // movie or tv
  
  // Image base URL for TMDB
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  // Fetch movies by genre
  const fetchMoviesByGenre = async (page = 1) => {
    if (!genreId) {
      setError('No genre specified');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      let url;
      if (genreType === 'tv') {
        url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`;
      } else {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      setError('Failed to fetch movies');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount or when genre changes
  useEffect(() => {
    setCurrentPage(1);
    setMovies([]);
    fetchMoviesByGenre(1);
  }, [genreId, genreType]);

  // Load more movies
  const loadMoreMovies = () => {
    if (currentPage < totalPages) {
      fetchMoviesByGenre(currentPage + 1);
    }
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate(-1);
  };

  // Handle movie/TV type toggle
  const handleTypeToggle = (newType) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('type', newType);
    navigate(`/genre?${newSearchParams.toString()}`);
  };

  // Format release date
  const getReleaseYear = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).getFullYear();
  };

  // Get title based on type
  const getTitle = (item) => {
    return genreType === 'tv' ? item.name : item.title;
  };

  // Get release date based on type
  const getReleaseDate = (item) => {
    return genreType === 'tv' ? item.first_air_date : item.release_date;
  };

  if (error) {
    return (
      <div className="genre-movies-error">
        <h2>Error Loading Content</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
        <button onClick={handleBackClick}>Go Back</button>
      </div>
    );
  }

  if (!genreId || !genreName) {
    return (
      <div className="genre-movies-error">
        <h2>Invalid Genre</h2>
        <p>No genre information provided</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="genre-movies-container">
      <div className="genre-movies-content-wrapper">
        {/* Header Section */}
        <div className="genre-movies-header">
          <button className="back-button" onClick={handleBackClick}>
            ← Back
          </button>
          
          <div className="genre-title-section">
            <h1 className="genre-title">{genreName}</h1>
            <p className="genre-subtitle">
              {totalResults > 0 && (
                <span>{totalResults.toLocaleString()} {genreType === 'tv' ? 'TV Shows' : 'Movies'} Found</span>
              )}
            </p>
          </div>
          
          {/* Type Toggle */}
          <div className="content-type-toggle">
            <button 
              className={`type-btn ${genreType === 'movie' ? 'active' : ''}`}
              onClick={() => handleTypeToggle('movie')}
            >
              🎬 Movies
            </button>
            <button 
              className={`type-btn ${genreType === 'tv' ? 'active' : ''}`}
              onClick={() => handleTypeToggle('tv')}
            >
              📺 TV Shows
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="genre-movies-content">
          {isLoading && currentPage === 1 ? (
            <div className="genre-movies-loading">
              <div className="loading-spinner"></div>
              <p>Loading {genreName} {genreType === 'tv' ? 'TV Shows' : 'Movies'}...</p>
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="genre-movies-grid">
                {movies.map(item => (
                  <div key={item.id} className="genre-movie-card">
                    <div className="genre-movie-poster">
                      <img
                        src={item.poster_path 
                          ? `${IMAGE_BASE_URL}${item.poster_path}` 
                          : '/api/placeholder/300/450'
                        }
                        alt={getTitle(item)}
                        loading="lazy"
                      />
                      <div className="genre-movie-overlay">
                        <div className="genre-movie-rating">
                          ⭐ {item.vote_average.toFixed(1)}
                        </div>
                        <div className="genre-movie-overlay-info">
                          <h4 className="genre-movie-overlay-title">{getTitle(item)}</h4>
                          <p className="genre-movie-overlay-year">{getReleaseYear(getReleaseDate(item))}</p>
                          {genreType === 'tv' && item.origin_country && (
                            <p className="genre-movie-overlay-country">📍 {item.origin_country[0]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="genre-movie-info">
                      <h3 className="genre-movie-title">{getTitle(item)}</h3>
                      <div className="genre-movie-meta">
                        <span className="genre-movie-year">
                          {getReleaseYear(getReleaseDate(item))}
                        </span>
                        <span className="genre-movie-rating-small">
                          ⭐ {item.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <p className="genre-movie-overview">
                        {item.overview.length > 100 
                          ? `${item.overview.substring(0, 100)}...` 
                          : item.overview || 'No description available.'
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
                    {isLoading ? 'Loading...' : `Load More ${genreType === 'tv' ? 'TV Shows' : 'Movies'}`}
                  </button>
                  <p className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <h3>No {genreType === 'tv' ? 'TV Shows' : 'Movies'} Found</h3>
              <p>Sorry, we couldn't find any {genreType === 'tv' ? 'TV shows' : 'movies'} in the {genreName} genre.</p>
              <button onClick={() => handleTypeToggle(genreType === 'movie' ? 'tv' : 'movie')}>
                Try {genreType === 'movie' ? 'TV Shows' : 'Movies'} Instead
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenreMovies;
