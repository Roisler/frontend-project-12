/* eslint-disable react/prop-types */
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import ApiContext, { buildApi } from '../contexts/ApiContext';
import Home from './Home';
import LoginPage from './LoginPage';
import Registration from './Registration';
import ErrorPage from './ErrorPage';
import { AuthProvider } from '../contexts/AutorizationContext';
import useAuth from '../hooks/useAuth';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';

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
  const socket = io();
  const dispatch = useDispatch();
  const api = buildApi(socket);

  socket.on('newChannel', (channel) => {
    dispatch(channelsActions.addChannel(channel));
    dispatch(channelsActions.setActiveChannel(channel));
  });

  socket.on('renameChannel', (channel) => {
    const { id, name } = channel;
    dispatch(channelsActions.updateChannel({ id, changes: { name } }));
    dispatch(channelsActions.setActiveChannel(channel));
  });

  socket.on('removeChannel', (channel) => {
    dispatch(channelsActions.removeChannel(channel.id));
  });

  socket.on('newMessage', (message) => {
    dispatch(messagesActions.addMessage(message));
  });

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
      element: <Registration />,
    },
  ]);

  return (
    <ApiContext.Provider value={api}>
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
    </ApiContext.Provider>
  );
};

export default App;
