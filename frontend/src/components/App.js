/* eslint-disable react/prop-types */
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from '../routes/Home';
import LoginPage from './LoginPage';
import SignUp from '../routes/SignUp';
import ErrorPage from './ErrorPage';
import '../App.css';
import { AuthProvider } from '../contexts/AutorizationContext';
import Container from './Container';
import NavBar from './Navbar';
import useAuth from '../hooks/useAuth';

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
      element: <LoginPage />,
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
};

export default App;
