import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import Home from './Pages/Home';
import Movies from './Pages/Movies';
import TVShows from './Pages/Tv';
// import Genres from './Pages/Genres';
import './App.css';

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
      // {
      //   path: '/genres',
      //   element: <Genres />,
      // },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
