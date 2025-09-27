import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import Home from './Pages/Home';
import Movies from './Pages/Movies';
import TVShows from './Pages/Tv';
// import Genres from './Pages/Genres';
import './App.css';
import GenreMovies from './Pages/GenreMovies';
import SearchResults from './Pages/SearchResults';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/movies',
        element: <Movies />,
      },
      {
        path: '/series',
        element: <TVShows />,
      },
      {
        path: '/genre',
        element: <GenreMovies />,
      },
      {
  path: '/search',
  element: <SearchResults />,
},

    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
