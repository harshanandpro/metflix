import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { API_KEY, BASE_URL } from '../tmdb';
import './Navbar.css';
import logo from '../assets/metflix.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showGenresPopup, setShowGenresPopup] = useState(false);
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const genresPopupRef = useRef(null);
  const searchResultsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  // Image base URL for TMDB
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w92'; // Small size for search results

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside click to close popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close genres popup
      if (genresPopupRef.current && !genresPopupRef.current.contains(event.target)) {
        setShowGenresPopup(false);
      }
      
      // Close search results
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    if (showGenresPopup) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showGenresPopup, showSearchResults]);

  // Debounced search function
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);

      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      // Filter and limit results
      const filteredResults = data.results
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .slice(0, 8); // Limit to 8 results
      
      setSearchResults(filteredResults);
      setShowSearchResults(filteredResults.length > 0 || query.trim().length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to search. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debouncing
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms delay
  };

  // Handle search result click
  const handleSearchResultClick = (item) => {
    setShowSearchResults(false);
    setSearchQuery('');
    
    // Navigate to genre page with the item's genre
    if (item.genre_ids && item.genre_ids.length > 0) {
      const genreId = item.genre_ids[0]; // Use first genre
      const genreName = getGenreName(genreId, item.media_type);
      navigate(`/genre?genre=${genreId}&name=${encodeURIComponent(genreName)}&type=${item.media_type}`);
    } else {
      // Fallback to movies or tv page
      navigate(item.media_type === 'tv' ? '/tv' : '/movies');
    }
  };

  // Get genre name by ID (simplified - you might want to fetch this properly)
  const getGenreName = (genreId, mediaType) => {
    const allGenres = mediaType === 'tv' ? tvGenres : movieGenres;
    const genre = allGenres.find(g => g.id === genreId);
    return genre ? genre.name : 'Unknown';
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      // Navigate to a search results page or perform search
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchError(null);
  };

  // Fetch genres when popup opens
  const fetchGenres = async () => {
    if (movieGenres.length > 0 && tvGenres.length > 0) return;
    
    setIsLoadingGenres(true);
    try {
      const [movieResponse, tvResponse] = await Promise.all([
        fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`),
        fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`)
      ]);

      const movieData = await movieResponse.json();
      const tvData = await tvResponse.json();

      setMovieGenres(movieData.genres || []);
      setTvGenres(tvData.genres || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setIsLoadingGenres(false);
    }
  };

  const handleGenresClick = (e) => {
    e.preventDefault();
    setShowGenresPopup(true);
    fetchGenres();
  };

  const handleGenreSelect = (genreId, genreName, type) => {
    setShowGenresPopup(false);
    navigate(`/genre?genre=${genreId}&name=${encodeURIComponent(genreName)}&type=${type}`);
  };

  const isActive = (path) => location.pathname === path;

  // Get display title for search results
  const getTitle = (item) => {
    return item.media_type === 'tv' ? item.name : item.title;
  };

  // Get release year
  const getReleaseYear = (item) => {
    const date = item.media_type === 'tv' ? item.first_air_date : item.release_date;
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  return (
    <>
      <div className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-left">
          <div className="logo-container">
            <img className="navbar_logo" src={logo} alt="Metflix Logo" />
            <div className="logo-glow"></div>
          </div>
          <h1 className="navbar_title">
            <Link to="/" className="title-accent ">Metflix</Link>
          </h1>
        </div>
        
        <div className="navbar-center">
          <nav className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className={`nav-link ${isActive('/movies') ? 'active' : ''}`}
            >
              Movies
            </Link>
            <Link 
              to="/tv" 
              className={`nav-link ${isActive('/tv') ? 'active' : ''}`}
            >
              TV Shows
            </Link>
            <span 
              className="nav-link"
              onClick={handleGenresClick}
              style={{ cursor: 'pointer' }}
            >
              Genres
            </span>
          </nav>
        </div>
        
        <div className="navbar-right">
          <div className="search-container" ref={searchInputRef}>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search movies & TV shows..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
              />
              <div className="search-actions">
                {searchQuery && (
                  <button 
                    type="button" 
                    className="search-clear"
                    onClick={clearSearch}
                  >
                    ✕
                  </button>
                )}
                <button type="submit" className="search-icon">
                  🔍
                </button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {/* Search Results Dropdown */}
{showSearchResults && (
  <div className="navbar-search-dropdown" ref={searchResultsRef}>
    {isSearching ? (
      <div className="navbar-search-loading">
        <div className="navbar-search-spinner"></div>
        <span>Searching...</span>
      </div>
    ) : searchError ? (
      <div className="navbar-search-error">
        <span>{searchError}</span>
      </div>
    ) : searchResults.length > 0 ? (
      <>
        <div className="navbar-search-header">
          <span>Search Results</span>
          {searchQuery && (
            <button 
              className="navbar-view-all-btn"
              onClick={() => {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                setShowSearchResults(false);
                setSearchQuery('');
              }}
            >
              View All
            </button>
          )}
        </div>
        <div className="navbar-search-list">
          {searchResults.map(item => (
            <div 
              key={`${item.media_type}-${item.id}`} 
              className="navbar-search-item"
              onClick={() => handleSearchResultClick(item)}
            >
              <div className="navbar-search-poster">
                {item.poster_path ? (
                  <img 
                    src={`${IMAGE_BASE_URL}${item.poster_path}`} 
                    alt={getTitle(item)}
                    loading="lazy"
                  />
                ) : (
                  <div className="navbar-search-no-image">
                    {item.media_type === 'tv' ? '📺' : '🎬'}
                  </div>
                )}
              </div>
              <div className="navbar-search-info">
                <h4 className="navbar-search-title">{getTitle(item)}</h4>
                <div className="navbar-search-meta">
                  <span className="navbar-search-type">
                    {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                  </span>
                  <span className="navbar-search-year">
                    {getReleaseYear(item)}
                  </span>
                  {item.vote_average > 0 && (
                    <span className="navbar-search-rating">
                      ⭐ {item.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    ) : searchQuery.trim() ? (
      <div className="navbar-search-no-results">
        <span>No results found for "{searchQuery}"</span>
      </div>
    ) : null}
  </div>
)}
          </div>
        </div>
        
        <div className="navbar-backdrop"></div>
      </div>

      {/* Genres Popup Modal */}
      {showGenresPopup && (
        <div className="genres-modal-overlay">
          <div className="genres-modal" ref={genresPopupRef}>
            <div className="genres-modal-header">
              <h2>Browse by Genres</h2>
              <button 
                className="genres-close-btn"
                onClick={() => setShowGenresPopup(false)}
              >
                ✕
              </button>
            </div>

            {isLoadingGenres ? (
              <div className="genres-loading">
                <div className="genres-spinner"></div>
                <p>Loading genres...</p>
              </div>
            ) : (
              <div className="genres-content">
                <div className="genres-section">
                  <h3 className="genres-section-title">
                    <span className="genres-icon">🎬</span>
                    Movie Genres
                  </h3>
                  <div className="genres-grid">
                    {movieGenres.map(genre => (
                      <button
                        key={`movie-${genre.id}`}
                        className="genre-item movie-genre"
                        onClick={() => handleGenreSelect(genre.id, genre.name, 'movie')}
                      >
                        <span className="genre-name">{genre.name}</span>
                        <span className="genre-arrow">→</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="genres-section">
                  <h3 className="genres-section-title">
                    <span className="genres-icon">📺</span>
                    TV Show Genres
                  </h3>
                  <div className="genres-grid">
                    {tvGenres.map(genre => (
                      <button
                        key={`tv-${genre.id}`}
                        className="genre-item tv-genre"
                        onClick={() => handleGenreSelect(genre.id, genre.name, 'tv')}
                      >
                        <span className="genre-name">{genre.name}</span>
                        <span className="genre-arrow">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
