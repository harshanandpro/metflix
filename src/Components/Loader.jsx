import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spotlight"></div>
      
      <div className="movie-loader">
        {/* Film reels with connecting strip */}
        <div className="film-reel-container">
          <div className="film-reel"></div>
          <div className="film-strip"></div>
          <div className="film-reel"></div>
        </div>
        
        {/* Popcorn animation */}
        <div className="popcorn-container">
          <div className="popcorn"></div>
          <div className="popcorn"></div>
          <div className="popcorn"></div>
          <div className="popcorn"></div>
          <div className="popcorn-box"></div>
        </div>
        
        {/* Loading text */}
        <div className="loading-text">Loading Movies</div>
        
        {/* Progress dots */}
        <div className="progress-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;