/* eslint-disable react/prop-types */
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import ErrorPage from './routes/ErrorPage';
import './App.css';
import { AuthProvider } from './AutorizationContext';
import Container from './components/Container';
import NavBar from './components/Navbar';
import useAuth from './hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  if (auth.isAuth) {
    return children;
  }
  return (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <SignUp />,
    },
  ]);

  return (
    <AuthProvider>
      <NavBar />
      <Container>
        <RouterProvider router={router} />
      </Container>
    </AuthProvider>
  );
};

export default App;
