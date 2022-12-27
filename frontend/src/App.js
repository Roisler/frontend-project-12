import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import ErrorPage from './routes/ErrorPage';
import './App.css';
import AutorizationContext from './AutorizationContext';
import AutorizationProvider from './AutorizationProvider';

const App = () => {
  const auth = localStorage.getItem('admin');
  const router = createBrowserRouter([
    {
      path: '/',
      element: auth ? <Home /> : <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/login',
      element: <Login />,
    },
  ]);

  return (
    <AutorizationProvider>
      <RouterProvider router={router} />
    </AutorizationProvider>
  );
};

App.ContextType = AutorizationContext;

export default App;
