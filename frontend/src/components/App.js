/* eslint-disable react/prop-types */
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './Home';
import LoginPage from './LoginPage';
import Registration from './Registration';
import ErrorPage from './ErrorPage';
import { AuthProvider } from '../contexts/AutorizationContext';
import useAuth from '../hooks/useAuth';
import routes from '../routes';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  if (auth.user) {
    return children;
  }
  return (
    <Navigate to={routes.login} state={{ from: location }} />
  );
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: `${routes.chat}`,
      element: (
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: `${routes.login}`,
      element: <LoginPage />,
    },
    {
      path: `${routes.signup}`,
      element: <Registration />,
    },
  ]);

  return (
    <AuthProvider>
      <div className="d-flex flex-column h-100">
        <RouterProvider router={router} />
      </div>
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
