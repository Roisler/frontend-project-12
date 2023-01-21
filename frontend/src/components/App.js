/* eslint-disable react/prop-types */
import React from 'react';
import {
  BrowserRouter as Router, Routes, Route, useLocation, Navigate,
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

const App = () => (
  <AuthProvider>
    <div className="d-flex flex-column h-100">
      <Router>
        <Routes>
          <Route path={routes.chat} element={(<PrivateRoute><Home /></PrivateRoute>)} />
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.signup} element={<Registration />} />
          <Route path={routes.error} element={<ErrorPage />} />
        </Routes>
      </Router>
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

export default App;
