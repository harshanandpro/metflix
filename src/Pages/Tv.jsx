import React, { useState, useEffect } from 'react';
import { API_KEY, BASE_URL } from '../tmdb';
import './TV.css';

const TV = () => {
  const [tvShows, setTvShows] = useState([]);
  const [filteredTvShows, setFilteredTvShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Image base URL for TMDB
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  const fetchTvShowDetails = async (tvId) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`);
    const data = await response.json();
    return {
      number_of_seasons: data.number_of_seasons,
      number_of_episodes: data.number_of_episodes,
      episode_run_time: data.episode_run_time,
      status: data.status,
      in_production: data.in_production
    };
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    return null;
  }
};


  // Fetch TV show genres from TMDB API
  const fetchGenres = async () => {
    try {
      const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Error fetching TV genres:', error);
      setError('Failed to fetch TV show genres');
    }
  };

  // Fetch TV shows from TMDB API
const fetchTvShows = async (page = 1, genreIds = []) => {
  try {
    setIsLoading(true);
    let url;
    
    if (genreIds.length > 0) {
      const genreString = genreIds.join(',');
      url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreString}&page=${page}&sort_by=popularity.desc`;
    } else {
      url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    
    // Fetch detailed information for each TV show
    const showsWithDetails = await Promise.all(
      data.results.slice(0, 10).map(async (show) => { // Limit to 10 to avoid rate limits
        const details = await fetchTvShowDetails(show.id);
        return {
          ...show,
          ...details
        };
      })
    );
    
    if (page === 1) {
      setTvShows(showsWithDetails);
      setFilteredTvShows(showsWithDetails);
    } else {
      setTvShows(prev => [...prev, ...showsWithDetails]);
      setFilteredTvShows(prev => [...prev, ...showsWithDetails]);
    }
    
    setTotalPages(data.total_pages);
    setCurrentPage(page);
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    setError('Failed to fetch TV shows');
  } finally {
    setIsLoading(false);
  }
};
  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      await fetchGenres();
      await fetchTvShows();
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
    fetchTvShows(1, newSelectedGenres);
  };

  // Clear all genre filters
  const clearGenreFilters = () => {
    setSelectedGenres([]);
    setCurrentPage(1);
    fetchTvShows(1, []);
  };

  // Load more TV shows (pagination)
  const loadMoreTvShows = () => {
    if (currentPage < totalPages) {
      fetchTvShows(currentPage + 1, selectedGenres);
    }
  };

  // Get genre names by ID
  const getGenreNames = (genreIds) => {
    return genreIds
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  // Format air date
  const getAirYear = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).getFullYear();
  };

  // Get status badge
  const getStatusBadge = (show) => {
    // For TV shows, we can create a status based on vote average and popularity
    if (show.vote_average >= 8.0) return '🔥 Hot';
    if (show.vote_average >= 7.0) return '⭐ Popular';
    if (show.first_air_date && new Date(show.first_air_date) > new Date('2023-01-01')) return '🆕 New';
    return '📺 Series';
  };

  if (error) {
    return (
      <div className="tv-error">
        <h2>Error Loading TV Shows</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="tv-container">
      <div className="tv-content-wrapper">
        <div className="tv-header">
          <h1>TV Shows</h1>
          <p>Explore the best television series from around the world</p>
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

        {/* TV Shows Grid */}
        <div className="tv-content">
          {isLoading && currentPage === 1 ? (
            <div className="tv-loading">
              <div className="loading-spinner"></div>
              <p>Loading TV shows...</p>
            </div>
          ) : (
            <>
              // Update the TV show card mapping section in TV.jsx
<div className="tv-grid">
  {filteredTvShows.map(show => (
    <div key={show.id} className="tv-card">
      <div className="tv-poster">
        <img
          src={show.poster_path 
            ? `${IMAGE_BASE_URL}${show.poster_path}` 
            : '/api/placeholder/300/450'
          }
          alt={show.name}
          loading="lazy"
        />
        <div className="tv-overlay">
          <div className="tv-overlay-badges">
            <div className="tv-rating">
              ⭐ {show.vote_average.toFixed(1)}
            </div>
            <div className="tv-status-badge">
              {getStatusBadge(show)}
            </div>
          </div>
          
          <div className="tv-overlay-info">
            <h4 className="tv-overlay-title">{show.name}</h4>
            <p className="tv-overlay-year">{getAirYear(show.first_air_date)}</p>
            <div className="tv-overlay-stats">
              {show.number_of_seasons && (
                <span className="tv-seasons-count">
                  🎬 {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}
                </span>
              )}
              {show.number_of_episodes && (
                <span className="tv-episodes-count">
                  📺 {show.number_of_episodes} Episodes
                </span>
              )}
            </div>
            <p className="tv-overlay-genres">{getGenreNames(show.genre_ids)}</p>
          </div>
        </div>
      </div>
      
      <div className="tv-info">
        <h3 className="tv-title">{show.name}</h3>
        
        <div className="tv-meta">
          <span className="tv-air-date">
            First Aired: {getAirYear(show.first_air_date)}
          </span>
          <span className="tv-origin">
            {show.origin_country && show.origin_country[0] && (
              <>📍 {show.origin_country[0]}</>
            )}
          </span>
        </div>
        
        {/* Enhanced TV Show Stats */}
        <div className="tv-series-info">
          <div className="tv-series-stats">
            {show.number_of_seasons && (
              <div className="tv-stat-item">
                <span className="tv-stat-icon">🎬</span>
                <span className="tv-stat-value">{show.number_of_seasons}</span>
                <span className="tv-stat-label">Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {show.number_of_episodes && (
              <div className="tv-stat-item">
                <span className="tv-stat-icon">📺</span>
                <span className="tv-stat-value">{show.number_of_episodes}</span>
                <span className="tv-stat-label">Episode{show.number_of_episodes !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {show.episode_run_time && show.episode_run_time.length > 0 && (
              <div className="tv-stat-item">
                <span className="tv-stat-icon">⏱️</span>
                <span className="tv-stat-value">{show.episode_run_time[0]}</span>
                <span className="tv-stat-label">min/ep</span>
              </div>
            )}
            
            {(!show.number_of_seasons || !show.number_of_episodes) && (
              <div className="tv-stat-item">
                <span className="tv-stat-icon">🔄</span>
                <span className="tv-stat-label">Status: {show.status || 'Unknown'}</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="tv-genres">
          {getGenreNames(show.genre_ids)}
        </p>
        
        <p className="tv-overview">
          {show.overview.length > 120 
            ? `${show.overview.substring(0, 120)}...` 
            : show.overview
          }
        </p>
        
        <div className="tv-bottom-stats">
          <span className="tv-rating-large">
            ⭐ {show.vote_average.toFixed(1)}/10
          </span>
          <span className="tv-popularity">
            🔥 {Math.round(show.popularity)}
          </span>
          {show.first_air_date && (
            <span className="tv-year">
              📅 {getAirYear(show.first_air_date)}
            </span>
          )}
        </div>
      </div>
    </div>
  ))}
</div>


              {/* Load More Button */}
              {currentPage < totalPages && (
                <div className="load-more-section">
                  <button 
                    className="load-more-btn" 
                    onClick={loadMoreTvShows}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Load More TV Shows'}
                  </button>
                </div>
              )}

              {/* Results Info */}
              <div className="results-info">
                <p>
                  Showing {filteredTvShows.length} TV shows
                  {selectedGenres.length > 0 && (
                    <span> in selected genres</span>
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TV;
