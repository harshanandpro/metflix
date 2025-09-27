import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_KEY, BASE_URL } from '../tmdb';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all'); // all, movie, tv
  const [actualTotalResults, setActualTotalResults] = useState(0); // NEW: Actual filtered count
  
  // Get search query from URL params
  const searchQuery = searchParams.get('q');
  
  // Image base URL for TMDB
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  // Fetch search results from TMDB API
  const fetchSearchResults = async (page = 1) => {
    if (!searchQuery) {
      setError('No search query provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      // Filter out person results, keep only movies and TV shows
      const mediaResults = data.results.filter(item => 
        item.media_type === 'movie' || item.media_type === 'tv'
      );
      
      if (page === 1) {
        setResults(mediaResults);
        // Calculate actual total by estimating based on filtered results per page
        const filteredRatio = mediaResults.length / data.results.length;
        const estimatedTotal = Math.round(data.total_results * filteredRatio);
        setActualTotalResults(estimatedTotal > 0 ? estimatedTotal : mediaResults.length);
      } else {
        setResults(prev => [...prev, ...mediaResults]);
        // Update the actual total as we load more pages
        setActualTotalResults(prev => prev + mediaResults.length);
      }
      
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results); // Keep original for pagination logic
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to fetch search results');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount or when search query changes
  useEffect(() => {
    setCurrentPage(1);
    setResults([]);
    setActualTotalResults(0); // Reset actual count
    fetchSearchResults(1);
  }, [searchQuery]);

  // Filter results based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredResults(results);
    } else {
      setFilteredResults(results.filter(item => item.media_type === activeFilter));
    }
  }, [results, activeFilter]);

  // Load more results
  const loadMoreResults = () => {
    if (currentPage < totalPages) {
      fetchSearchResults(currentPage + 1);
    }
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate(-1);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Get display title
  const getTitle = (item) => {
    return item.media_type === 'tv' ? item.name : item.title;
  };

  // Get release date
  const getReleaseDate = (item) => {
    return item.media_type === 'tv' ? item.first_air_date : item.release_date;
  };

  // Get release year
  const getReleaseYear = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).getFullYear();
  };

  // Handle result click
  const handleResultClick = (item) => {
    if (item.genre_ids && item.genre_ids.length > 0) {
      const genreId = item.genre_ids[0];
      navigate(`/genre?genre=${genreId}&name=Search Results&type=${item.media_type}`);
    } else {
      navigate(item.media_type === 'tv' ? '/tv' : '/movies');
    }
  };

  // Get filtered counts - UPDATED
  const getFilterCounts = () => {
    const movieCount = results.filter(item => item.media_type === 'movie').length;
    const tvCount = results.filter(item => item.media_type === 'tv').length;
    return { movieCount, tvCount, totalCount: results.length };
  };

  const { movieCount, tvCount, totalCount } = getFilterCounts();

  // Get display count based on active filter - NEW
  const getDisplayCount = () => {
    if (activeFilter === 'movie') {
      return movieCount;
    } else if (activeFilter === 'tv') {
      return tvCount;
    } else {
      return actualTotalResults; // Use actual filtered total for "all"
    }
  };

  if (error) {
    return (
      <div className="search-results-error">
        <h2>Search Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
        <button onClick={handleBackClick}>Go Back</button>
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="search-results-error">
        <h2>No Search Query</h2>
        <p>Please provide a search term</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-results-content-wrapper">
        {/* Header Section */}
        <div className="search-results-header">
          <button className="back-button" onClick={handleBackClick}>
            ← Back
          </button>
          
          <div className="search-title-section">
            <h1 className="search-title">
              Search Results for "{searchQuery}"
            </h1>
            <p className="search-subtitle">
              {!isLoading && getDisplayCount() > 0 && (
                <span>
                  {getDisplayCount().toLocaleString()} {
                    activeFilter === 'movie' ? 'movies' : 
                    activeFilter === 'tv' ? 'TV shows' : 
                    'results'
                  } found
                </span>
              )}
              {!isLoading && getDisplayCount() === 0 && filteredResults.length === 0 && (
                <span>No results found</span>
              )}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="search-filters">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All ({totalCount})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'movie' ? 'active' : ''}`}
            onClick={() => handleFilterChange('movie')}
          >
            🎬 Movies ({movieCount})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'tv' ? 'active' : ''}`}
            onClick={() => handleFilterChange('tv')}
          >
            📺 TV Shows ({tvCount})
          </button>
        </div>

        {/* Results Grid */}
        <div className="search-results-content">
          {isLoading && currentPage === 1 ? (
            <div className="search-results-loading">
              <div className="loading-spinner"></div>
              <p>Searching for "{searchQuery}"...</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <>
              <div className="search-results-grid">
                {filteredResults.map(item => (
                  <div 
                    key={`${item.media_type}-${item.id}`} 
                    className="search-result-card"
                    onClick={() => handleResultClick(item)}
                  >
                    <div className="search-result-poster">
                      <img
                        src={item.poster_path 
                          ? `${IMAGE_BASE_URL}${item.poster_path}` 
                          : '/api/placeholder/300/450'
                        }
                        alt={getTitle(item)}
                        loading="lazy"
                      />
                      <div className="search-result-overlay">
                        <div className="search-result-rating">
                          ⭐ {item.vote_average > 0 ? item.vote_average.toFixed(1) : 'N/A'}
                        </div>
                        <div className="search-result-type-badge">
                          {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                        </div>
                        <div className="search-result-overlay-info">
                          <h4 className="search-result-overlay-title">{getTitle(item)}</h4>
                          <p className="search-result-overlay-year">{getReleaseYear(getReleaseDate(item))}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="search-result-info">
                      <h3 className="search-result-title">{getTitle(item)}</h3>
                      <div className="search-result-meta">
                        <span className="search-result-year">
                          {getReleaseYear(getReleaseDate(item))}
                        </span>
                        <span className="search-result-type">
                          {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                        </span>
                        {item.vote_average > 0 && (
                          <span className="search-result-rating-small">
                            ⭐ {item.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <p className="search-result-overview">
                        {item.overview && item.overview.length > 100 
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
                    onClick={loadMoreResults}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Load More Results'}
                  </button>
                  <p className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="no-search-results">
              <div className="no-results-icon">🔍</div>
              <h3>No Results Found</h3>
              <p>We couldn't find any {activeFilter === 'all' ? 'content' : activeFilter === 'movie' ? 'movies' : 'TV shows'} matching "{searchQuery}"</p>
              <div className="no-results-suggestions">
                <p>Try:</p>
                <ul>
                  <li>Checking your spelling</li>
                  <li>Using different keywords</li>
                  <li>Searching for broader terms</li>
                  {activeFilter !== 'all' && <li>Trying a different content type</li>}
                </ul>
              </div>
              <button onClick={() => navigate('/')} className="home-btn">
                Go Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
